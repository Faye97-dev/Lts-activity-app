import { db } from "db";

// todo add types
const groupByTimebyDate = (timeline: any, departmentId: string) => {
    // ? timeline should ordered in asc by created at !!
    let groupByDate = ""
    let updatedTimeline: any = {}

    timeline.map((item: any) => {
        const itemDate = item?.createdAt?.toISOString()?.split('T')[0] || ""
        if (itemDate && itemDate === groupByDate) {
            updatedTimeline[groupByDate].totalCreated = updatedTimeline[groupByDate].totalCreated + item.totalCreated
        } else if (itemDate) {
            groupByDate = itemDate
            const { id, activityId, totalCreated } = item
            updatedTimeline[groupByDate] = { id, activityId, departmentId, totalCreated, createdAt: groupByDate }
        }
    })

    return updatedTimeline = Object.values(updatedTimeline)
}

const mergeTimelines = (timelines: any[][]) => {
    const flattenTimelines = timelines.reduce((prev, next) => prev.concat(next))

    const trackedDates: any[] = []
    const mergedTimelines: any[] = []

    flattenTimelines.map((item: any) => {
        if (!trackedDates.includes(item.createdAt)) {
            const filteredTimelineByDate = flattenTimelines.filter((timeline: any) => timeline.createdAt === item.createdAt)

            const totalCreated = filteredTimelineByDate.reduce((accumulator, timeline) => {
                const currentValue = parseInt(timeline.totalCreated)
                return accumulator + currentValue
            }, 0)

            trackedDates.push(item.createdAt)
            mergedTimelines.push({ ...item, totalCreated })
        }
    })

    return mergedTimelines
}

const generateCumulativeTotalCreated = (timeline: any) => {
    let prevCumulativeTotalCreated = 0
    return timeline.map((item: any) => {
        const newItem = { ...item, cumulativeTotalCreated: item.totalCreated + prevCumulativeTotalCreated }
        prevCumulativeTotalCreated = newItem.cumulativeTotalCreated
        return newItem
    })
}


export const getActivitiesKpis = async (data: any) => {
    const activity = await db.query.activities.findFirst({
        where: (activities, { eq }) => eq(activities.id, data.activity_id),
        with: {
            timeline: {
                orderBy: (timeline, { desc }) => [desc(timeline.createdAt)],
            }
        },
    });

    if (!activity) {
        return false
    }

    const latestTimeline = activity?.timeline?.[0]
    const totalTarget = activity?.totalTarget ? parseInt(activity.totalTarget) : 0
    const totalCreated = latestTimeline?.cumulativeTotalCreated ? parseInt(latestTimeline.cumulativeTotalCreated) : 0

    let timeline = groupByTimebyDate(activity?.timeline?.reverse() || [], activity.departmentId)
    timeline = generateCumulativeTotalCreated(timeline)

    return {
        timeline,
        kpis: {
            totalTarget,
            totalCreated,
            activitiesCount: null,
            departmentCount: null,
        },
    }
}


export const getDepartmentKpis = async (data: any) => {
    const department = await db.query.departments.findFirst({
        where: (departments, { eq }) => eq(departments.id, data.department_id),
        with: {
            activities: {
                with: {
                    timeline: {
                        orderBy: (timeline, { desc }) => [desc(timeline.createdAt)],
                    }
                }
            }
        },

    });

    if (!department) {
        return false;
    }

    // 
    const totalTarget = department?.activities.reduce((accumulator, activity) => {
        const currentValue = activity?.totalTarget ? parseInt(activity.totalTarget) : 0
        return accumulator + currentValue
    }, 0)
    const totalCreated = department?.activities.reduce((accumulator, activity) => {
        const latestTimeline = activity?.timeline?.[0]
        const currentValue = latestTimeline?.cumulativeTotalCreated ? parseInt(latestTimeline.cumulativeTotalCreated) : 0
        return accumulator + currentValue
    }, 0)

    //
    let departementTimelines: any[][] = department.activities.map(activity => {
        return groupByTimebyDate(activity?.timeline?.reverse() || [], activity.departmentId)
    })
    let timeline = mergeTimelines(departementTimelines)
    timeline = generateCumulativeTotalCreated(timeline)

    return {
        kpis: {
            totalTarget,
            totalCreated,
            departmentCount: null,
            activitiesCount: department?.activities.length || 0,
        },
        timeline,
        // departementTimelines, // ? for debuging
    }
}

export const getKpis = async () => {
    const departments = await db.query.departments.findMany({
        with: {
            activities: {
                with: {
                    timeline: {
                        orderBy: (timeline, { desc }) => [desc(timeline.createdAt)],
                    }
                }
            }
        },

    });


    // 
    let totalTarget = 0;
    departments.map(department => {
        const departmentTotalTarget = department?.activities.reduce((accumulator, activity) => {
            const currentValue = activity?.totalTarget ? parseInt(activity.totalTarget) : 0
            return accumulator + currentValue
        }, 0)
        totalTarget += departmentTotalTarget;
    })

    let totalCreated = 0;
    departments.map(department => {
        const departmentTotalCreated = department?.activities.reduce((accumulator, activity) => {
            const latestTimeline = activity?.timeline?.[0]
            const currentValue = latestTimeline?.cumulativeTotalCreated ? parseInt(latestTimeline.cumulativeTotalCreated) : 0
            return accumulator + currentValue
        }, 0)
        totalCreated += departmentTotalCreated;
    })

    const activitiesCount = departments.reduce((accumulator, department) => {
        return accumulator + department.activities.length
    }, 0)

    //
    let timelines: any[][] = []
    departments.map(department => {
        department.activities.map(activity => {
            timelines.push(groupByTimebyDate(activity?.timeline?.reverse() || [], activity.departmentId))
        })
    })
    let timeline = mergeTimelines(timelines)
    timeline = generateCumulativeTotalCreated(timeline)

    return {
        kpis: {
            totalTarget,
            totalCreated,
            activitiesCount,
            departmentCount: departments.length,
        },
        timeline,
        // timelines, // ? for debuging
    }
}
import { KpisSchemaType } from "@/api/kpis/route";
import { db } from "db";
import { Timeline } from "db/schema";

// todo add comments

type TimelineKpisType = { id: string; createdAt: string; activityId: string; totalCreated: string; departmentId: string; }

const groupByTimebyDate = (timeline: Timeline[], departmentId: string) => {
    // ? timeline should ordered in asc by created at !!
    let groupByDate = ""
    let updatedTimeline: Record<string, TimelineKpisType> = {}

    timeline.map((item: Timeline) => {
        const itemDate = item?.createdAt?.toISOString()?.split('T')[0] || ""
        if (itemDate && itemDate === groupByDate) {
            updatedTimeline[groupByDate].totalCreated = updatedTimeline[groupByDate].totalCreated + item.totalCreated
        } else if (itemDate) {
            groupByDate = itemDate
            const { id, activityId, totalCreated } = item
            updatedTimeline[groupByDate] = { id, activityId, departmentId, totalCreated, createdAt: groupByDate }
        }
    })

    return Object.values(updatedTimeline)
}

const mergeTimelines = (timelines: TimelineKpisType[][]) => {
    const flattenTimelines = timelines.reduce((prev, next) => prev.concat(next))

    const trackedDates: string[] = []
    const mergedTimelines: TimelineKpisType[] = []

    flattenTimelines.map((item: TimelineKpisType) => {
        if (!trackedDates.includes(item.createdAt)) {
            const filteredTimelineByDate = flattenTimelines.filter((timeline: TimelineKpisType) => timeline.createdAt === item.createdAt)

            const totalCreated = filteredTimelineByDate.reduce((accumulator, timeline) => {
                const currentValue = parseInt(timeline.totalCreated)
                return accumulator + currentValue
            }, 0).toString()

            trackedDates.push(item.createdAt)
            mergedTimelines.push({ ...item, totalCreated })
        }
    })

    return mergedTimelines
}

const generateCumulativeTotalCreated = (timeline: TimelineKpisType[]) => {
    let prevCumulativeTotalCreated = 0
    return timeline.map((item: TimelineKpisType) => {
        const newItem = { ...item, cumulativeTotalCreated: parseInt(item.totalCreated) + prevCumulativeTotalCreated }
        prevCumulativeTotalCreated = newItem.cumulativeTotalCreated
        return newItem
    })
}


export const getActivitiesKpis = async (data: KpisSchemaType) => {
    const activity = await db.query.activities.findFirst({
        where: (activities, { eq }) => eq(activities.id, data.activity_id || ""),
        with: {
            timeline: {
                orderBy: (timeline, { desc }) => [desc(timeline.createdAt)],
            }
        },
    });

    if (!activity) return false

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


export const getDepartmentKpis = async (data: KpisSchemaType) => {
    const department = await db.query.departments.findFirst({
        where: (departments, { eq }) => eq(departments.id, data.department_id || ""),
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

    if (!department) return false;

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
    let departementTimelines: TimelineKpisType[][] = department.activities.map(activity => {
        return groupByTimebyDate(activity?.timeline?.reverse() || [], activity.departmentId)
    })
    let timeline = mergeTimelines(departementTimelines)
    timeline = generateCumulativeTotalCreated(timeline)

    return {
        kpis: {
            activitiesCount: department?.activities.length || 0,
            totalTarget,
            totalCreated,
            departmentCount: null,
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
    let timelines: TimelineKpisType[][] = []
    departments.map(department => {
        department.activities.map(activity => {
            timelines.push(groupByTimebyDate(activity?.timeline?.reverse() || [], activity.departmentId))
        })
    })
    let timeline = mergeTimelines(timelines)
    timeline = generateCumulativeTotalCreated(timeline)

    return {
        kpis: {
            departmentCount: departments.length,
            activitiesCount,
            totalTarget,
            totalCreated,
        },
        timeline,
        // timelines, // ? for debuging
    }
}
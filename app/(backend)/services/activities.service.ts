import { ROLE_DEFAULT, ROLE_SUPER_ADMIN } from "config/global.config";
import { activities, timeline } from "db/schema"
import { eq } from "drizzle-orm"
import { db } from "db";

export const addActivity = async ({ userRole, data }: any) => {
    if (userRole === ROLE_SUPER_ADMIN) {
        const activity = await db.insert(activities).values({
            name: data.name,
            endDate: data.endDate,
            startDate: data.startDate,
            manager: data.manager || null,
            totalTarget: data.totalTarget,
            departmentId: data.departmentId,
        }).returning()
        return activity?.[0]
    }
    return false
}


export const updateActivity = async ({ userRole, data, params }: any) => {
    if (userRole === ROLE_SUPER_ADMIN) {
        const updatedActivity = await db.update(activities)
            .set({
                name: data.name,
                endDate: data.endDate,
                startDate: data.startDate,
                manager: data.manager || null,
                totalTarget: data.totalTarget,
            })
            .where(eq(activities.id, params.id))
            .returning();
        return updatedActivity?.[0]
    } else if (userRole === ROLE_DEFAULT) {
        const updatedActivity = await db.update(activities)
            .set({ comment: data.comment, totalCreated: data.totalCreated })
            .where(eq(activities.id, params.id))
            .returning();

        await db.insert(timeline).values({
            activityId: params.id,
            comment: data.comment || "",
            totalCreated: data.totalCreated,
        })
        return updatedActivity?.[0]
    }
    return false
}

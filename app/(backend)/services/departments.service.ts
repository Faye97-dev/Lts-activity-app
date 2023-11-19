import { ROLE_SUPER_ADMIN } from "config/global.config";
import { activities, departments, timeline, users } from "db/schema"
import { eq, inArray } from "drizzle-orm"
import { db } from "db";

// todo add types 
export const updateDepartment = async ({ userRole, data, params }: any) => {
    if (userRole === ROLE_SUPER_ADMIN) {
        const { departmentName, departmentSlug, email, phone, isActive, lastName, firstName, whatsappPhone } = data
        const department = await db.update(departments)
            .set({ name: departmentName, slug: departmentSlug })
            .where(eq(departments.id, params.id))
            .returning()

        const updatedUser = await db.update(users)
            .set({ email, phone, isActive, lastName, firstName, whatsappPhone })
            .where(eq(users.id, data.userId))
            .returning();

        return { ...updatedUser?.[0], department: department?.[0] }
    }
    return false
}

export const deleteDepartment = async ({ userRole, params }: any) => {
    if (userRole === ROLE_SUPER_ADMIN) {
        await db.delete(departments).where(eq(departments.id, params.id))
        await db.delete(users).where(eq(users.departmentId, params.id))

        // activities
        const departmentActivities = await db.query.activities.findMany({
            where: (activities, { eq }) => eq(activities.departmentId, params.id),
            columns: { id: true },
        })
        const activitiesIds = departmentActivities.map((item: { id: string }) => item.id);
        await db.delete(activities).where(eq(activities.departmentId, params.id))

        // timeline
        await db.delete(timeline).where(inArray(timeline.activityId, activitiesIds))
        return { message: "Ok" }
    }
    return false
}
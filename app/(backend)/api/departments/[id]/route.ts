import { db } from "db"
import { activities, departments, timeline, users } from "db/schema"
import { eq, inArray } from "drizzle-orm"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        // todo add db transaction 
        // department and user
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

        return Response.json({ message: "Ok" }, { status: 200 })
    } catch (e) {
        console.log(e)
    }
    return Response.json({ message: "Bad request" }, { status: 400 })
}
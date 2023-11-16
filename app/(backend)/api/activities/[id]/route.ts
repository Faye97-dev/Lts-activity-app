import { ROLE_DEFAULT, ROLE_SUPER_ADMIN } from "config/global.config";
import { db } from "db";
import { activities, timeline } from "db/schema";
import { eq } from "drizzle-orm";
import { auth } from "lib/auth";

/*
{
  "totalCreated":90,
  "totalTarget": 100,
  "comment" : "Hellooo"
} 
*/
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        // todo add validation with zod 
        // todo add db transaction 

        const session = await auth();
        if (!session?.user || !session?.user?.token?.role)
            return Response.json({ message: "Unauthorized" }, { status: 401 })

        const data = await request.json()
        const userRole = session.user.token.role.slug
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
            return Response.json(updatedActivity, { status: 200 })
        } else if (userRole === ROLE_DEFAULT) {
            const updatedActivity = await db.update(activities)
                .set({
                    comment: data.comment,
                    totalCreated: data.totalCreated,
                })
                .where(eq(activities.id, params.id))
                .returning();

            await db.insert(timeline).values({
                activityId: params.id,
                comment: data.comment || "",
                totalCreated: data.totalCreated,
            })
            return Response.json(updatedActivity, { status: 200 })
        }

        return Response.json({ message: "Unauthorized" }, { status: 403 })
    } catch (e) {
        console.log(e)
    }
    return Response.json({ message: "Bad request" }, { status: 400 })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        // todo add db transaction 
        await db.delete(activities).where(eq(activities.id, params.id))
        await db.delete(timeline).where(eq(timeline.activityId, params.id))

        return Response.json({ message: "Ok" }, { status: 200 })
    } catch (e) {
        console.log(e)
    }
    return Response.json({ message: "Bad request" }, { status: 400 })
}
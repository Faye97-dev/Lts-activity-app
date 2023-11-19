import { updateActivity } from "@/services/activities.service";
import { ROLE_SUPER_ADMIN } from "config/global.config";
import { activities, timeline } from "db/schema";
import { eq } from "drizzle-orm";
import { auth } from "lib/auth";
import { db } from "db";

/*
{
  "totalCreated":90,
  "totalTarget": 100,
  "comment" : "Hellooo"
} 
*/
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        // todo add db transaction 
        // todo add validation with zod 
        const session = await auth();
        if (!session?.user || !session?.user?.token?.role)
            return Response.json({ message: "Unauthorized" }, { status: 401 })

        const data = await request.json()
        const userRole = session.user.token.role.slug

        const updatedActivity = await updateActivity({ userRole, data, params })
        if (updatedActivity) return Response.json(updatedActivity, { status: 200 })
        return Response.json({ message: "Unauthorized" }, { status: 403 })
    } catch (e) {
        console.log(e)
        return Response.json({ message: "Bad request" }, { status: 400 })
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        // todo add db transaction 
        const session = await auth();
        if (!session?.user || !session?.user?.token?.role)
            return Response.json({ message: "Unauthorized" }, { status: 401 })

        const userRole = session.user.token.role.slug
        if (userRole === ROLE_SUPER_ADMIN) {
            await db.delete(activities).where(eq(activities.id, params.id))
            await db.delete(timeline).where(eq(timeline.activityId, params.id))
            return Response.json({ message: "Ok" }, { status: 200 })
        }
        return Response.json({ message: "Unauthorized" }, { status: 403 })
    } catch (e) {
        console.log(e)
        return Response.json({ message: "Bad request" }, { status: 400 })
    }
}
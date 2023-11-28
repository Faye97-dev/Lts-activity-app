import { updateActivity } from "@/services/activities.service";
import { ROLE_SUPER_ADMIN } from "config/global.config";
import { activities, timeline } from "db/schema";

import { db } from "db";
import { auth } from "lib/auth";
import { eq } from "drizzle-orm";
import { updateActivitySchema } from "app/(backend)/validators/activities.schema";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        // todo add db transaction 
        const session = await auth();
        if (!session?.user || !session?.user?.token?.role)
            return Response.json({ message: "Unauthorized" }, { status: 401 })

        const data = await request.json()
        const response = updateActivitySchema.safeParse(data);

        if (response.success) {
            const userRole = session.user.token.role.slug
            const updatedActivity = await updateActivity({ userRole, data: response.data, params })
            if (updatedActivity) return Response.json(updatedActivity, { status: 200 })

            return Response.json({ message: "Unauthorized" }, { status: 403 })
        } else {
            return Response.json({ message: "Bad request", errors: response.error.issues }, { status: 422 })
        }
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
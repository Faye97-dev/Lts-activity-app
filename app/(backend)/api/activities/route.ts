import { addActivity } from "@/services/activities.service";
import { NextRequest } from "next/server";
import { activities } from "db/schema";

import { db } from "db";
import { auth } from "lib/auth";
import { eq } from "drizzle-orm";
import { addActivitySchema } from "app/(backend)/validators/activities.schema";


export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user || !session?.user?.token?.role)
            return Response.json({ message: "Unauthorized" }, { status: 401 })

        const data = await request.json()
        const response = addActivitySchema.safeParse(data);

        if (response.success) {
            // todo add db transaction 
            const userRole = session.user.token.role.slug
            const activity = await addActivity({ userRole, data: response.data })
            if (activity) return Response.json(activity, { status: 201 })

            return Response.json({ message: "Unauthorized" }, { status: 403 })
        } else {
            return Response.json({ message: "Bad request", errors: response.error.issues }, { status: 422 })
        }
    } catch (e) {
        console.log(e)
        return Response.json({ message: "Bad request" }, { status: 400 })
    }
}

export async function GET(request: NextRequest) {
    try {
        // todo add pagination
        const session = await auth();
        if (!session?.user || !session?.user?.token?.role)
            return Response.json({ message: "Unauthorized" }, { status: 401 })

        const searchParams = request.nextUrl.searchParams
        const departmentId = searchParams.get('department_id')
        const result = await db.query.activities.findMany({
            with: {
                department: true,
                timeline: {
                    limit: 1,
                    orderBy: (timeline, { desc }) => [desc(timeline.createdAt)],
                }
            },
            ...(departmentId && { where: eq(activities.departmentId, departmentId) }),
            orderBy: (activities, { desc }) => [desc(activities.createdAt)],
        });
        return Response.json(result, { status: 200 })
    } catch (e) {
        console.log(e)
        return Response.json({ message: "Bad request" }, { status: 400 })
    }
}
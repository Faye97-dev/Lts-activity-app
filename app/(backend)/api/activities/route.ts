import { addActivity } from "@/services/activities.service";
import { NextRequest } from "next/server";
import { activities } from "db/schema";
import { eq } from "drizzle-orm";
import { auth } from "lib/auth";
import { db } from "db";

/*
{
  "startDate": "2022-10-21",
  "endDate": "2023-11-09",
  "departmentId" : "bdc0ca60-35dd-421f-b49b-58eec98d3d24",
  "manager" : "eren",
  "name": "Activity 1"
}
*/

export async function POST(request: Request) {
    try {
        // todo add validation with zod 
        const session = await auth();
        if (!session?.user || !session?.user?.token?.role)
            return Response.json({ message: "Unauthorized" }, { status: 401 })

        const data = await request.json()
        const userRole = session.user.token.role.slug

        const activity = await addActivity({ userRole, data })
        if (activity) return Response.json(activity, { status: 200 })
        return Response.json({ message: "Unauthorized" }, { status: 403 })
    } catch (e) {
        console.log(e)
    }
    return Response.json({ message: "Bad request" }, { status: 400 })
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
            with: { department: true },
            ...(departmentId && { where: eq(activities.departmentId, departmentId) }),
            orderBy: (activities, { desc }) => [desc(activities.createdAt)],
        });
        return Response.json(result, { status: 200 })
    } catch (e) {
        console.log(e)
    }
    return Response.json({ message: "Bad request" }, { status: 400 })
}
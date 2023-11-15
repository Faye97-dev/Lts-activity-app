import { db } from "db";
import { activities, } from "db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

/*
{
  "startDate": "2022-10-21",
  "endDate": "2023-11-09",
  "departmentId" : "bdc0ca60-35dd-421f-b49b-58eec98d3d24",
  "manager" : "eren",
  "name": "Activity 1"
}
*/

// todo check if logged
export async function POST(request: Request) {
    try {
        const data = await request.json()
        // todo add validation with zod 
        const activity = await db.insert(activities).values({
            startDate: data.startDate, endDate: data.endDate, name: data.name,
            departmentId: data.departmentId, manager: data.manager || null
        }).returning()

        return Response.json(activity?.[0], { status: 201 })
    } catch (e) {
        console.log(e)
    }
    return Response.json({ message: "Bad request" }, { status: 400 })
}

export async function GET(request: NextRequest) {
    try {
        // todo add pagination
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
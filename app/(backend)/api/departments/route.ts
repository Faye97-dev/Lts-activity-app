import { registerNewUser } from "@/services/users.service";
import { db } from "db";
import { departments } from "db/schema";

/*
{
  "departmentName": "test",
  "departmentSlug": "Ab",
  "password" : "admin",
  "firstName" :"dev",
  "lastName" : "user",
  "email" : "dev@gmail.com"
}
*/

// todo check if logged
export async function POST(request: Request) {
    try {
        const data = await request.json()
        // todo add validation with zod 
        // todo add db transaction 
        const department = await db.insert(departments).values({
            name: data.departmentName, slug: data.departmentSlug
        }).returning()

        data.departmentId = department?.[0]?.id
        const user = await registerNewUser(data)

        const result = { ...user, department: department?.[0] }
        return Response.json(result, { status: 201 })
    } catch (e) {
        console.log(e)
    }
    return Response.json({ message: "Bad request" }, { status: 400 })
}

export async function GET(request: Request) {
    try {
        // todo add pagination
        const departments = await db.query.departments.findMany({
            with: {
                activities: true, users: {
                    columns: { password: false }
                }
            },
            orderBy: (departments, { desc }) => [desc(departments.createdAt)],
        });
        return Response.json(departments, { status: 200 })
    } catch (e) {
        console.log(e)
    }
    return Response.json({ message: "Bad request" }, { status: 400 })
}
import { registerNewUser } from "@/services/users.service";
import { ROLE_ADMIN, ROLE_SUPER_ADMIN } from "config/global.config";
import { departments } from "db/schema";
import { auth } from "lib/auth";
import { db } from "db";

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

export async function POST(request: Request) {
    // todo add db transaction 
    // todo add validation with zod 
    try {
        const data = await request.json()
        const department = await db.insert(departments).values({
            name: data.departmentName, slug: data.departmentSlug
        }).returning()

        data.departmentId = department?.[0]?.id
        const user = await registerNewUser(data)
        return Response.json({ ...user, department: department?.[0] }, { status: 201 })
    } catch (e) {
        console.log(e)
        return Response.json({ message: "Bad request" }, { status: 400 })
    }
}

export async function GET(request: Request) {
    try {
        // todo add pagination
        const session = await auth();
        if (!session?.user || !session?.user?.token?.role)
            return Response.json({ message: "Unauthorized" }, { status: 401 })

        const userRole = session.user.token.role.slug
        if (userRole === ROLE_SUPER_ADMIN || userRole === ROLE_ADMIN) {
            const departments = await db.query.departments.findMany({
                with: { activities: true, users: { columns: { password: false } } },
                orderBy: (departments, { desc }) => [desc(departments.createdAt)],
            });
            return Response.json(departments, { status: 200 })
        }
        return Response.json({ message: "Unauthorized" }, { status: 403 })
    } catch (e) {
        console.log(e)
        return Response.json({ message: "Bad request" }, { status: 400 })
    }
}
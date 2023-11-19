import { registerNewUser } from "@/services/users.service";
import { ROLE_SUPER_ADMIN } from "config/global.config";
import { auth } from "lib/auth";
import { db } from "db";

export async function POST(request: Request) {
    try {
        // todo add validation with zod 
        const session = await auth();
        if (!session?.user || !session?.user?.token?.role)
            return Response.json({ message: "Unauthorized" }, { status: 401 })

        const data = await request.json()
        const userRole = session.user.token.role.slug
        if (userRole === ROLE_SUPER_ADMIN) {
            const user = await registerNewUser(data)
            return Response.json(user, { status: 201 })
        }
        return Response.json({ message: "Unauthorized" }, { status: 403 })
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
        if (userRole === ROLE_SUPER_ADMIN) {
            const users = await db.query.users.findMany({
                with: { role: true, department: true },
                columns: { password: false },
                orderBy: (users, { desc }) => [desc(users.createdAt)],
            });
            return Response.json(users, { status: 200 })
        }
        return Response.json({ message: "Unauthorized" }, { status: 403 })
    } catch (e) {
        console.log(e)
        return Response.json({ message: "Bad request" }, { status: 400 })
    }
}
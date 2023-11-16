import { registerNewUser } from "@/services/users.service";
import { db } from "db";


// todo check if logged
export async function POST(request: Request) {
    try {
        const data = await request.json()
        // todo add validation with zod 
        const user = await registerNewUser(data)
        return Response.json(user, { status: 201 })
    } catch (e) {
        console.log(e)
    }
    return Response.json({ message: "Bad request" }, { status: 400 })
}

export async function GET(request: Request) {
    try {
        // todo add pagination
        const users = await db.query.users.findMany({
            with: { role: true, department: true },
            columns: { password: false },
            orderBy: (users, { desc }) => [desc(users.createdAt)],
        });
        return Response.json(users, { status: 200 })
    } catch (e) {
        console.log(e)
    }
    return Response.json({ message: "Bad request" }, { status: 400 })
}
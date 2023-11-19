import { ROLE_ADMIN, ROLE_SUPER_ADMIN } from "config/global.config";
import { db } from "db";
import { users } from "db/schema";
import { eq } from "drizzle-orm";
import { auth } from "lib/auth";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        // todo add validation with zod 
        const session = await auth();
        if (!session?.user || !session?.user?.token?.role)
            return Response.json({ message: "Unauthorized" }, { status: 401 })

        const data = await request.json()
        const userRole = session.user.token.role.slug
        if (userRole === ROLE_SUPER_ADMIN || userRole === ROLE_ADMIN) {
            const { email, phone, isActive, lastName, firstName, whatsappPhone } = data
            const updatedUser = await db.update(users)
                .set({ email, phone, isActive, lastName, firstName, whatsappPhone })
                .where(eq(users.id, params.id))
                .returning();
            return Response.json(updatedUser, { status: 200 })
        }
        return Response.json({ message: "Unauthorized" }, { status: 403 })
    } catch (e) {
        console.log(e)
        return Response.json({ message: "Bad request" }, { status: 400 })
    }
}
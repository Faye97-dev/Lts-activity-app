import { ROLE_SUPER_ADMIN } from "config/global.config";
import { db } from "db"
import { activities, departments, timeline, users } from "db/schema"
import { eq, inArray } from "drizzle-orm"
import { auth } from "lib/auth";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        // todo add db transaction 
        // todo add validation with zod 
        const session = await auth();
        if (!session?.user || !session?.user?.token?.role)
            return Response.json({ message: "Unauthorized" }, { status: 401 })

        const data = await request.json()
        const userRole = session.user.token.role.slug
        if (userRole === ROLE_SUPER_ADMIN) {
            const { departmentName, departmentSlug, email, phone, isActive, lastName, firstName, whatsappPhone } = data
            const department = await db.update(departments)
                .set({ name: departmentName, slug: departmentSlug })
                .where(eq(departments.id, params.id))
                .returning()

            const updatedUser = await db.update(users)
                .set({ email, phone, isActive, lastName, firstName, whatsappPhone })
                .where(eq(users.id, data.userId))
                .returning();

            const result = { ...updatedUser?.[0], department: department?.[0] }
            return Response.json(result, { status: 200 })
        }
        return Response.json({ message: "Unauthorized" }, { status: 403 })
    } catch (e) {
        console.log(e)
    }
    return Response.json({ message: "Bad request" }, { status: 400 })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        // todo add db transaction 
        // department and user
        const session = await auth();
        if (!session?.user || !session?.user?.token?.role)
            return Response.json({ message: "Unauthorized" }, { status: 401 })

        const userRole = session.user.token.role.slug
        if (userRole === ROLE_SUPER_ADMIN) {
            await db.delete(departments).where(eq(departments.id, params.id))
            await db.delete(users).where(eq(users.departmentId, params.id))

            // activities
            const departmentActivities = await db.query.activities.findMany({
                where: (activities, { eq }) => eq(activities.departmentId, params.id),
                columns: { id: true },
            })
            const activitiesIds = departmentActivities.map((item: { id: string }) => item.id);
            await db.delete(activities).where(eq(activities.departmentId, params.id))

            // timeline
            await db.delete(timeline).where(inArray(timeline.activityId, activitiesIds))
            return Response.json({ message: "Ok" }, { status: 200 })
        }
        return Response.json({ message: "Unauthorized" }, { status: 403 })
    } catch (e) {
        console.log(e)
    }
    return Response.json({ message: "Bad request" }, { status: 400 })
}
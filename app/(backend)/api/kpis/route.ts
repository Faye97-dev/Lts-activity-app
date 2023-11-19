import { getActivitiesKpis, getDepartmentKpis, getKpis } from "@/services/kpis.service";
import { ROLE_ADMIN, ROLE_SUPER_ADMIN } from "config/global.config";
import { auth } from "lib/auth";

export async function POST(request: Request) {
    try {
        // todo add validation with zod 
        const session = await auth();
        if (!session?.user || !session?.user?.token?.role)
            return Response.json({ message: "Unauthorized" }, { status: 401 })

        const data = await request.json()
        const userRole = session.user.token.role.slug
        if (userRole === ROLE_SUPER_ADMIN || userRole === ROLE_ADMIN) {
            if (data?.activity_id) {
                const result = await getActivitiesKpis(data)
                if (!result) return Response.json({ message: "Not found" }, { status: 404 })
                return Response.json(result, { status: 200 })
            }

            if (data?.department_id) {
                const result = await getDepartmentKpis(data)
                if (!result) return Response.json({ message: "Not found" }, { status: 404 })
                return Response.json(result, { status: 200 })
            }

            const result = await getKpis()
            if (!result) return Response.json({ message: "Not found" }, { status: 404 })
            return Response.json(result, { status: 200 })
        }
        return Response.json({ message: "Unauthorized" }, { status: 403 })
    } catch (e) {
        console.log(e)
        return Response.json({ message: "Bad request" }, { status: 400 })
    }
}
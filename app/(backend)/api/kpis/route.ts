import { getActivitiesKpis, getDepartmentKpis, getKpis } from "@/services/kpis.service";
import { ROLE_ADMIN, ROLE_SUPER_ADMIN } from "config/global.config";
import { auth } from "lib/auth";
import * as z from 'zod';

const kpisSchema = z.object({
    activity_id: z.string().optional(),
    department_id: z.string().optional(),
});
export type KpisSchemaType = z.infer<typeof kpisSchema>;

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user || !session?.user?.token?.role)
            return Response.json({ message: "Unauthorized" }, { status: 401 })

        const data = await request.json()
        const userRole = session.user.token.role.slug
        const response = kpisSchema.safeParse(data);

        if (response.success) {
            if (userRole === ROLE_SUPER_ADMIN || userRole === ROLE_ADMIN) {
                if (response.data?.activity_id) {
                    const result = await getActivitiesKpis(response.data)
                    if (!result) return Response.json({ message: "Not found" }, { status: 404 })
                    return Response.json(result, { status: 200 })
                }

                if (response.data?.department_id) {
                    const result = await getDepartmentKpis(response.data)
                    if (!result) return Response.json({ message: "Not found" }, { status: 404 })
                    return Response.json(result, { status: 200 })
                }

                const result = await getKpis()
                if (!result) return Response.json({ message: "Not found" }, { status: 404 })
                return Response.json(result, { status: 200 })
            }
            return Response.json({ message: "Unauthorized" }, { status: 403 })
        } else {
            return Response.json({ message: "Bad request", errors: response.error.issues }, { status: 422 })
        }
    } catch (e) {
        console.log(e)
        return Response.json({ message: "Bad request" }, { status: 400 })
    }
}
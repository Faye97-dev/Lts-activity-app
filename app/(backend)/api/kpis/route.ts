import { getActivitiesKpis, getDepartmentKpis, getKpis } from "@/services/kpis.service";

export async function POST(request: Request) {
    try {
        // todo add validation with zod 
        const data = await request.json()

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

    } catch (e) {
        console.log(e)
    }
    return Response.json({ message: "Bad request" }, { status: 400 })
}
import { deleteDepartment, updateDepartment } from "@/services/departments.service";
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

        const updatedDepartment = await updateDepartment({ userRole, data, params })
        if (updatedDepartment) return Response.json(updatedDepartment, { status: 200 })
        return Response.json({ message: "Unauthorized" }, { status: 403 })
    } catch (e) {
        console.log(e)
        return Response.json({ message: "Bad request" }, { status: 400 })
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        // todo add db transaction 
        const session = await auth();
        if (!session?.user || !session?.user?.token?.role)
            return Response.json({ message: "Unauthorized" }, { status: 401 })

        const userRole = session.user.token.role.slug
        const result = await deleteDepartment({ userRole, params })
        if (result) return Response.json(result, { status: 200 })
        return Response.json({ message: "Unauthorized" }, { status: 403 })
    } catch (e) {
        console.log(e)
        return Response.json({ message: "Bad request" }, { status: 400 })
    }
}
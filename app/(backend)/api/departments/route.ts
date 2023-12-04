import { ROLE_ADMIN, ROLE_SUPER_ADMIN } from "config/global.config"
import { db } from "db"
import { departments } from "db/schema"
import { auth } from "lib/auth"

import { addDepartmentSchema } from "@/validators/departments.schema"
import { registerNewUser } from "@/services/users.service"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user || !session?.user?.token?.role)
      return Response.json({ message: "Unauthorized" }, { status: 401 })

    const data = await request.json()
    const userRole = session.user.token.role.slug
    const response = addDepartmentSchema.safeParse(data)

    if (response.success) {
      if (userRole === ROLE_SUPER_ADMIN) {
        // todo add db transaction
        const { departmentName, departmentSlug, ...rest } = response.data
        const departmentPayload = { name: departmentName, slug: departmentSlug }
        const department = await db.insert(departments).values(departmentPayload).returning()
        const user = await registerNewUser({ ...rest, departmentId: department?.[0]?.id })

        return Response.json({ ...user, department: department?.[0] }, { status: 201 })
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

export async function GET(request: Request) {
  try {
    // todo add pagination
    const session = await auth()
    if (!session?.user || !session?.user?.token?.role)
      return Response.json({ message: "Unauthorized" }, { status: 401 })

    const userRole = session.user.token.role.slug
    if (userRole === ROLE_SUPER_ADMIN || userRole === ROLE_ADMIN) {
      const departments = await db.query.departments.findMany({
        with: { activities: true, users: { columns: { password: false } } },
        orderBy: (departments, { desc }) => [desc(departments.createdAt)],
      })
      return Response.json(departments, { status: 200 })
    }
    return Response.json({ message: "Unauthorized" }, { status: 403 })
  } catch (e) {
    console.log(e)
    return Response.json({ message: "Bad request" }, { status: 400 })
  }
}

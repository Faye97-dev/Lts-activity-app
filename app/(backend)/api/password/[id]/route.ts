import { hash } from "bcrypt"
import { ROLE_ADMIN, ROLE_SUPER_ADMIN } from "config/global.config"
import { db } from "db"
import { users } from "db/schema"
import { eq } from "drizzle-orm"
import { auth } from "lib/auth"
import * as z from "zod"

const updatePasswordSchema = z.object({
  password: z.string(),
  confirmPassword: z.string(), // todo fixme
})

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session?.user || !session?.user?.token?.role)
      return Response.json({ message: "Unauthorized" }, { status: 401 })

    const data = await request.json()
    const userRole = session.user.token.role.slug
    const response = updatePasswordSchema.safeParse(data)

    if (response.success) {
      if (userRole === ROLE_SUPER_ADMIN || userRole === ROLE_ADMIN) {
        const hashedPassword = await hash(response.data.password, 10) // todo fix salt
        const updatedUser = await db
          .update(users)
          .set({ password: hashedPassword })
          .where(eq(users.id, params.id))
          .returning()
        return Response.json(updatedUser, { status: 200 })
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

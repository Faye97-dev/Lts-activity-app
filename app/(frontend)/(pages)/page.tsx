import { redirect } from "next/navigation"
import { ROLE_ADMIN, ROLE_DEFAULT, ROLE_SUPER_ADMIN, ROUTES_GUARDS } from "config/global.config"
import { auth } from "lib/auth"

export default async function IndexPage() {
  const session = await auth()

  if (session?.user) {
    switch (session.user?.token.role.slug) {
      case ROLE_SUPER_ADMIN:
        redirect(ROUTES_GUARDS[ROLE_SUPER_ADMIN].default)
      case ROLE_ADMIN:
        redirect(ROUTES_GUARDS[ROLE_ADMIN].default)
      default:
        redirect(ROUTES_GUARDS[ROLE_DEFAULT].default)
    }
  }

  return <></>
}

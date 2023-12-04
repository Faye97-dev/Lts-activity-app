import { auth } from "lib/auth"

import Navbar from "@/components/navbar"

export default async function Nav() {
  const session = await auth()
  return <Navbar user={session?.user} />
}

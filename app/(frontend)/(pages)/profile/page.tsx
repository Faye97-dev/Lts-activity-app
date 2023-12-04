import React from "react"
import { redirect } from "next/navigation"
import { auth } from "lib/auth"

import { ProfileForm } from "./components/profile-form"

export default async function page() {
  const session = await auth()
  if (!session?.user) redirect("/api/auth/signin") // todo update to /login

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <ProfileForm />
    </main>
  )
}

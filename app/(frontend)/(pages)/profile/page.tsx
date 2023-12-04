import React from "react"

import { ProfileForm } from "./components/profile-form"

export default async function page() {
  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <ProfileForm />
    </main>
  )
}

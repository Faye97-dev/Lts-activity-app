import React from "react"
import { redirect } from "next/navigation"
import { Card, Title } from "@tremor/react"
import { auth } from "lib/auth"

import ActivitiesTable from "./components/activities-table"

export default async function ActivitiesPage() {
  const session = await auth()
  if (!session?.user) redirect("/api/auth/signin") // todo update to /login

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title className="font-semibold">Liste des activités</Title>
      <Card className="mt-4 p-4">
        <ActivitiesTable />
      </Card>
    </main>
  )
}

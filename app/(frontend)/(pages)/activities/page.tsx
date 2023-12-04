import React from "react"
import { Card, Title } from "@tremor/react"

import ActivitiesTable from "./components/activities-table"

export default async function ActivitiesPage() {
  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title className="font-semibold">Liste des activités</Title>
      <Card className="mt-4 p-4">
        <ActivitiesTable />
      </Card>
    </main>
  )
}

import { Card, Text, Title } from "@tremor/react"
import DepartmentsTable from "app/(frontend)/(pages)/departments/components/departments-table"
import NewDepartmentDrawer from "app/(frontend)/(pages)/departments/components/new-department-drawer"
import { db } from "db"

export default async function DepartmentsPage() {
  const roles = await db.query.roles.findMany()
  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title className="font-semibold">Departements</Title>
      <div className="flex items-center justify-between">
        <Text>Ajouter, editer des departements.</Text>
        <NewDepartmentDrawer roles={roles} />
      </div>
      <Card className="mt-4 p-4">
        <DepartmentsTable />
      </Card>
    </main>
  )
}

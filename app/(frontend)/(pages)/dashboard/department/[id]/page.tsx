import { redirect } from "next/navigation"
import { Badge, Tab, TabGroup, TabList, TabPanel, TabPanels, Title } from "@tremor/react"
import { db } from "db"
import { auth } from "lib/auth"

import ActivitiesTable from "../../components/activities-table"
import KpisTabpanel from "../../components/kpis-tabpanel"

export default async function DepartmentKpisPage({ params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) redirect("/api/auth/signin") // todo update to /login

  const department = await db.query.departments.findFirst({
    where: (departments, { eq }) => eq(departments.id, params.id),
  })

  // todo add error page
  if (!department) return "Error ..."

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <div className="flex items-center gap-3">
        <Title className="capitalize">{department?.name}</Title>
        <Badge color={"orange"}>{department?.slug}</Badge>
      </div>
      <TabGroup className="mt-4">
        <TabList>
          <Tab>Statistiques</Tab>
          <Tab>Activités</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <KpisTabpanel metricsCount={3} department_id={params.id} />
          </TabPanel>
          <TabPanel>
            <ActivitiesTable department_id={params.id} />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </main>
  )
}

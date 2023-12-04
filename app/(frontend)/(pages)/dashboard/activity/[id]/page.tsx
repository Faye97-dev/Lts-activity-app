import { Badge, Tab, TabGroup, TabList, TabPanel, TabPanels, Title } from "@tremor/react"
import { db } from "db"

import KpisTabpanel from "../../components/kpis-tabpanel"

export default async function ActivityKpisPage({ params }: { params: { id: string } }) {
  const activity = await db.query.activities.findFirst({
    where: (activities, { eq }) => eq(activities.id, params.id),
  })

  // todo add error page
  if (!activity) return "Error ..."

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <div className="flex items-center gap-3">
        <Title className="capitalize">{activity?.name}</Title>
        <Badge color={"pink"}>{activity?.manager}</Badge>
      </div>
      <TabGroup className="mt-4">
        <TabList>
          <Tab>Statistiques</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <KpisTabpanel metricsCount={2} activity_id={params.id} />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </main>
  )
}

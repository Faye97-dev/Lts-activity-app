import {
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Title
} from '@tremor/react';

import KpisTabpanel from './components/kpis-tabpanel';
import DepartmentsTable from './components/departments-table';
import { auth } from 'lib/auth';
import { redirect } from 'next/navigation';

export default async function KpisPage() {
  const session = await auth();
  if (!session?.user) redirect('/api/auth/signin'); // todo update to /login

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>Tableau de bord State</Title>
      <TabGroup className="mt-4">
        <TabList>
          <Tab>Statistiques</Tab>
          <Tab>Departements</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <KpisTabpanel metricsCount={4} />
          </TabPanel>
          <TabPanel>
            <DepartmentsTable />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </main>
  );
}

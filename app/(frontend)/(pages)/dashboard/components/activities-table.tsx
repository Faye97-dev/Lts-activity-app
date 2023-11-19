'use client';
import { useGenericQuery } from '@/hooks/useApi';
import {
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Text
} from '@tremor/react';
import { API_ACTIVITIES_LIST } from 'config/api-endpoints.config';
import { Activity, Department, Timeline } from 'db/schema';
import { PackageOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';

type ActivityType = Activity & {
  createdAt: string;
  timeline: Timeline[];
  department: Department;
};
export default function ActivitiesTable({
  department_id
}: {
  department_id: string;
}) {
  const router = useRouter();
  const { isLoading, data: payload } = useGenericQuery<null, ActivityType[]>({
    queryKey: 'QUERY_ACTIVITIES_LIST',
    requestData: {
      method: 'GET',
      url: API_ACTIVITIES_LIST,
      queryParams: { department_id }
    }
  });

  // todo add skeleton
  if (isLoading) return 'En cours de chargement ...';

  return (
    <>
      <Table className="mt-8">
        <TableHead>
          <TableRow className="border-b">
            <TableHeaderCell className="p-3">Titre</TableHeaderCell>
            <TableHeaderCell className="p-3">Date de début</TableHeaderCell>
            <TableHeaderCell className="p-3">Date de fin</TableHeaderCell>
            <TableHeaderCell className="p-3">Structure Pilote</TableHeaderCell>
            <TableHeaderCell className="p-3">Nombre crée</TableHeaderCell>
            <TableHeaderCell className="p-3">Nombre cible</TableHeaderCell>
            <TableHeaderCell className="p-3">Commentaire</TableHeaderCell>
          </TableRow>
        </TableHead>

        {!!payload?.length && (
          <TableBody>
            {payload.map((activity) => {
              return (
                <TableRow
                  key={activity.id}
                  className="hover:bg-slate-50 transition ease-in-out cusror-pointer"
                  onClick={() =>
                    router.push(`/dashboard/activity/${activity.id}`)
                  }
                >
                  <TableCell className="p-3">{activity.name}</TableCell>
                  <TableCell className="p-3">
                    {activity.startDate?.split('T')?.[0]}
                  </TableCell>
                  <TableCell className="p-3">
                    {activity.endDate?.split('T')?.[0]}
                  </TableCell>
                  <TableCell className="p-3">
                    {activity.manager || '--'}
                  </TableCell>
                  <TableCell className="p-3">
                    <Text>
                      {activity.timeline?.[0]?.cumulativeTotalCreated || '--'}
                    </Text>
                  </TableCell>
                  <TableCell className="p-3">
                    <Text>{activity.totalTarget || '--'}</Text>
                  </TableCell>
                  <TableCell className="p-3">
                    {activity.comment || '--'}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        )}
      </Table>

      {!payload?.length && (
        <div className="mt-10 mb-6 flex gap-2 items-center text-lg justify-center w-full font-semibold text-blue-500">
          <PackageOpen className="h-6 w-6" /> Aucune données a afficher !
        </div>
      )}
    </>
  );
}

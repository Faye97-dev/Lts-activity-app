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
import { Activity, Department, User } from 'db/schema';
import { MoreVertical, PackageOpen, PencilIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import EditActivityModal from './edit-activity-modal';
import { useSession } from 'next-auth/react';

type ActivityType = Activity & { createdAt: string; department: Department };
export default function ActivitiesTable() {
  const [openEditActivityModal, setOpenEditActivityModal] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<ActivityType | null>(
    null
  );

  const { data: session } = useSession();
  const { isLoading, data: payload } = useGenericQuery<null, ActivityType[]>({
    queryKey: 'QUERY_ACTIVITIES_LIST',
    requestData: {
      method: 'GET',
      url: API_ACTIVITIES_LIST,
      queryParams: { department_id: session?.user?.token?.departmentId || '' }
    }
  });

  const toogleEditActivityModal = (
    isOpen: boolean = false,
    activity: ActivityType | null = null
  ) => {
    setOpenEditActivityModal(isOpen);
    setCurrentActivity(activity);
  };

  // todo add skeleton
  if (isLoading) return 'En cours de chargement ...';

  return (
    <>
      <EditActivityModal
        open={openEditActivityModal}
        activity={currentActivity}
        setOpen={setOpenEditActivityModal}
        onClose={() => toogleEditActivityModal(false)}
      />

      <Table>
        <TableHead>
          <TableRow className="border-b">
            <TableHeaderCell className="p-3">Titre</TableHeaderCell>
            <TableHeaderCell className="p-3">Date de début</TableHeaderCell>
            <TableHeaderCell className="p-3">Date de fin</TableHeaderCell>
            <TableHeaderCell className="p-3">Structure Pilote</TableHeaderCell>
            <TableHeaderCell className="p-3">Nombre crée</TableHeaderCell>
            <TableHeaderCell className="p-3">Nombre cible</TableHeaderCell>
            <TableHeaderCell className="p-3">Commentaire</TableHeaderCell>
            {/* <TableHeaderCell className="p-3">Ajouté le</TableHeaderCell> */}
            <TableHeaderCell className="p-3">Actions</TableHeaderCell>
          </TableRow>
        </TableHead>

        {!!payload?.length && (
          <TableBody>
            {payload.map((activity) => {
              // const manager = activity.users?.[0];
              return (
                <TableRow key={activity.id}>
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
                    <Text>{activity.totalCreated || '--'}</Text>
                  </TableCell>
                  <TableCell className="p-3">
                    <Text>{activity.totalTarget || '--'}</Text>
                  </TableCell>
                  <TableCell className="p-3">
                    {activity.comment || '--'}
                  </TableCell>
                  {/* <TableCell className="p-3">
                    {activity.createdAt?.split('T')?.[0]}
                  </TableCell> */}
                  <TableCell>
                    <ActionsDropdown
                      activity={activity}
                      toogleEditActivityModal={toogleEditActivityModal}
                    />
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

export function ActionsDropdown({
  activity,
  toogleEditActivityModal
}: {
  activity: ActivityType;
  toogleEditActivityModal: (
    isOpen: boolean,
    activity: ActivityType | null
  ) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MoreVertical className="h-4 w-4 text-primary" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => toogleEditActivityModal(true, activity)}
          >
            <PencilIcon className="mr-2 h-4 w-4" />
            <span>Editer l'activité</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

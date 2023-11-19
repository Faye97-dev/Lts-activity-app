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
import { API_DEPARTMENTS_LIST } from 'config/api-endpoints.config';
import { Activity, Department, User } from 'db/schema';
import {
  Settings,
  MoreVertical,
  PackageOpen,
  EyeIcon,
  PencilIcon,
  FileCheck
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import AddActivityModal from './add-activity-modal';
import { TrashIcon } from '@heroicons/react/solid';
import DeleteDepartmentModal from './delete-department-modal';

type DepartmentType = Department & {
  activities: Activity[];
  createdAt: string;
  users: User[];
};

export default function DepartmentsTable() {
  const [openAddActivityModal, setOpenAddActivityModal] = useState(false);
  const [openDeleteDepartmentModal, setOpenDeleteDepartmentModal] =
    useState(false);
  const [currentDepartment, setCurrentDepartment] =
    useState<DepartmentType | null>(null);

  const { isLoading, data: payload } = useGenericQuery<null, DepartmentType[]>({
    queryKey: 'QUERY_DEPARTMENTS_LIST',
    requestData: { url: API_DEPARTMENTS_LIST, method: 'GET' }
  });

  const toogleAddActivityModal = ({
    isOpen = false,
    department = undefined
  }: {
    isOpen: boolean;
    department?: DepartmentType;
  }) => {
    setOpenAddActivityModal(isOpen);
    setCurrentDepartment(department || null);
  };

  const toogleDeleteDepartmentModal = ({
    isOpen = false,
    department = undefined
  }: {
    isOpen: boolean;
    department?: DepartmentType;
  }) => {
    setOpenDeleteDepartmentModal(isOpen);
    setCurrentDepartment(department || null);
  };

  // todo add skeleton
  if (isLoading) return 'En cours de chargement ...';

  return (
    <>
      <AddActivityModal
        open={openAddActivityModal}
        department={currentDepartment}
        setOpen={setOpenAddActivityModal}
        onClose={() => toogleAddActivityModal({ isOpen: false })}
      />

      <DeleteDepartmentModal
        department={currentDepartment}
        open={openDeleteDepartmentModal}
        setOpen={setOpenDeleteDepartmentModal}
        onClose={() => toogleDeleteDepartmentModal({ isOpen: false })}
      />

      <Table>
        <TableHead>
          <TableRow className="border-b">
            <TableHeaderCell className="p-3">Nom</TableHeaderCell>
            <TableHeaderCell className="p-3">Abrev</TableHeaderCell>
            <TableHeaderCell className="p-3">Point focal</TableHeaderCell>
            <TableHeaderCell className="p-3">Email</TableHeaderCell>
            <TableHeaderCell className="p-3">Numéro tel</TableHeaderCell>
            <TableHeaderCell className="p-3">Numéro whatsapp</TableHeaderCell>
            {/* <TableHeaderCell className="p-3">Status</TableHeaderCell> */}
            <TableHeaderCell className="p-3">Nbre d'activités</TableHeaderCell>
            <TableHeaderCell className="p-3">Ajouté le</TableHeaderCell>
            <TableHeaderCell className="p-3">Actions</TableHeaderCell>
          </TableRow>
        </TableHead>

        {!!payload?.length && (
          <TableBody>
            {payload.map((department) => {
              const manager = department.users?.[0];
              return (
                <TableRow
                  key={department.id}
                  className="hover:bg-slate-50 transition ease-in-out cusror-pointer"
                >
                  <TableCell className="p-3">{department.name}</TableCell>
                  <TableCell className="p-3">{department.slug}</TableCell>
                  <TableCell className="p-3">
                    {manager
                      ? `${manager?.firstName} ${manager?.lastName}`
                      : '--'}
                  </TableCell>
                  <TableCell className="p-3">
                    <Text>{manager?.email || '--'}</Text>
                  </TableCell>
                  <TableCell className="p-3">
                    {manager?.phone || '--'}
                  </TableCell>
                  <TableCell className="p-3">
                    {manager?.whatsappPhone || '--'}
                  </TableCell>
                  {/* <TableCell className="p-3">
                    {manager ? (
                      <Badge color={manager?.isActive ? 'green' : 'red'}>
                        {manager?.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    ) : (
                      '--'
                    )}
                  </TableCell> */}
                  <TableCell className="p-3">
                    {department.activities.length}
                  </TableCell>
                  <TableCell className="p-3">
                    {department.createdAt?.split('T')?.[0]}
                  </TableCell>
                  <TableCell>
                    <ActionsDropdown
                      department={department}
                      onAddActivity={toogleAddActivityModal}
                      onDeleteDepartment={toogleDeleteDepartmentModal}
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

type ActionsDropdownProps = {
  department: DepartmentType;
  onAddActivity: (args: {
    isOpen: boolean;
    department?: DepartmentType;
  }) => void;
  onDeleteDepartment: (args: {
    isOpen: boolean;
    department?: DepartmentType;
  }) => void;
};

export function ActionsDropdown({
  department,
  onAddActivity,
  onDeleteDepartment
}: ActionsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MoreVertical className="h-4 w-4 text-primary" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <EyeIcon className="mr-2 h-4 w-4" />
            <span>Voir plus</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onAddActivity({ isOpen: true, department })}
          >
            <FileCheck className="mr-2 h-4 w-4" />
            <span>Ajouter une activité</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {/*  */}
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <PencilIcon className="mr-2 h-4 w-4" />
            <span>Editer le compte</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Editer le mot de passe</span>
          </DropdownMenuItem>
          {/* <DropdownMenuItem>
            <UserXIcon className="mr-2 h-4 w-4" />
            <span>Bloquer le compte</span>
          </DropdownMenuItem> */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => onDeleteDepartment({ isOpen: true, department })}
          >
            <TrashIcon className="mr-2 h-4 w-4" />
            <span>Supprimer le department</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

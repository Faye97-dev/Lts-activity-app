"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Text } from "@tremor/react"
import { Activity, Department, User } from "db/schema"
import { MoreVertical, PackageOpen, PencilIcon, TrashIcon } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import DeleteActivityModal from "./delete-activity-modal"
import EditActivityModal from "./edit-activity-modal"

type DepartmentType = Department & {
  activities: Activity[]
  createdAt: string
  users: User[]
}

export default function ActivitiesList({ department, onClose }: { department: DepartmentType; onClose: () => void }) {
  const [openEditActivityModal, setOpenEditActivityModal] = useState(false)
  const [openDeleteActivityModal, setOpenDeleteActivityModal] = useState(false)
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null)

  const toogleEditActivityModal = ({
    isOpen = false,
    activity = undefined,
  }: {
    isOpen: boolean
    activity?: Activity
  }) => {
    setOpenEditActivityModal(isOpen)
    setCurrentActivity(activity || null)
  }

  const toogleDeleteActivityModal = ({
    isOpen = false,
    activity = undefined,
  }: {
    isOpen: boolean
    activity?: Activity
  }) => {
    setOpenDeleteActivityModal(isOpen)
    setCurrentActivity(activity || null)
  }

  return (
    <>
      <EditActivityModal
        open={openEditActivityModal}
        activity={currentActivity}
        setOpen={setOpenEditActivityModal}
        onClose={() => {
          toogleEditActivityModal({ isOpen: false })
          onClose()
        }}
      />

      <DeleteActivityModal
        open={openDeleteActivityModal}
        activity={currentActivity}
        setOpen={setOpenDeleteActivityModal}
        onClose={() => {
          toogleDeleteActivityModal({ isOpen: false })
          onClose()
        }}
      />

      <Table className="mt-6">
        <TableHead>
          <TableRow className="border-b">
            <TableHeaderCell className="p-3">Titre</TableHeaderCell>
            <TableHeaderCell className="p-3">Date de début</TableHeaderCell>
            <TableHeaderCell className="p-3">Date de fin</TableHeaderCell>
            <TableHeaderCell className="p-3">Structure Pilote</TableHeaderCell>
            <TableHeaderCell className="p-3">Nombre cible</TableHeaderCell>
            <TableHeaderCell className="p-3">Actions</TableHeaderCell>
          </TableRow>
        </TableHead>

        {!!department?.activities?.length && (
          <TableBody>
            {department?.activities?.map((activity: any) => {
              return (
                <TableRow key={activity.id} className="hover:bg-slate-50 transition ease-in-out cusror-pointer">
                  <TableCell className="p-3">{activity.name}</TableCell>
                  <TableCell className="p-3">{activity.startDate?.split("T")?.[0]}</TableCell>
                  <TableCell className="p-3">{activity.endDate?.split("T")?.[0]}</TableCell>
                  <TableCell className="p-3">{activity.manager || "--"}</TableCell>
                  <TableCell className="p-3">
                    <Text>{activity.totalTarget || "--"}</Text>
                  </TableCell>
                  <TableCell>
                    <ActionsDropdown
                      activity={activity}
                      onEditActivity={toogleEditActivityModal}
                      onDeleteActivity={toogleDeleteActivityModal}
                    />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        )}
      </Table>

      {!department?.activities?.length && (
        <div className="mt-10 mb-6 flex gap-2 items-center text-lg justify-center w-full font-semibold text-blue-500">
          <PackageOpen className="h-6 w-6" /> Aucune données a afficher !
        </div>
      )}
    </>
  )
}

type toggleModalActionType = (args: { isOpen: boolean; activity?: Activity }) => void

type ActionsDropdownProps = {
  activity: Activity
  onEditActivity: toggleModalActionType
  onDeleteActivity: toggleModalActionType
}

export function ActionsDropdown({ activity, onEditActivity, onDeleteActivity }: ActionsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MoreVertical className="h-4 w-4 text-primary" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => onEditActivity({ isOpen: true, activity })}>
            <PencilIcon className="mr-2 h-4 w-4" />
            <span>Editer l'activité</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-500" onClick={() => onDeleteActivity({ isOpen: true, activity })}>
            <TrashIcon className="mr-2 h-4 w-4" />
            <span>Supprimer l'activité</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

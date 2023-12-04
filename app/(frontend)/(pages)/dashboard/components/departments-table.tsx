"use client"

import { useRouter } from "next/navigation"
import { Badge, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Text } from "@tremor/react"
import { API_DEPARTMENTS_LIST } from "config/api-endpoints.config"
import { Activity, Department, User } from "db/schema"
import { PackageOpen } from "lucide-react"

import { useGenericQuery } from "@/hooks/useApi"

type DepartmentType = Department & {
  activities: Activity[]
  createdAt: string
  users: User[]
}

export default function DepartmentsTable() {
  const router = useRouter()
  const { isLoading, data: payload } = useGenericQuery<null, DepartmentType[]>({
    queryKey: "QUERY_DEPARTMENTS_LIST",
    requestData: { url: API_DEPARTMENTS_LIST, method: "GET" },
  })

  // todo add skeleton
  if (isLoading) return "En cours de chargement ..."

  return (
    <>
      <Table className="mt-8">
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
          </TableRow>
        </TableHead>

        {!!payload?.length && (
          <TableBody>
            {payload.map((department) => {
              const manager = department.users?.[0]
              return (
                <TableRow
                  key={department.id}
                  className="hover:bg-slate-50 transition ease-in-out cusror-pointer"
                  onClick={() => router.push(`/dashboard/department/${department.id}`)}
                >
                  <TableCell className="p-3">{department.name}</TableCell>
                  <TableCell className="p-3">{department.slug}</TableCell>
                  <TableCell className="p-3">{manager ? `${manager?.firstName} ${manager?.lastName}` : "--"}</TableCell>
                  <TableCell className="p-3">
                    <Text>{manager?.email || "--"}</Text>
                  </TableCell>
                  <TableCell className="p-3">{manager?.phone || "--"}</TableCell>
                  <TableCell className="p-3">{manager?.whatsappPhone || "--"}</TableCell>
                  {/* <TableCell className="p-3">
                    {manager ? (
                      <Badge color={manager?.isActive ? 'green' : 'red'}>
                        {manager?.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    ) : (
                      '--'
                    )}
                  </TableCell> */}
                  <TableCell className="p-3">{department.activities.length}</TableCell>
                  <TableCell className="p-3">{department.createdAt?.split("T")?.[0]}</TableCell>
                </TableRow>
              )
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
  )
}

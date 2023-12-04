"use client"

import { useState } from "react"
import { PlusIcon } from "@heroicons/react/solid"
import { Role } from "db/schema"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { NewDepartementForm } from "./new-departement-form"

export default function NewDepartmentDrawer({ roles }: { roles: Role[] }) {
  const [open, setOpen] = useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="flex items-center gap-2 bg-blue-500 py-2 px-3 text-white rounded-lg hover:bg-blue-400">
        <PlusIcon className="w-4 h-4" />
        Ajouter un departement
      </SheetTrigger>
      <SheetContent className="sm:max-w-[700px] sm:w-[700px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="border-b pb-4 text-xl">Ajout d'un nouveau departement</SheetTitle>
          <SheetDescription>
            <NewDepartementForm roles={roles} onClose={() => setOpen(false)} />
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}

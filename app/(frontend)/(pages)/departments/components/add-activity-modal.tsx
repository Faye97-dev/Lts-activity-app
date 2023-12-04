import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AddActivityForm } from "./add-activity-form"

export default function AddActivityModal({
  open,
  setOpen,
  onClose,
  department,
}: {
  open: boolean
  department: any // todo fixme
  onClose: () => void
  setOpen: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajout d'une activité</DialogTitle>
          <DialogDescription>
            <AddActivityForm onClose={onClose} department={department} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

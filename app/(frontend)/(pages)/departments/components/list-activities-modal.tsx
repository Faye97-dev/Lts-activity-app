import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import ActivitiesList from "./activities-list"

export default function ListActivitiesModal({
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
      <DialogContent className="max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Liste des activités</DialogTitle>
          <DialogDescription>
            <ActivitiesList department={department} onClose={onClose} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

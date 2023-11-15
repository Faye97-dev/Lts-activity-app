import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { EditActivityForm } from './edit-activity-form';

export default function EditActivityModal({
  open,
  setOpen,
  onClose,
  activity
}: {
  open: boolean;
  activity: any; // todo fixme
  onClose: () => void;
  setOpen: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier une activité</DialogTitle>
          <DialogDescription>
            <EditActivityForm onClose={onClose} activity={activity} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

'use client';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { EditDepartementForm } from './edit-departement-form';

export default function EditDepartmentDrawer({
  open,
  setOpen,
  onClose,
  department
}: {
  open: boolean;
  department: any;
  onClose: () => void;
  setOpen: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="sm:max-w-[700px] sm:w-[700px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="border-b pb-4 text-xl">
            Modification d'un nouveau departement
          </SheetTitle>
          <SheetDescription>
            <EditDepartementForm onClose={onClose} department={department} />
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

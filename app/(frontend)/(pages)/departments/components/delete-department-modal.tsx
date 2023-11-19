import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { useGenericMutation } from '@/hooks/useApi';
import { Button, Text } from '@tremor/react';
import { API_DELETE_DEPARTMENT } from 'config/api-endpoints.config';
import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle } from 'lucide-react';

export default function DeleteDepartmentModal({
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
  const queryClient = useQueryClient();
  const { mutate, isPending } = useGenericMutation<{}, { message: string }>();

  function onDeleteDepartment() {
    mutate(
      { url: API_DELETE_DEPARTMENT + '/' + department.id, method: 'DELETE' },
      {
        onSuccess: () => {
          toast({
            variant: 'success',
            description: (
              <div className="flex font-bold items-center gap-2">
                <CheckCircle className="w-6 h-6" /> Opération reussi.
              </div>
            )
          });
          onClose();
          queryClient.invalidateQueries({
            queryKey: ['QUERY_DEPARTMENTS_LIST']
          });
        }
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-red-600">
            Suppression d'un département
          </DialogTitle>
          <DialogDescription>
            <div className="mt-6 flex flex-col gap-6">
              <Text>Vous êtes sur de vouloir supprimer ce département ?</Text>
              <div className="flex items-center justify-end gap-3">
                <Button
                  color="red"
                  type="button"
                  loading={isPending}
                  onClick={onClose}
                >
                  Annuler
                </Button>
                <Button
                  color="green"
                  onClick={onDeleteDepartment}
                  loading={isPending}
                >
                  Confirmer
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

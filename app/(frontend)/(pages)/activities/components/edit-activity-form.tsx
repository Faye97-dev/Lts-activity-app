'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Activity } from 'db/schema';
import { Button } from '@tremor/react';
import { useGenericMutation } from '@/hooks/useApi';
import { useQueryClient } from '@tanstack/react-query';
import { Textarea } from '@/components/ui/textarea';
import { API_EDIT_ACTIVITY } from 'config/api-endpoints.config';
import { toast } from '@/components/ui/use-toast';
import { CheckCircle } from 'lucide-react';

// todo fix validation
const editActivityFormSchema = z.object({
  totalCreated: z.string({ required_error: 'Nombre crée est obligatoire.' }),
  comment: z.string().optional()
});

type EditActivityFormValues = z.infer<typeof editActivityFormSchema>;

export function EditActivityForm({
  onClose,
  activity
}: {
  onClose: () => void;
  activity: any; // todo fixme
}) {
  const defaultValues: Partial<EditActivityFormValues> = {};

  const form = useForm<EditActivityFormValues>({
    resolver: zodResolver(editActivityFormSchema),
    defaultValues,
    mode: 'onChange'
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useGenericMutation<
    EditActivityFormValues,
    Activity
  >();

  function onSubmit(formValues: EditActivityFormValues) {
    const payload = {
      ...formValues
    };

    mutate(
      {
        url: API_EDIT_ACTIVITY + '/' + activity.id,
        method: 'PUT',
        body: payload
      },
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
            queryKey: ['QUERY_ACTIVITIES_LIST']
          });
        }
      }
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-y-3 mt-4"
      >
        <FormField
          control={form.control}
          name="totalCreated"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre crée</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter le nombre crée"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Commentaire</FormLabel>
              <FormControl>
                <Textarea placeholder="Ajouter un commentaire" {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-3 mt-4">
          <Button
            color="red"
            type="button"
            loading={isPending}
            onClick={onClose}
          >
            Annuler
          </Button>

          <Button type="submit" color="green" loading={isPending}>
            Enregistrer
          </Button>
        </div>
      </form>
    </Form>
  );
}

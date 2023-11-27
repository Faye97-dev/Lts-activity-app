'use client';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { format } from 'date-fns';
import { Activity } from 'db/schema';
import { Button } from '@tremor/react';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { useGenericMutation } from '@/hooks/useApi';
import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle, CalendarIcon } from 'lucide-react';
import { API_EDIT_ACTIVITY } from 'config/api-endpoints.config';

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { cn } from 'lib/utils';
import { Button as ButtonShadcn } from '@/components/ui/button';

// todo fix validation
const addActivityFormSchema = z.object({
  name: z
    .string({ required_error: "Titre de l'activité est obligatoire." })
    .min(2, { message: "Titre de l'activité du departement trop court." })
    .max(60, { message: "Titre de l'activité du departement trop long." }),
  // todo add valdation for dates
  startDate: z.date({ required_error: 'Date de début est obligatoire.' }),
  endDate: z.date({ required_error: 'Date de fin est obligatoire.' }),
  // todo fix totalTarget validation
  totalTarget: z.string({ required_error: 'Nombre cible est obligatoire.' }),
  manager: z.string().optional()
});

type EditActivityFormValues = z.infer<typeof addActivityFormSchema>;

export function EditActivityForm({
  onClose,
  activity
}: {
  onClose: () => void;
  activity: any; // todo fixme
}) {
  const defaultValues: Partial<EditActivityFormValues> = {
    startDate: activity ? new Date(activity.startDate) : undefined,
    endDate: activity ? new Date(activity.endDate) : undefined,
    name: activity?.name || '',
    totalTarget: activity?.totalTarget
      ? activity.totalTarget.toString()
      : undefined,
    manager: activity?.manager || ''
  };

  const form = useForm<EditActivityFormValues>({
    resolver: zodResolver(addActivityFormSchema),
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
            queryKey: ['QUERY_DEPARTMENTS_LIST']
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre de l'activité</FormLabel>
              <FormControl>
                <Input placeholder="Enter un titre" {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          name="startDate"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date de début</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <ButtonShadcn
                      variant="outline"
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Enter la date de début</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </ButtonShadcn>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    initialFocus
                    selected={field.value}
                    onSelect={field.onChange}
                    // disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          name="endDate"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date de fin</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <ButtonShadcn
                      variant="outline"
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Enter la date de fin</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </ButtonShadcn>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    initialFocus
                    selected={field.value}
                    onSelect={field.onChange}
                    // disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="totalTarget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre cible</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter le nombre cible"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="manager"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Structure pilote</FormLabel>
              <FormControl>
                <Input placeholder="Enter la structure pilote" {...field} />
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

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
import { useSession } from 'next-auth/react';

const profileFormSchema = z.object({
  firstName: z
    .string({ required_error: 'Nom est obligatoire.' })
    .min(2, { message: 'Nom trop court.' })
    .max(30, { message: 'Nom trop long.' }),
  lastName: z
    .string({ required_error: 'Prénom est obligatoire.' })
    .min(2, { message: 'Prénom trop court.' })
    .max(30, { message: 'Prénom trop long.' }),
  email: z
    .string({ required_error: 'Email est obligatoire.' })
    .email('Email non valide.'),
  // todo add validation phones
  phone: z.string().optional(),
  whatsappPhone: z.string().optional()
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
export function ProfileForm() {
  const { data: session } = useSession();

  const defaultValues: Partial<ProfileFormValues> = {
    firstName: session?.user?.token?.firstName,
    lastName: session?.user?.token?.lastName,
    email: session?.user?.token?.email,
    phone: session?.user?.token?.phone || '',
    whatsappPhone: session?.user?.token?.whatsappPhone || ''
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange'
  });

  function onSubmit(data: ProfileFormValues) {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <FormField
          disabled
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input placeholder="Enter le nom du point focal" {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          disabled
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prénom</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter le prénom du point focal"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          disabled
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter un adresse mail"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          disabled
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro tel</FormLabel>
              <FormControl>
                <Input placeholder="Enter un numéro de téléphone" {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          disabled
          control={form.control}
          name="whatsappPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro whatsapp</FormLabel>
              <FormControl>
                <Input placeholder="Enter un numéro whatsapp" {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        {/* <div>
          <Button type="submit" className="mt-4">
            Enregistrer les modifications
          </Button>
        </div> */}
      </form>
    </Form>
  );
}

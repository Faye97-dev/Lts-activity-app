"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@tremor/react"
import { API_ADD_DEPARTMENT } from "config/api-endpoints.config"
import { ROLE_DEFAULT } from "config/global.config"
import { Department, Role, User } from "db/schema"
import { CheckCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { useGenericMutation } from "@/hooks/useApi"

const newDepartmentFormSchema = z.object({
  // department
  departmentName: z
    .string({ required_error: "Nom du departement est obligatoire." })
    .min(2, { message: "Nom du departement trop court." })
    .max(30, { message: "Nom du departement trop long." }),
  departmentSlug: z
    .string({ required_error: "Abreviation du departement est obligatoire." })
    .min(2, { message: "Abreviation du departement trop court." })
    .max(30, { message: "Abreviation du departement trop long." }),
  // user
  firstName: z
    .string({ required_error: "Nom est obligatoire." })
    .min(2, { message: "Nom trop court." })
    .max(30, { message: "Nom trop long." }),
  lastName: z
    .string({ required_error: "Prénom est obligatoire." })
    .min(2, { message: "Prénom trop court." })
    .max(30, { message: "Prénom trop long." }),
  email: z.string({ required_error: "Email est obligatoire." }).email("Email non valide."),
  // todo add validation confirm password
  password: z.string({ required_error: "Mot de passe est obligatoire." }),
  confirmPassword: z.string({
    required_error: "Confirmation du mot de passe est obligatoire.",
  }),
  // todo add validation phones
  phone: z.string().optional(),
  whatsappPhone: z.string().optional(),
})

type NewDepartmentFormValues = z.infer<typeof newDepartmentFormSchema>

const defaultValues: Partial<NewDepartmentFormValues> = {}

export function NewDepartementForm({ roles, onClose }: { roles: Role[]; onClose: () => void }) {
  const form = useForm<NewDepartmentFormValues>({
    resolver: zodResolver(newDepartmentFormSchema),
    defaultValues,
    mode: "onChange",
  })

  const queryClient = useQueryClient()

  const { mutate, isPending } = useGenericMutation<NewDepartmentFormValues, Department & { user: User }>()

  function onSubmit(formValues: NewDepartmentFormValues) {
    const paylaod = {
      ...formValues,
      roleId: roles.find((role) => role.slug == ROLE_DEFAULT)?.id, // todo improve
    }

    mutate(
      { url: API_ADD_DEPARTMENT, method: "POST", body: paylaod },
      {
        onSuccess: () => {
          toast({
            variant: "success",
            description: (
              <div className="flex font-bold items-center gap-2">
                <CheckCircle className="w-6 h-6" /> Opération reussi.
              </div>
            ),
          })
          onClose()
          queryClient.invalidateQueries({
            queryKey: ["QUERY_DEPARTMENTS_LIST"],
          })
        },
      },
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4">
        <div className="space-y-3">
          <p className="font-normal text-lg text-primary">Informations du departement</p>
          <FormField
            control={form.control}
            name="departmentName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du departement</FormLabel>
                <FormControl>
                  <Input placeholder="Enter le nom du departement" {...field} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="departmentSlug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Abréviation du departement</FormLabel>
                <FormControl>
                  <Input placeholder="Enter l'abréviation" {...field} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-3">
          <p className="font-normal text-lg text-primary">Informations du point focal</p>
          <FormField
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
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input placeholder="Enter le prénom du point focal" {...field} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
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
        </div>

        <div className="space-y-3">
          <p className="font-normal text-lg text-primary">Indentifiant du compte</p>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter un adresse mail" {...field} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmation du mot de passe</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" loading={isPending} color="green">
          Enregistrer
        </Button>
      </form>
    </Form>
  )
}

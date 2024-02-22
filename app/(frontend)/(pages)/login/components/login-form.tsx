"use client"

import * as React from "react"
import { cn } from "lib/utils"
import { signIn } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
import { AlertTriangle, CheckCircle } from "lucide-react"

const loginFormSchema = z.object({
  email: z.string({ required_error: "Email est obligatoire." }).email("Email non valide."),
  password: z.string({ required_error: "Mot de passe est obligatoire." }), // todo fix emptystring validation
})
type LoginFormValues = z.infer<typeof loginFormSchema>

export function LoginForm({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {  },
    mode: "onChange",
  })

  const authErrorAlert = () => toast({
    variant: "destructive",
    description: (
      <div className="flex font-bold items-center gap-2">
        <AlertTriangle className="w-6 h-6" />
        Email ou mot de passe incorrect.
      </div>
    ),
  })

  const authSuccessAlert = () => toast({
    variant: "success",
    description: (
      <div className="flex font-bold items-center gap-2">
        <CheckCircle className="w-6 h-6" />Connexion reussi.
      </div>
    ),
  })

  function onSubmit(formValues: LoginFormValues) {
    // todo { email: "super-admin@gmail.com", password: "dev", redirect: false }
    setIsLoading(true)
    signIn("credentials", { ...formValues, redirect: false })
      .then((response) => {
        if (!response?.error && response?.ok) {
          authSuccessAlert()
          window.location.href = "/"
        } else authErrorAlert()
      })
      .catch(() => authErrorAlert()).finally(() => setIsLoading(false))
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder="Entrez votre adresse e-mail..."
                      {...field} />
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
                    <Input type="password" placeholder="mot de passe..."  {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <Button disabled={isLoading}>
              Se connecter
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

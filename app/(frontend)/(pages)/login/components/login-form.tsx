"use client"

import * as React from "react"
import { cn } from "lib/utils"
import { signIn } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {}

// todo add form validation
// todo add alert toaster
// todo add loader

export function LoginForm({ className, ...props }: LoginFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    signIn("credentials", { email: "super-admin@dev.com", password: "dev", redirect: false })
      .then((response) => {
        console.log(response, "response")
        if (!response?.error && response?.ok) {
          window.location.href = "/"
        } else {
          console.log(response?.error)
        }
      })
      .catch((error) => console.log(error))
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-6">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              autoCorrect="off"
              autoComplete="email"
              autoCapitalize="none"
              placeholder="entrez votre adresse e-mail..."
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Mot de passe
            </Label>
            <Input id="password" type="password" placeholder="mot de passe..." disabled={isLoading} />
          </div>
          <Button disabled={isLoading}>
            {/* {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )} */}
            Se connecter
          </Button>
        </div>
      </form>
    </div>
  )
}

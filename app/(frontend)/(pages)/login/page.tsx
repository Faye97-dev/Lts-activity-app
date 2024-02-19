import Logo from "@/components/icons/Logo"
import { LoginForm } from "./components/login-form"

export default function AuthenticationPage() {
  return (
    <div className="container min-h-screen gap-24 flex flex-col items-center pt-48">
      <div className="justify-start">
        <Logo />
      </div>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Se connecter</h1>
          <p className="text-sm text-muted-foreground">Entrez vos identifiants pour vous connecter à votre compte</p>
        </div>
        <LoginForm />
        <p className="px-8 text-center text-sm text-muted-foreground">© 2024 Lts. All rights reserved.</p>
      </div>
    </div>
  )
}

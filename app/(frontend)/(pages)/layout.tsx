import "../../globals.css"

import { Suspense } from "react"
import { Inter as FontSans } from "next/font/google"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { ROUTES_GUARDS } from "config/global.config"
import { auth } from "lib/auth"
import { cn } from "lib/utils"
import { SessionProvider } from "next-auth/react"

import Nav from "@/components/nav"
import { Toaster } from "@/components/ui/toaster"
import ReactQueryProviders from "../react-query-provider"

export const metadata = {
  title: "Gouvernance de l'action publique",
}

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const location = headers().get("location") || ""
  const isAnonymous = location === "/login"

  const session = await auth()
  const isAuthenticated = session?.user

  // user not authenticated
  if (!isAuthenticated && !isAnonymous) redirect("/login")

  // user not authenticated
  if (isAuthenticated && isAnonymous) redirect("/")

  const roles = Object.keys(ROUTES_GUARDS)
  const userRole = session?.user?.token.role.slug as keyof typeof ROUTES_GUARDS
  // user authorized to access page
  if (roles.includes(userRole) && !ROUTES_GUARDS[userRole].routes.includes(location)) {
    return redirect("/404") // todo add 404 page
  }

  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <SessionProvider session={session}>
          <ReactQueryProviders>
            {!isAnonymous && (
              <Suspense>
                <Nav />
              </Suspense>
            )}
            {children}
            <Toaster />
          </ReactQueryProviders>
        </SessionProvider>
      </body>
    </html>
  )
}

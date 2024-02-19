import "../../globals.css"

import { Suspense } from "react"
import { Inter as FontSans } from "next/font/google"
// app/layout.tsx
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "lib/auth"
import { cn } from "lib/utils"
import { SessionProvider } from "next-auth/react"

import Nav from "@/components/nav"
import { Toaster } from "@/components/ui/toaster"
import ReactQueryProviders from "../react-query-provider"

export const metadata = {
  title: "Lts Next js app",
}

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const location = headers().get("location") || ""
  const isAnonymous = location === "/login"

  const session = await auth()
  if (!session?.user && !isAnonymous) redirect("/login")

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

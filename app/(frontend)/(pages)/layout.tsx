import "../../globals.css"

import { Suspense } from "react"
import { Inter as FontSans } from "next/font/google"
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
  const session = await auth()
  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <SessionProvider session={session}>
          <ReactQueryProviders>
            <Suspense>
              <Nav />
            </Suspense>
            {children}
            <Toaster />
          </ReactQueryProviders>
        </SessionProvider>
      </body>
    </html>
  )
}

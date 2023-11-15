import '../../globals.css';

import Nav from '@/components/nav';
import { Suspense } from 'react';
import ReactQueryProviders from '../react-query-provider';

export const metadata = {
  title: 'Lts Next js app'
};

import { Inter as FontSans } from 'next/font/google';
import { cn } from 'lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { SessionProvider } from 'next-auth/react';
import { auth } from 'lib/auth';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
});

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
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
  );
}

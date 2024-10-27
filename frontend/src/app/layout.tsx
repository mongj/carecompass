'use client';

import './globals.css';
import 'inter-ui/inter.css';
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@opengovsg/design-system-react';
import { ChakraProvider } from '@chakra-ui/react';
import { Toaster } from 'sonner'
import Image from 'next/image';

export default function RootLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='w-screen h-dvh'>
        <Toaster richColors />
        <Providers>
          <div className='sm:hidden'>
            {children}
          </div>
          <main className="flex h-full w-full flex-col p-8 gap-4 place-content-center place-items-center">
            <h3 className="font-bold text-4xl">Welcome to CareCompass</h3>
            <span className="">Sorry, CareCompass is currently only available for mobile devices.</span>
            <Image src="/img/scene-messaging.svg" alt="logo" width={500} height={200} />
          </main>
        </Providers>
      </body>
    </html>
  );
}

function Providers({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <ChakraProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </ChakraProvider>
    </ClerkProvider>
  );
}
'use client';

import './globals.css';
import 'inter-ui/inter.css';
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@opengovsg/design-system-react';
import { ChakraProvider } from '@chakra-ui/react';
import { Toaster } from 'sonner'

export default function RootLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='w-screen h-dvh'>
        <Toaster richColors />
        <Providers>
          {children}
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
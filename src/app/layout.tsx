'use client'

import "./globals.css";
import 'inter-ui/inter.css';
import { ThemeProvider } from '@opengovsg/design-system-react';
import { ChakraProvider } from "@chakra-ui/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
        <body>
        <Providers>
          {children}
          </Providers>
        </body>
      </html>
  );
}

function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ChakraProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </ChakraProvider>
  );
}

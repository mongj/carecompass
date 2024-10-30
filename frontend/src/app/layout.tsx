'use client';

import './globals.css';
import 'inter-ui/inter.css';
import Providers from './providers';
import { Toaster } from 'sonner'
import Image from 'next/image';
import Analytics from './analytics';

export default function RootLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='w-screen h-dvh'>
        <Toaster richColors />
        <Analytics />
        <Providers>
          <div className='w-full h-full sm:hidden'>
            {children}
          </div>
          <main className="hidden sm:flex h-full w-full flex-col p-8 gap-4 place-content-center place-items-center">
            <h3 className="font-bold text-4xl">Welcome to CareCompass</h3>
            <span className="">Sorry, CareCompass is currently only available for mobile devices.</span>
            <Image src="/img/scene-messaging.svg" alt="logo" width={500} height={200} />
          </main>
        </Providers>
      </body>
    </html>
  );
}


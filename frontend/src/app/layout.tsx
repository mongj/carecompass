"use client";

import "./globals.css";
import Providers from "./providers";
import { Toaster } from "sonner";
import Image from "next/image";
import Analytics from "./analytics";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-dvh w-screen">
        <Toaster richColors />
        <Analytics />
        <Providers>
          <div className="h-full w-full sm:hidden">{children}</div>
          <main className="hidden h-full w-full flex-col place-content-center place-items-center gap-4 p-8 sm:flex">
            <h3 className="text-4xl font-bold">Welcome to CareCompass</h3>
            <span className="">
              Sorry, CareCompass is currently only available for mobile devices.
            </span>
            <Image
              src="/img/scene-messaging.svg"
              alt="logo"
              width={500}
              height={200}
            />
          </main>
        </Providers>
      </body>
    </html>
  );
}

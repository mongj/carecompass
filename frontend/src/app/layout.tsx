"use client";

import "./globals.css";
import Providers from "./providers";
import { Toaster } from "sonner";
import Image from "next/image";
import Analytics from "./analytics";
import "@smastrom/react-rating/style.css";
import Head from "next/head";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <title>CareCompass</title>
        <meta
          name="description"
          content="A personalized care recommender for caregivers"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="CareCompass" />
        {/* Open Graph */}
        <meta property="og:title" content="CareCompass" />
        <meta
          property="og:description"
          content="A personalised care navigator for new family caregivers of dementia patients"
        />
        <meta property="og:image" content="/og-banner.png" />
        <meta property="og:url" content="https://my.carecompass.sg" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="CareCompass" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="CareCompass" />
        <meta property="og:image:type" content="image/png" />
        <meta
          property="og:image:secure_url"
          content="https://my.carecompass.sg/og-banner.png"
        />
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="CareCompass" />
        <meta
          property="twitter:description"
          content="A personalised care navigator for new family caregivers of dementia patients"
        />
        <meta property="twitter:image" content="/og-banner.png" />
        <meta property="twitter:url" content="https://my.carecompass.sg" />
      </Head>
      <body className="h-dvh w-screen">
        <Toaster />
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

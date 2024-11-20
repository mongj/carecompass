import "./globals.css";
import { Metadata } from "next";
import RootLayoutClient from "./layout.client";

export const metadata: Metadata = {
  title: "CareCompass",
  description:
    "A personalised care navigator for new family caregivers of dementia patients",
  openGraph: {
    title: "CareCompass",
    description:
      "A personalised care navigator for new family caregivers of dementia patients",
    images: [
      {
        url: "/og-banner.png",
        width: 1200,
        height: 630,
        alt: "CareCompass App Banner",
      },
    ],
    type: "website",
    locale: "en_US",
    siteName: "CareCompass",
    url: "https://my.carecompass.sg",
  },
  twitter: {
    card: "summary_large_image",
    title: "CareCompass",
    description:
      "A personalised care navigator for new family caregivers of dementia patients",
    images: ["/og-banner.png"],
  },
  appleWebApp: {
    title: "CareCompass",
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <RootLayoutClient>{children}</RootLayoutClient>
    </html>
  );
}

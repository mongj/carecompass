"use client";

import Providers from "./providers";
import { Toaster } from "sonner";
import "@smastrom/react-rating/style.css";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import SignIn from "@/components/SignIn";
import { IncompatibleDevicePage } from "../components/IncompatibleDevicePage";

export default function RootLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body className="h-dvh w-screen">
      <Toaster closeButton position="top-center" duration={2000} />
      <Providers>
        <div className="h-full w-full sm:hidden">
          <SignedIn>{children}</SignedIn>
          <SignedOut>
            <SignIn />
          </SignedOut>
        </div>
        <IncompatibleDevicePage />
      </Providers>
    </body>
  );
}

"use client";

import Providers from "./providers";
import { Toaster } from "sonner";
import "@smastrom/react-rating/style.css";
import { IncompatibleDevicePage } from "../components/IncompatibleDevicePage";
import { PropsWithChildren } from "react";
import { useAuthStore } from "@/stores/auth";
import SignIn from "@/components/SignIn";

export default function RootLayoutClient({ children }: PropsWithChildren) {
  return (
    <body className="h-dvh w-screen">
      <Toaster closeButton position="top-center" duration={2000} />
      <Providers>
        <Main>{children}</Main>
        <IncompatibleDevicePage />
      </Providers>
    </body>
  );
}

function Main({ children }: PropsWithChildren) {
  const isSignedIn = useAuthStore((state) => state.isSignedIn);
  const isGuest = useAuthStore((state) => state.isGuest);
  return (
    <div className="h-full w-full sm:hidden">
      {isSignedIn || isGuest ? <>{children}</> : <SignIn />}
    </div>
  );
}

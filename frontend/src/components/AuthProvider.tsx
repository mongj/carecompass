"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { PropsWithChildren } from "react";

import { useClerkAuthSync } from "@/hooks/useClerkAuthSync";

function ClerkProviderAdapter({ children }: PropsWithChildren<unknown>) {
  useClerkAuthSync();
  return <>{children}</>;
}

export default function AuthProvider({ children }: PropsWithChildren<unknown>) {
  return (
    <ClerkProvider>
      <ClerkProviderAdapter>{children}</ClerkProviderAdapter>
    </ClerkProvider>
  );
}

"use client";

import { useRouter } from "next/navigation";

import { Button } from "@opengovsg/design-system-react";
import { ArrowLeft } from "lucide-react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  return (
    <div className="flex h-dvh max-h-dvh flex-col md:flex-row">
      <header className="place-content-centre flex h-16 w-full place-items-center bg-brand-primary-500 px-4 text-white md:hidden">
        <Button
          colorScheme="white"
          variant="link"
          aria-label="Back to chat"
          leftIcon={<ArrowLeft size={16} />}
          size="sm"
          position="absolute"
          onClick={() => {
            router.back();
          }}
        >
          Back
        </Button>
        <span className="w-full text-center font-semibold">
          Care Service Recommender
        </span>
      </header>
      <main className="flex h-full w-full flex-col overflow-auto bg-gray-100">
        {children}
      </main>
    </div>
  );
}

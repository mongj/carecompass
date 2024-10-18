"use client";

import { useRouter } from "next/navigation";

import { Button } from "@opengovsg/design-system-react";
import { ArrowLeft } from "lucide-react";

export default function DashboardLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row h-dvh max-h-dvh">
      <header className="md:hidden flex place-content-centre place-items-center px-4 w-full h-16 bg-brand-primary-500 text-white">
        <Button 
          colorScheme="white"
          variant="link"
          aria-label="Back to chat"
          leftIcon={<ArrowLeft size={16}/>}
          size="sm" 
          position="absolute"
          onClick={() => {
            router.back();
          }}>
          Back
        </Button>
        <span className="w-full text-center font-semibold">Support dashboard</span>
      </header>
      <main className="h-full overflow-auto flex w-full flex-col px-6 bg-gray-100">
        {children}
      </main>
    </div>
  );
}
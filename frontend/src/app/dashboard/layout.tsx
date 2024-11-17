"use client";

import BottomNav from "@/ui/layouts/BottomNav";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-dvh max-h-dvh flex-col md:flex-row">
      <main className="flex h-full w-full flex-col overflow-auto bg-gray-100 px-6">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}

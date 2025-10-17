"use client";

import { useAuthStore } from "@/stores/auth";
import { useUser } from "@clerk/nextjs";

export default function StoreProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useUser();
  if (!user) {
    return;
  }

  // Update store
  useAuthStore.setState((state) => {
    return {
      ...state,
      currentUser: user,
    };
  });

  return children;
}

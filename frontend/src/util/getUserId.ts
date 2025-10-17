"use client";

import { useAuthStore } from "@/stores/auth";

export default function useUserId() {
  const userId = useAuthStore.getState().currentUser.id;
  return userId;
}

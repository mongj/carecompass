// get Clerk userId if available, else get the randomly dummy userId from localStorage
import { useMemo } from "react";
import { useUserStore } from "@/stores/user";

export default function useUserId() {
  const clerkId = useUserStore((s) => s.user.clerk_id);
  return useMemo(
    () =>
      clerkId ||
      (typeof window !== "undefined"
        ? window.localStorage.getItem("cc-userId")
        : null),
    [clerkId],
  );
}

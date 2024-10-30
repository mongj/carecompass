// get Clerk userId if available, else get the randomly dummy userId from localStorage

import { useUserStore } from "@/stores/user"

export default function getUserId() {
  const clerkId = useUserStore.getState().user.clerk_id
  return clerkId ? clerkId : (typeof window !== "undefined" ? window.localStorage.getItem('cc-userId') : null)
}
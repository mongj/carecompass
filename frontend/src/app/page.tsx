"use client";

import { useAuthStore } from "@/stores/auth";
import LoadingSpinner from "@/ui/loading";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Main() {
  const router = useRouter();
  const userData = useAuthStore((auth) => auth.userData);
  const isGuest = useAuthStore((auth) => auth.isGuest);

  useEffect(() => {
    if (userData || isGuest) {
      const addToHomeScreenPrompted = localStorage.getItem(
        "cc_add_to_homescreen_prompted",
      );
      if (addToHomeScreenPrompted !== "true") {
        router.push("/add-to-homescreen");
      } else {
        router.push("/home");
      }
    }
  }, [router, userData, isGuest]);

  return <LoadingSpinner />;
}

"use client";

import { useAuthStore } from "@/stores/auth";
import LoadingSpinner from "@/ui/loading";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Main() {
  const router = useRouter();
  const userData = useAuthStore((auth) => auth.userData);

  useEffect(() => {
    if (userData && userData.id) {
      const addToHomeScreenPrompted = localStorage.getItem(
        "cc_add_to_homescreen_prompted",
      );
      if (addToHomeScreenPrompted !== "true") {
        router.push("/add-to-homescreen");
      } else {
        router.push("/home");
      }
    }
  }, [router, userData]);

  return <LoadingSpinner />;
}

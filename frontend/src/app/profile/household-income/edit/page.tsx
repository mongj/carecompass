"use client";

import { api } from "@/api";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import BackButton from "@/ui/button/BackButton";
import { PCHIForm } from "@/components/PCHIForm";
import { toast } from "sonner";
import { HttpStatusCode } from "axios";
import { UserData } from "@/types/user";
import { PCHIFormData } from "@/types/pchi";

export default function EditHouseholdIncomePage() {
  const router = useRouter();
  const isSignedIn = useAuthStore((state) => state.isSignedIn);
  const userId = useAuthStore((state) => state.userId);
  const [user, setUser] = useState<UserData>();

  useEffect(() => {
    router.prefetch("/profile/saved-searches");
  }, [router]);

  useEffect(() => {
    if (isSignedIn && !user && userId) {
      api
        .get(`/users/${userId}`)
        .then((response) => {
          if (response.status === HttpStatusCode.Ok) {
            setUser(response.data);
          } else {
            toast.error("Failed to fetch user data");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [isSignedIn, userId, user]);

  const pchiData: PCHIFormData = {
    householdSize: user?.household_size ?? null,
    totalMonthlyHouseholdIncome: user?.total_monthly_household_income ?? null,
    annualPropertyValue: user?.annual_property_value ?? null,
    monthlyPchi: user?.monthly_pchi ?? 0,
  };

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <BackButton />
      <h1 className="text-2xl font-semibold">Edit Household Income</h1>
      <PCHIForm
        data={pchiData}
        callbackFn={() => {
          toast.success("Household income updated");
        }}
      />
    </div>
  );
}

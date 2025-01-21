"use client";

import { api } from "@/api";
import { useAuth } from "@clerk/nextjs";
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
  const auth = useAuth();
  const [user, setUser] = useState<UserData>();

  useEffect(() => {
    router.prefetch("/profile/saved-searches");
  }, [router]);

  useEffect(() => {
    if (auth.isLoaded && auth.isSignedIn && !user) {
      api
        .get(`/users/${auth.userId}`)
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
  }, [auth.isLoaded, auth.isSignedIn, auth.userId, user]);

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

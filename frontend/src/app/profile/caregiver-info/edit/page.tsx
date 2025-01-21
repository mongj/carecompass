"use client";

import { CaregiverData, Citizenship, UserData } from "@/types/user";
import LoadingSpinner from "@/ui/loading";
import { Stack } from "@chakra-ui/react";
import {
  Button,
  FormLabel,
  SingleSelect,
} from "@opengovsg/design-system-react";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { BackButton } from "@/ui/button";
import { useAuth } from "@clerk/nextjs";
import { HttpStatusCode } from "axios";
import { api } from "@/api";

const citizenshipOptions = [
  {
    label: "Singapore Citizen",
    value: Citizenship.CITIZEN,
  },
  {
    label: "Permanent Resident",
    value: Citizenship.PR,
  },
  {
    label: "Other",
    value: Citizenship.OTHER,
  },
];

function CaregiverDetailsForm() {
  const auth = useAuth();
  const [caregiverData, setCaregiverData] = useState<CaregiverData>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (auth.isLoaded && auth.isSignedIn && !caregiverData) {
      api
        .get(`/users/${auth.userId}`)
        .then((response) => {
          if (response.status === HttpStatusCode.Ok) {
            const userData = response.data as UserData;
            setCaregiverData({
              citizenship: userData.citizenship,
            });
          } else {
            toast.error("Failed to fetch user data");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [auth.isLoaded, auth.isSignedIn, auth.userId, caregiverData]);

  const submitDisabled =
    !caregiverData || Object.values(caregiverData).some((v) => v === "");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    api
      .patch(`/users/${auth.userId}`, caregiverData)
      .then((res) => {
        if (res.status === HttpStatusCode.Ok) {
          toast.success("Caregiver info updated successfully");
        }
      })
      .catch(() => {
        toast.error("Something went wrong. Please try again later.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  if (!caregiverData) {
    return <LoadingSpinner />;
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <Stack gap={0} spacing={0}>
        <FormLabel isRequired>Citizenship Status</FormLabel>
        <SingleSelect
          placeholder="Select an option"
          value={caregiverData.citizenship}
          name="citizenship"
          items={citizenshipOptions}
          onChange={(e) =>
            setCaregiverData({
              ...caregiverData,
              citizenship: e as Citizenship,
            })
          }
        />
      </Stack>
      <Button
        isDisabled={submitDisabled}
        isLoading={isSubmitting}
        loadingText="Submitting"
        variant="solid"
        type="submit"
      >
        Save
      </Button>
    </form>
  );
}

export default function EditCaregiverInfo() {
  return (
    <div className="flex h-full w-full flex-col gap-4">
      <BackButton />
      <h1 className="text-2xl font-semibold">Edit Caregiver Info</h1>
      <CaregiverDetailsForm />
    </div>
  );
}

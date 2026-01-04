"use client";

import { CaregiverData, Citizenship, UserData } from "@/types/user";
import LoadingSpinner from "@/ui/loading";
import { FormControl, Stack } from "@chakra-ui/react";
import {
  Button,
  FormLabel,
  SingleSelect,
  NumberInput,
  FormErrorMessage,
} from "@opengovsg/design-system-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { BackButton } from "@/ui/button";
import { useAuthStore } from "@/stores/auth";
import { HttpStatusCode } from "axios";
import { api } from "@/api";
import { userCitizenshipMapping } from "@/util/userPropMapping";
import { getRecordKeys } from "@/util/types";
import useInitialUserData from "@/util/hooks/useInitialUserData";

const citizenshipOptions = getRecordKeys(userCitizenshipMapping).map((key) => ({
  label: userCitizenshipMapping[key],
  value: key,
}));

function isInvalidCaregiverContactNumber(caregiverData: CaregiverData) {
  const contact_number_str = String(caregiverData?.contact_number ?? "");
  if (contact_number_str.length != 0 && contact_number_str.length != 8) {
    return true; // invalid contact number
  }
  return false;
}

function CaregiverDetailsForm() {
  const userId = useAuthStore((state) => state.userId);
  const setUserData = useAuthStore((state) => state.setUserData);
  const [formData, setFormData] = useInitialUserData<CaregiverData>(
    (userData) => ({
      citizenship: userData.citizenship,
      contact_number: userData.contact_number,
    }),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleContactNumberChange(e: string) {
    if (!formData) {
      return;
    }
    setFormData({
      ...formData,
      contact_number: e.length > 0 ? Number(e) : null,
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!formData || isInvalidCaregiverContactNumber(formData)) {
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.patch<UserData>(`/users/${userId}`, formData);
      if (res.status === HttpStatusCode.Ok) {
        setUserData(true, res.data);
        toast.success("Caregiver info updated successfully");
      }
    } catch (e) {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!formData) {
    return <LoadingSpinner />;
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <Stack gap={0} spacing={0}>
        <FormLabel isRequired>Citizenship Status</FormLabel>
        <SingleSelect
          isClearable={false}
          placeholder="Select an option"
          value={formData.citizenship}
          name="citizenship"
          items={citizenshipOptions}
          onChange={(e) =>
            setFormData({
              ...formData,
              citizenship: e as Citizenship,
            })
          }
        />
      </Stack>
      <Stack gap={0} spacing={0}>
        <FormControl isInvalid={isInvalidCaregiverContactNumber(formData)}>
          <FormLabel>Contact Number</FormLabel>
          <NumberInput
            showSteppers={false}
            placeholder="8-digit Singapore Phone Number"
            value={formData.contact_number ?? ""}
            name="contact_number"
            onChange={handleContactNumberChange}
            isInvalid={isInvalidCaregiverContactNumber(formData)}
          />
          <FormErrorMessage>Must either be 8 digits or empty</FormErrorMessage>
        </FormControl>
      </Stack>
      <Button
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

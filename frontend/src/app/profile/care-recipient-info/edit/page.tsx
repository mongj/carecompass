"use client";

import {
  CareRecipientData,
  Citizenship,
  Relationship,
  Residence,
  UserData,
} from "@/types/user";
import LoadingSpinner from "@/ui/loading";
import { Stack } from "@chakra-ui/react";
import {
  Button,
  FormLabel,
  NumberInput,
  Radio,
  SingleSelect,
} from "@opengovsg/design-system-react";
import { RadioGroup } from "@chakra-ui/react";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { BackButton } from "@/ui/button";
import { useAuthStore } from "@/stores/auth";
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

const relationshipOptions = [
  {
    label: "Parent",
    value: Relationship.PARENT,
  },
  {
    label: "Spouse",
    value: Relationship.SPOUSE,
  },
  {
    label: "Other family",
    value: Relationship.OTHER_FAMILY,
  },
  {
    label: "Non-family member",
    value: Relationship.NON_FAMILY,
  },
];

function CareRecipientDetailsForm() {
  const isSignedIn = useAuthStore((state) => state.isSignedIn);
  const userId = useAuthStore((state) => state.userId);
  const [careRecipientData, setCareRecipientData] =
    useState<CareRecipientData>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isSignedIn && !careRecipientData && userId) {
      api
        .get(`/users/${userId}`)
        .then((response) => {
          if (response.status === HttpStatusCode.Ok) {
            const userData = response.data as UserData;
            setCareRecipientData({
              care_recipient_age: userData.care_recipient_age,
              care_recipient_citizenship: userData.care_recipient_citizenship,
              care_recipient_residence: userData.care_recipient_residence,
              care_recipient_relationship: userData.care_recipient_relationship,
            });
          } else {
            toast.error("Failed to fetch user data");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [isSignedIn, userId, careRecipientData]);

  const submitDisabled =
    !careRecipientData ||
    Object.values(careRecipientData).some((v) => v === "");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    api
      .patch(`/users/${userId}`, careRecipientData)
      .then((res) => {
        if (res.status === HttpStatusCode.Ok) {
          toast.success("Care recipient info updated successfully");
        }
      })
      .catch(() => {
        toast.error("Something went wrong. Please try again later.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  if (!careRecipientData) {
    return <LoadingSpinner />;
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <Stack gap={0} spacing={0}>
        <FormLabel isRequired>{`I am caring for my`}</FormLabel>
        <SingleSelect
          placeholder="Select an option"
          value={careRecipientData.care_recipient_relationship}
          name="carerecipient_relationship"
          items={relationshipOptions}
          onChange={(e) =>
            setCareRecipientData({
              ...careRecipientData,
              care_recipient_relationship: e as Relationship,
            })
          }
        />
      </Stack>
      <Stack gap={0} spacing={0}>
        <FormLabel isRequired>{`Loved one’s citizenship status`}</FormLabel>
        <SingleSelect
          placeholder="Select an option"
          value={careRecipientData.care_recipient_citizenship}
          name="carerecipient_citizenship"
          items={citizenshipOptions}
          onChange={(e) =>
            setCareRecipientData({
              ...careRecipientData,
              care_recipient_citizenship: e as Citizenship,
            })
          }
        />
      </Stack>
      <Stack gap={0} spacing={0}>
        <FormLabel isRequired>{`Loved one’s age`}</FormLabel>
        <NumberInput
          min={0}
          placeholder="Age"
          value={careRecipientData.care_recipient_age}
          name="carerecipient_age"
          onChange={(e) =>
            setCareRecipientData({
              ...careRecipientData,
              care_recipient_age: Number(e),
            })
          }
        />
      </Stack>
      <Stack gap={0} spacing={0}>
        <FormLabel isRequired>{`Loved one’s residential status`}</FormLabel>
        <RadioGroup
          onChange={(e) =>
            setCareRecipientData({
              ...careRecipientData,
              care_recipient_residence: e as Residence,
            })
          }
          value={careRecipientData.care_recipient_residence.toString()}
        >
          <Radio value={Residence.HOME} allowDeselect>
            My loved one stays with me
          </Radio>
          <Radio value={Residence.NURSING_HOME_LTCF} allowDeselect>
            My loved one stays in a nursing home or residential long-term care
            facility
          </Radio>
          <Radio value={Residence.OTHER} allowDeselect>
            Others
          </Radio>
        </RadioGroup>
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

export default function EditCareRecipientInfo() {
  return (
    <div className="flex h-full w-full flex-col gap-4">
      <BackButton />
      <h1 className="text-2xl font-semibold">Edit Care Recipient Info</h1>
      <CareRecipientDetailsForm />
    </div>
  );
}

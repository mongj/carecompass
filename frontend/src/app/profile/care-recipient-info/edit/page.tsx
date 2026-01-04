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
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { BackButton } from "@/ui/button";
import { useAuthStore } from "@/stores/auth";
import { HttpStatusCode } from "axios";
import { api } from "@/api";
import useInitialUserData from "@/util/hooks/useInitialUserData";

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
  const userId = useAuthStore((state) => state.userId);
  const setUserData = useAuthStore((state) => state.setUserData);
  const [formData, setFormData] = useInitialUserData<CareRecipientData>(
    (userData) => ({
      care_recipient_age: userData.care_recipient_age,
      care_recipient_citizenship: userData.care_recipient_citizenship,
      care_recipient_residence: userData.care_recipient_residence,
      care_recipient_relationship: userData.care_recipient_relationship,
    }),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitDisabled =
    !formData || Object.values(formData).some((v) => v === "");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      const res = await api.patch<UserData>(`/users/${userId}`, formData);
      if (res.status === HttpStatusCode.Ok) {
        setUserData(true, res.data);
        toast.success("Care recipient info updated successfully");
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
        <FormLabel isRequired>{`I am caring for my`}</FormLabel>
        <SingleSelect
          isClearable={false}
          placeholder="Select an option"
          value={formData.care_recipient_relationship}
          name="carerecipient_relationship"
          items={relationshipOptions}
          onChange={(e) =>
            setFormData({
              ...formData,
              care_recipient_relationship: e as Relationship,
            })
          }
        />
      </Stack>
      <Stack gap={0} spacing={0}>
        <FormLabel isRequired>{`Loved one’s citizenship status`}</FormLabel>
        <SingleSelect
          isClearable={false}
          placeholder="Select an option"
          value={formData.care_recipient_citizenship}
          name="carerecipient_citizenship"
          items={citizenshipOptions}
          onChange={(e) =>
            setFormData({
              ...formData,
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
          value={formData.care_recipient_age}
          name="carerecipient_age"
          onChange={(e) =>
            setFormData({
              ...formData,
              care_recipient_age: Number(e),
            })
          }
        />
      </Stack>
      <Stack gap={0} spacing={0}>
        <FormLabel isRequired>{`Loved one’s residential status`}</FormLabel>
        <RadioGroup
          onChange={(e) =>
            setFormData({
              ...formData,
              care_recipient_residence: e as Residence,
            })
          }
          value={formData.care_recipient_residence.toString()}
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

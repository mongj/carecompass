"use client";

import { UserData } from "@/types/user";
import LoadingSpinner from "@/ui/loading";
import { Stack } from "@chakra-ui/react";
import {
  Button,
  BxRightArrowAlt,
  FormLabel,
  NumberInput,
  Radio,
  SingleSelect,
} from "@opengovsg/design-system-react";
import { RadioGroup } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { toast } from "sonner";

const citizenshipOptions = [
  {
    label: "Singapore Citizen",
    value: "Singapore Citizen",
  },
  {
    label: "Permanent Resident",
    value: "Permanent Resident",
  },
  {
    label: "Foreigner",
    value: "Foreigner",
  },
];

const relationshipOptions = [
  {
    label: "Parent",
    value: "Parent",
  },
  {
    label: "Spouse",
    value: "Spouse",
  },
  {
    label: "Other family",
    value: "Other family",
  },
  {
    label: "Non-family member",
    value: "Non-family member",
  },
];

function PersonalDetailsForm() {
  const router = useRouter();
  const params = useSearchParams();

  const [personalDetails, setPersonalDetails] = useState<UserData>({
    citizenship: " ",
    care_recipient_age: 65,
    care_recipient_citizenship: "",
    care_recipient_residence: 0,
    care_recipient_relationship: "",
    clerk_id: params.get("id") || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // TODO: Add validation
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    fetch(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(personalDetails),
    })
      .then((res) => {
        if (res.ok) {
          router.push("/chat");
        } else {
          toast.error("Something went wrong. Please try again later.");
        }
      })
      .catch(() => {
        toast.error("Something went wrong. Please try again later.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  // 1. Your citizenship status (Singapore Citizen/Permanent Resident/Foreigner)
  // 2. Loved one’s citizenship status (Singapore Citizen/Permanent Resident/Foreigner)
  // 3. Loved one’s age (as of today)
  // 4. Does your loved one stay with you? (Yes/No)
  // - If no, do they stay in a nursing home or residential long-term care facility?
  // 5. What is your loved one’s relationship to you? (Parent, spouse, other family, non-family member)

  return (
    <main className="flex h-full w-full flex-col gap-8 overflow-auto p-8 py-16">
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-bold">Get Started</h3>
        <span className="">
          Could you tell us a little more about yourself and your loved one?
        </span>
      </div>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Stack gap={0} spacing={0}>
          <FormLabel isRequired>{`Your citizenship status`}</FormLabel>
          <SingleSelect
            placeholder="Select an option"
            value={personalDetails.citizenship}
            name="citizenship"
            items={citizenshipOptions}
            onChange={(e) =>
              setPersonalDetails({ ...personalDetails, citizenship: e })
            }
          />
        </Stack>
        <Stack gap={0} spacing={0}>
          <FormLabel isRequired>{`I am caring for my`}</FormLabel>
          <SingleSelect
            placeholder="Select an option"
            value={personalDetails.care_recipient_relationship}
            name="carerecipient_relationship"
            items={relationshipOptions}
            onChange={(e) =>
              setPersonalDetails({
                ...personalDetails,
                care_recipient_relationship: e,
              })
            }
          />
        </Stack>
        <Stack gap={0} spacing={0}>
          <FormLabel isRequired>{`Loved one’s citizenship status`}</FormLabel>
          <SingleSelect
            placeholder="Select an option"
            value={personalDetails.care_recipient_citizenship}
            name="carerecipient_citizenship"
            items={citizenshipOptions}
            onChange={(e) =>
              setPersonalDetails({
                ...personalDetails,
                care_recipient_citizenship: e,
              })
            }
          />
        </Stack>
        <Stack gap={0} spacing={0}>
          <FormLabel isRequired>{`Loved one’s age`}</FormLabel>
          <NumberInput
            min={0}
            placeholder="Age"
            value={personalDetails.care_recipient_age}
            name="carerecipient_age"
            onChange={(e) =>
              setPersonalDetails({
                ...personalDetails,
                care_recipient_age: Number(e),
              })
            }
          />
        </Stack>
        <Stack gap={0} spacing={0}>
          <FormLabel isRequired>{`Loved one’s residential status`}</FormLabel>
          <RadioGroup
            onChange={(e) =>
              setPersonalDetails({
                ...personalDetails,
                care_recipient_residence: Number(e),
              })
            }
            value={personalDetails.care_recipient_residence.toString()}
          >
            <Radio value="0" allowDeselect>
              My loved one stays with me
            </Radio>
            <Radio value="1" allowDeselect>
              My loved one stays in a nursing home or residential long-term care
              facility
            </Radio>
            <Radio value="2" allowDeselect>
              Others
            </Radio>
          </RadioGroup>
        </Stack>
        <Button
          isLoading={isSubmitting}
          loadingText="Submitting"
          variant="solid"
          type="submit"
          rightIcon={<BxRightArrowAlt />}
        >
          {"Next"}
        </Button>
        <Button
          isLoading={isSubmitting}
          loadingText="Submitting"
          variant="outline"
          type="submit"
          rightIcon={<BxRightArrowAlt />}
        >
          {"Skip for now"}
        </Button>
      </form>
    </main>
  );
}

export default function PersonalDetailsFormWithSuspense() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PersonalDetailsForm />
    </Suspense>
  );
}

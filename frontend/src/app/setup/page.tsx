"use client";

import LoadingSpinner from "@/ui/loading";
import { Stack } from "@chakra-ui/react";
import { Button, BxChevronLeft, BxRightArrowAlt, FormLabel, Input, MultiSelect, SingleSelect } from "@opengovsg/design-system-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

const relationshipOptions = [
  {
    label: "Father",
    value: "Father",
  },
  {
    label: "Mother",
    value: "Mother",
  },
  {
    label: "Spouse",
    value: "Spouse",
  },
  {
    label: "Child",
    value: "Child",
  },
  {
    label: "Sibling",
    value: "Sibling",
  },
  {
    label: "Others",
    value: "Others",
  }
]

const medicalConditionOptions = [
  {
    value: "Dementia",
    description: "Diagnosed by a doctor"
  },
  {
    value: "Physically weaker in the past 6 months",
    description: "e.g. due to fall, amputation, or reduced strength",
    disabled: true,
  },
  {
    value: "Recent stroke",
    disabled: true,
  },
  {
    value: "Recent hip fracture",
    disabled: true,
  },
  {
    value: "Mental health symptoms or conditions",
    description: "Diagnosed by doctor to have depression, anxiety, psychosis, etc.",
    disabled: true,
  },
  {
    value: "eol",
    description: "Last stage of life (Diagnosed by doctor with prognosis of less than 1 year)",
    disabled: true,
  },
  {
    value: "Requires nursing care",
    description: "e.g. wound care, feeding tube, urinary catheter",
    disabled: true,
  },
  {
    value: "Other medical condition(s)",
    disabled: true,
  }
]

function PersonalDetailsForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [medicalCondition, setMedicalCondition] = useState<string[]>([]);

  function handleNext() {
    // store data in localstorage
    if (typeof window !== "undefined") {
      localStorage.setItem("cc-name", name);
      localStorage.setItem("cc-relationship", relationship);
      localStorage.setItem("cc-medicalCondition", JSON.stringify(medicalCondition));
    }

    if (params.has("singpass") && params.get("singpass") === "true") {
      alert("Singpass integration is not available in this demo.\n\nPreloaded data will be used instead.");
      router.push(`/singpass`);
    } else {
      router.push(`/chat`);
    }
  }

  return (
    <div className="flex flex-col h-dvh max-h-dvh">
      <main className="h-full overflow-auto flex w-full flex-col p-8 gap-8 place-content-center">
        <Button variant="link" onClick={() => router.back()} leftIcon={<BxChevronLeft />}>Back</Button>
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-2xl">Get Started</h3>
          <span className="">Could you tell us a little more about yourself?</span>
        </div>
        <div className="flex flex-col gap-4">
          <Stack gap={0} spacing={0}>
            <FormLabel isRequired>Your Name</FormLabel>
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Stack>
          <Stack gap={0} spacing={0}>
            <FormLabel isRequired>{`Care recipient's relationship to you`}</FormLabel>
            <SingleSelect
              placeholder="Select an option"
              value={relationship}
              name="relationship"
              items={relationshipOptions}
              onChange={(e) => setRelationship(e)}
            />
          </Stack>
          <Stack gap={0} spacing={0}>
            <FormLabel isRequired>{`Care recipient's medical condition`}</FormLabel>
            <MultiSelect
              placeholder="Select an option"
              values={medicalCondition}
              name="medicalConditions"
              items={medicalConditionOptions}
              onChange={(e) => setMedicalCondition(e)}
            />
          </Stack>
        </div>
        <Button variant="solid" onClick={handleNext} rightIcon={<BxRightArrowAlt />}>Next</Button>
      </main>
  </div>
  )
}

export default function PersonalDetailsFormWithSuspense() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PersonalDetailsForm />
    </Suspense>
  );
}
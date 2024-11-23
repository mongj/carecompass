"use client";

import { useState } from "react";
import { Box, Flex, Stack, Tooltip } from "@chakra-ui/react";
import { Button, Checkbox } from "@opengovsg/design-system-react";
import { useRouter } from "next/navigation";
import { QuestionIcon } from "@chakra-ui/icons";
import BackButton from "@/ui/button/BackButton";

const HOME_CARE_SERVICES = [
  {
    id: "home-medical",
    label: "Home Medical",
    description:
      "Provides medical services  in the home such as physical examinations and prescriptions.",
  },
  {
    id: "home-nursing",
    label: "Home Nursing",
    description:
      "Provides nursing care at home such as wound dressing and changing of feeding tubes.",
  },
  {
    id: "home-therapy",
    label: "Home Therapy",
    description:
      "Home-based rehabilitation, including physiotherapy, occupational therapy and speech therapy.",
  },
  {
    id: "home-personal-care",
    label: "Home Personal Care",
    description:
      "Provides personal care services such as bathing, dressing and grooming.",
  },
  {
    id: "medical-escort",
    label: "Medical Escort",
    description:
      "Provides transportation and/or someone to accompany those who are unable to travel independently to their medical appointments.",
  },
  {
    id: "dementia-enrichment",
    label: "Dementia Enrichment",
    description:
      "Specialised activities targeting cognitive, emotional and/or physical health of dementia patients.",
  },
];

export default function HomeCareServices() {
  const router = useRouter();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const handleServiceChange = (serviceId: string) => {
    setSelectedServices((prev) => {
      if (prev.includes(serviceId)) {
        return prev.filter((id) => id !== serviceId);
      }
      return [...prev, serviceId];
    });
  };

  const handleProceed = () => {
    const queryParams = new URLSearchParams();
    queryParams.set("services", selectedServices.join(","));
    router.push(`/careservice/homecare?${queryParams.toString()}`);
  };

  return (
    <div className="h-full w-full overflow-auto bg-white p-8">
      <section className="flex flex-col gap-4">
        <BackButton />
        <h1 className="text-2xl font-semibold leading-tight text-brand-primary-500">
          What kind of home care services are you considering for your loved
          one?
        </h1>
        <span className="leading-tight">Pick at least 1 to continue.</span>

        <Stack direction="column" spacing={1}>
          {HOME_CARE_SERVICES.map((service) => (
            <div key={service.id}>
              <Flex align="flex-start" gap={1}>
                <Checkbox
                  isChecked={selectedServices.includes(service.id)}
                  onChange={() => handleServiceChange(service.id)}
                  width="-moz-fit-content"
                >
                  <span className="-pr-1 font-semibold">{service.label}</span>
                </Checkbox>
                <Box mt={2}>
                  <Tooltip label={service.description} placement="top">
                    <button aria-label={`Info about ${service.label}`}>
                      <QuestionIcon color="gray.500" w={4} h={4} />
                    </button>
                  </Tooltip>
                </Box>
              </Flex>
            </div>
          ))}
        </Stack>
        <Button
          onClick={handleProceed}
          className="mt-4"
          isDisabled={selectedServices.length === 0}
        >
          Proceed
        </Button>
      </section>
    </div>
  );
}

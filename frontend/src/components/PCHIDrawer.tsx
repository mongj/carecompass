import { useState } from "react";
import { Drawer } from "vaul";
import { Button, FormLabel, NumberInput } from "@opengovsg/design-system-react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/api";
import { PCHICreate } from "@/types/pchi";
import { QuestionIcon } from "@chakra-ui/icons";
import CustomMarkdown from "@/ui/CustomMarkdown";
import { WithNullableField } from "@/types/util";
import MobileTooltip from "./MobileTooltip";

export function PCHIDrawer() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [pchi, setPchi] = useState<
    WithNullableField<
      PCHICreate,
      "householdSize" | "totalMonthlyHouseholdIncome" | "annualPropertyValue"
    >
  >({
    householdSize: null,
    totalMonthlyHouseholdIncome: null,
    annualPropertyValue: null,
    monthlyPchi: 0,
  });

  const needAnnualPropertyValue = pchi.totalMonthlyHouseholdIncome === 0;
  const canSubmit =
    pchi.householdSize !== null &&
    pchi.totalMonthlyHouseholdIncome !== null &&
    (needAnnualPropertyValue ? pchi.annualPropertyValue !== null : true);

  const submitPchi = () => {
    const pchiPayload: PCHICreate = {
      householdSize: (pchi.householdSize ?? 0) + 1,
      totalMonthlyHouseholdIncome: pchi.totalMonthlyHouseholdIncome ?? 0,
      annualPropertyValue: pchi.annualPropertyValue ?? 0,
      monthlyPchi: Math.floor(
        (pchi.totalMonthlyHouseholdIncome ?? 0) /
          ((pchi.householdSize ?? 0) + 1),
      ),
    };

    api.post(`/users/${user?.id}/pchi`, pchiPayload).then((response) => {
      if (response.status === 200) {
        setIsOpen(false);
        location.reload();
      }
    });
  };

  return (
    <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
      <Drawer.Trigger className="w-full">
        <Button className="w-full">Check subsidy level</Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 h-fit rounded-xl bg-white outline-none">
          <Drawer.Handle className="my-2" />
          <div className="flex flex-col gap-4 bg-white px-8 py-8 pt-6">
            <Drawer.Title className="text-xl font-semibold">
              Check subsidy level
            </Drawer.Title>
            <section className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <FormLabel marginBottom={0} isRequired>
                  How many people live with your loved one?
                </FormLabel>
                <span className="text-sm leading-tight text-gray-500">
                  E.g. if your loved one lives alone, type ‘0’. If one other
                  person lives with your loved one, type ’1’
                </span>
              </div>
              <NumberInput
                value={pchi.householdSize ?? ""}
                min={0}
                onChange={(e) => {
                  const v = parseInt(e);
                  setPchi({
                    ...pchi,
                    householdSize: isNaN(v) ? null : v,
                  });
                }}
              />
            </section>
            <section className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <FormLabel marginBottom={0} marginTop={4} isRequired>
                  What is the total monthly household income of everyone living
                  with your loved one?
                </FormLabel>
                <span className="text-sm leading-tight text-gray-500">
                  Include your loved one’s income as well
                </span>
              </div>
              <NumberInput
                value={pchi.totalMonthlyHouseholdIncome ?? ""}
                min={0}
                step={100}
                onChange={(e) => {
                  const v = parseInt(e);
                  setPchi({
                    ...pchi,
                    totalMonthlyHouseholdIncome: isNaN(v) ? null : v,
                  });
                }}
              />
            </section>
            {needAnnualPropertyValue && (
              <section className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <FormLabel marginBottom={0} marginTop={4} isRequired>
                    What is the Annual Value of your residential property?&nbsp;
                    <MobileTooltip
                      label="Annual Value is the estimated gross annual rent of a property if it were to be rented out, excluding furnishings and maintenance fees. It is determined by IRAS, and may be checked via IRAS website. Subsidy levels in 2024 will be determined using 2023 Annual Values"
                      placement="top"
                    >
                      <QuestionIcon color="gray.500" w={4} h={4} />
                    </MobileTooltip>
                  </FormLabel>
                  <CustomMarkdown
                    content="Check your property's Annual Value on [IRAS](https://mytax.iras.gov.sg/ESVWeb/default.aspx)"
                    className="text-sm leading-tight text-gray-500"
                  />
                </div>
                <NumberInput
                  value={pchi.annualPropertyValue ?? ""}
                  min={0}
                  step={1000}
                  onChange={(e) => {
                    const v = parseInt(e);
                    setPchi({
                      ...pchi,
                      annualPropertyValue: isNaN(v) ? null : v,
                    });
                  }}
                />
              </section>
            )}
            <Button
              className="mt-4 w-full"
              onClick={submitPchi}
              isDisabled={!canSubmit}
            >
              Submit
            </Button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

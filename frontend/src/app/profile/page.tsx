"use client";

import { SignInButton, SignOutButton, UserButton } from "@clerk/nextjs";
import {
  AccordionIcon,
  AccordionButton,
  Accordion,
  AccordionItem,
  Button,
  Skeleton,
  AccordionPanel,
} from "@chakra-ui/react";
import {
  BookmarkIcon,
  ChevronRightIcon,
  LogOutIcon,
  PencilIcon,
  InfoIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserData } from "@/types/user";
import { formatPrice } from "@/util/priceInfo";
import {
  getFormattedUserCitizenship,
  getFormattedUserRelationship,
  getFormattedUserResidence,
} from "@/util/userPropMapping";
import { useAuthStore } from "@/stores/auth";

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.userData);

  useEffect(() => {
    router.prefetch("/profile/saved-searches");
  }, [router]);

  return (
    <div className="mb-8 flex h-full w-full flex-col gap-2">
      <h1 className="mb-2 text-2xl font-semibold">My Profile</h1>
      <UserProfileCard />
      <button
        className="flex w-full place-items-center gap-2 rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50"
        onClick={() => {
          router.push("/profile/saved-searches");
        }}
      >
        <BookmarkIcon size={20} />
        <span className="w-f<BookmarkIcon size={24} />ull text-left font-semibold">
          Saved Searches
        </span>
        <ChevronRightIcon size={24} className="ml-auto" />
      </button>
      {user && <UserInfoAccordian user={user} />}
    </div>
  );
}

function UserProfileCard() {
  const isSignedIn = useAuthStore((state) => state.isSignedIn);
  const userFullName = useAuthStore((state) => state.userFullName);
  const emailAddresses = useAuthStore((state) => state.emailAddresses);

  if (isSignedIn === undefined) {
    return (
      <section className="flex w-full flex-col gap-2 rounded-lg border border-gray-200 bg-white p-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-full" />
        ))}
      </section>
    );
  }

  return (
    <section className="flex w-full rounded-lg border border-gray-200 bg-white p-4">
      {isSignedIn ? (
        <div className="flex w-full flex-col place-items-start gap-4">
          <div className="flex w-full gap-4">
            <UserButton
              appearance={{ elements: { userButtonAvatarBox: "w-12 h-12" } }}
            />
            <div className="flex flex-col">
              <span className="text-lg font-semibold">{userFullName}</span>
              <span className="text-sm text-gray-500">
                {emailAddresses?.[0]}
              </span>
            </div>
          </div>
          <SignOutButton>
            <Button
              className="w-full"
              variant="outline"
              size="xs"
              rightIcon={<LogOutIcon size={16} />}
            >
              Log out
            </Button>
          </SignOutButton>
        </div>
      ) : (
        <SignInButton>Sign In</SignInButton>
      )}
    </section>
  );
}

function UserInfoAccordian({ user }: { user: UserData }) {
  const router = useRouter();

  const caregiverDataDisplay = [
    {
      label: "Citizenship",
      value: getFormattedUserCitizenship(user.citizenship),
    },
  ];

  const careRecipientDataDisplay = [
    {
      label: "Relationship to caregiver",
      value: getFormattedUserRelationship(user.care_recipient_relationship),
    },
    {
      label: "Age",
      value: user.care_recipient_age,
    },
    {
      label: "Citizenship",
      value: getFormattedUserCitizenship(user.care_recipient_citizenship),
    },
    {
      label: "Staying at",
      value: getFormattedUserResidence(user.care_recipient_residence),
    },
  ];

  const pchiDisplay = [
    {
      label: "Household size",
      value: user.household_size,
    },
    {
      label: "Total monthly household income",
      value: formatPrice(user.total_monthly_household_income),
    },
    {
      label: "Annual property value",
      value: formatPrice(user.annual_property_value),
    },
    {
      label: "Monthly PCHI*",
      value: formatPrice(user.monthly_pchi),
    },
  ];

  return (
    user && (
      <section className="flex w-full flex-col rounded-lg border border-gray-200 bg-white">
        <h3 className="text-md flex items-center gap-2 p-4 font-semibold">
          <InfoIcon size={20} />
          Personal Details
        </h3>
        <Accordion allowMultiple>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <span className="flex-1 text-left">Caregiver Information</span>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <section className="flex flex-col">
                {caregiverDataDisplay.map((item) => (
                  <div key={item.label}>
                    <span>{item.label}: </span>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
              </section>
              <section className="mt-2 flex">
                <Button
                  variant="link"
                  size="xs"
                  className="ml-auto"
                  leftIcon={<PencilIcon size={16} />}
                  onClick={() => {
                    router.push("/profile/caregiver-info/edit");
                  }}
                >
                  Edit
                </Button>
              </section>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <span className="flex-1 text-left">
                  Care Recipient Information
                </span>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <section className="flex flex-col">
                {careRecipientDataDisplay.map((item) => (
                  <div key={item.label}>
                    <span>{item.label}: </span>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
              </section>
              <section className="mt-2 flex">
                <Button
                  variant="link"
                  size="xs"
                  className="ml-auto"
                  leftIcon={<PencilIcon size={16} />}
                  onClick={() => {
                    router.push("/profile/care-recipient-info/edit");
                  }}
                >
                  Edit
                </Button>
              </section>
            </AccordionPanel>
          </AccordionItem>
          {user.monthly_pchi !== null && (
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <span className="flex-1 text-left">Household Income</span>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <section className="flex flex-col">
                  {pchiDisplay.map((item) => (
                    <div key={item.label}>
                      <span>{item.label}: </span>
                      <span className="font-semibold">{item.value}</span>
                    </div>
                  ))}
                </section>
                <span className="text-xs text-gray-500">
                  *PCHI is the Per Capita Household Income.
                </span>
                <section className="mt-2 flex">
                  <Button
                    variant="link"
                    size="xs"
                    className="ml-auto"
                    leftIcon={<PencilIcon size={16} />}
                    onClick={() => {
                      router.push("/profile/household-income/edit");
                    }}
                  >
                    Edit
                  </Button>
                </section>
              </AccordionPanel>
            </AccordionItem>
          )}
        </Accordion>
      </section>
    )
  );
}

"use client";

import {
  SignInButton,
  SignOutButton,
  useAuth,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { Button, Divider, Skeleton } from "@chakra-ui/react";
import {
  BookmarkIcon,
  ChevronRightIcon,
  LogOutIcon,
  PencilIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UserData } from "@/types/user";
import { HttpStatusCode } from "axios";
import { api } from "@/api";
import { toast } from "sonner";
import { formatPrice } from "@/util/priceInfo";

export default function ProfilePage() {
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

  const userDataDisplay = [
    {
      label: "Citizenship",
      value: user?.citizenship,
    },
    {
      label: "Loved one's relationship",
      value: user?.care_recipient_relationship,
    },
    {
      label: "Loved one's age",
      value: user?.care_recipient_age,
    },
    {
      label: "Loved one's citizenship",
      value: user?.care_recipient_citizenship,
    },
    {
      label: "Loved one's residence",
      value: user?.care_recipient_residence,
    },
  ];

  const pchiDisplay = [
    {
      label: "Household size",
      value: user?.household_size,
    },
    {
      label: "Total monthly household income",
      value: user
        ? formatPrice(user.total_monthly_household_income)
        : undefined,
    },
    {
      label: "Annual property value",
      value: user ? formatPrice(user.annual_property_value) : undefined,
    },
    {
      label: "Monthly PCHI",
      value: user ? formatPrice(user.monthly_pchi) : undefined,
    },
  ];

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
        <BookmarkIcon size={24} />
        <span className="w-full text-left font-semibold">Saved Searches</span>
        <ChevronRightIcon size={24} />
      </button>
      {user && (
        <section className="flex w-full flex-col gap-1 rounded-lg border border-gray-200 bg-white p-4">
          <Button
            variant="outline"
            size="xs"
            rightIcon={<PencilIcon size={16} />}
            isDisabled={true}
            className="mb-2"
          >
            Edit
          </Button>
          {userDataDisplay.map((item) => (
            <div key={item.label}>
              <span>{item.label}: </span>
              <span className="font-semibold">{item.value}</span>
            </div>
          ))}
          {user.monthly_pchi !== null && (
            <>
              <Divider className="my-2" />
              {pchiDisplay.map((item) => (
                <div key={item.label}>
                  <span>{item.label}: </span>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
            </>
          )}
        </section>
      )}
    </div>
  );
}

function UserProfileCard() {
  const auth = useAuth();
  const { user } = useUser();

  if (auth.isSignedIn === undefined) {
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
      {auth.isSignedIn ? (
        <div className="flex w-full flex-col place-items-start gap-4">
          <div className="flex w-full gap-4">
            <UserButton />
            <div className="flex flex-col">
              <span className="text-lg font-semibold">{user?.fullName}</span>
              <span className="text-sm text-gray-500">
                {user?.emailAddresses[0].emailAddress}
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
        <SignInButton>
          <Button
            className="w-full"
            onClick={() => {
              window.localStorage.removeItem("cc-userId");
            }}
          >
            Sign In
          </Button>
        </SignInButton>
      )}
    </section>
  );
}

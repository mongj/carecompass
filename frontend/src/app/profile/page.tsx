"use client";

import {
  SignInButton,
  SignOutButton,
  useAuth,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { Button, Skeleton } from "@chakra-ui/react";
import { LogOutIcon } from "lucide-react";
export default function ProfilePage() {
  return (
    <div className="flex h-full w-full flex-col gap-4">
      <h1 className="text-2xl font-semibold">My Profile</h1>
      <UserProfileCard />
      <div className="flex w-full flex-col gap-2">
        <h1 className="text-xl font-semibold">Saved Searches</h1>
        <section className="w-full rounded-lg border border-gray-200 bg-white p-4">
          🚧 Coming soon 🚧
        </section>
      </div>
      <div className="flex w-full flex-col gap-2">
        <h1 className="text-xl font-semibold">My Reviews</h1>
        <section className="w-full rounded-lg border border-gray-200 bg-white p-4">
          🚧 Coming soon 🚧
        </section>
      </div>
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

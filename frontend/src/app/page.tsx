"use client";

import { useAuthStore } from "@/stores/auth";
import { useUserStore } from "@/stores/user";
import LoadingSpinner from "@/ui/loading";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Main() {
  // const userId = typeof window !== "undefined" ? window.localStorage.getItem('cc-userId') : null;
  // if (userId) {
  //   return <Route route="/chat" />
  // } else {
  //   return <Route route="/auth" />
  // }
  return (
    <>
      <SignedIn>
        <UserInfoChecker />
      </SignedIn>
      <SignedOut>
        <Route route="/auth" />
      </SignedOut>
    </>
  );
}

function Route(props: { route: string }) {
  const router = useRouter();

  useEffect(() => {
    router.push(props.route);
  });

  return null;
}

function UserInfoChecker() {
  const router = useRouter();
  const { user } = useUser();
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);
  const setUser = useUserStore((state) => state.setUser);

  // Update auth store and fetch user data declaratively
  useEffect(() => {
    if (!user) {
      return;
    }

    setCurrentUser(user);

    fetch(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/users/${user.id}`).then(
      (res) => {
        if (res.ok) {
          res.json().then((data) => {
            setUser(data);
            const addToHomeScreenPrompted = localStorage.getItem(
              "cc_add_to_homescreen_prompted",
            );
            if (addToHomeScreenPrompted !== "true") {
              router.push("/add-to-homescreen");
            } else {
              router.push("/home");
            }
          });
        } else if (res.status === 404) {
          router.push(`/onboarding?id=${user.id}`);
        } else {
          router.push("/error");
        }
      },
    );
  }, [router, setCurrentUser, setUser, user]);

  if (!user) {
    return (
      <main className="flex h-full w-full place-content-center place-items-center">
        <LoadingSpinner />
      </main>
    );
  }
}

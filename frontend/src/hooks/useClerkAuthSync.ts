"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { api, ApiError, setTokenGetter } from "@/api";
import { useAuthStore } from "@/stores/auth";
import { UserData } from "@/types/user";
import { UserResource } from "@clerk/types";

type ClerkUserInfo = {
  userId: string;
  userFullName: string | null;
  emailAddresses: string[];
};

function getClerkUserInfo(user: UserResource): ClerkUserInfo {
  return {
    userId: user.id,
    userFullName: user.fullName,
    emailAddresses: user.emailAddresses.map((email) => email.emailAddress),
  };
}

function needsAuthStoreSync(
  clerkUserInfo: ClerkUserInfo,
  storeIsSignedIn: boolean,
  storeUserId?: string,
): boolean {
  return !storeIsSignedIn || storeUserId !== clerkUserInfo.userId;
}

export function useClerkAuthSync(): void {
  const router = useRouter();
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();

  const signIn = useAuthStore((state) => state.signIn);
  const signOut = useAuthStore((state) => state.signOut);
  const setUserData = useAuthStore((state) => state.setUserData);

  const storeIsSignedIn = useAuthStore((state) => state.isSignedIn);
  const storeUserId = useAuthStore((state) => state.userId);
  const storeUserFullName = useAuthStore((state) => state.userFullName);
  const storeEmailAddresses = useAuthStore((state) => state.emailAddresses);
  const storeUserData = useAuthStore((state) => state.userData);

  useEffect(() => {
    let cancelled = false;

    const handleSignedOut = () => {
      setTokenGetter(null);
      signOut();
    };

    const fetchAndSetUserProfile = async (): Promise<void> => {
      try {
        const res = await api.get<UserData>("/users/me");
        if (cancelled) return;
        setUserData(true, res.data);
      } catch (error) {
        if (cancelled) return;
        if (
          error instanceof ApiError &&
          (error.status === 401 || error.status === 403)
        ) {
          console.warn("Auth not ready while fetching /users/me:", error);
          return;
        }
        if (error instanceof ApiError && error.status === 404) {
          setUserData(false, undefined);
          router.push("/onboarding");
          return;
        }
        console.error("Failed to fetch user data:", error);
      }
    };

    const sync = async () => {
      if (!isLoaded) return;

      if (!isSignedIn || !user) {
        handleSignedOut();
        return;
      }

      try {
        setTokenGetter(getToken);

        const clerkUserInfo = getClerkUserInfo(user);
        let shouldFetchProfile = false;
        if (needsAuthStoreSync(clerkUserInfo, storeIsSignedIn, storeUserId)) {
          signIn(
            true,
            clerkUserInfo.userId,
            clerkUserInfo.userFullName,
            clerkUserInfo.emailAddresses,
          );
          shouldFetchProfile = true;
        } else if (!storeUserData) {
          shouldFetchProfile = true;
        }

        if (!shouldFetchProfile) return;

        await fetchAndSetUserProfile();
      } catch (error) {
        if (cancelled) return;
        console.error("Failed to get Clerk token:", error);
        handleSignedOut();
      }
    };

    sync();
    return () => {
      cancelled = true;
    };
  }, [
    getToken,
    isLoaded,
    isSignedIn,
    router,
    signIn,
    signOut,
    setUserData,
    storeEmailAddresses,
    storeIsSignedIn,
    storeUserData,
    storeUserFullName,
    storeUserId,
    user,
  ]);
}

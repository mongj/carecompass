"use client";

import { ClerkProvider, useAuth, useUser } from "@clerk/nextjs";
import { PropsWithChildren, useEffect } from "react";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "next/navigation";

/**
 * Component that wraps ClerkProvider and syncs Clerk auth state to the useAuthStore.
 * Also fetches and sets user data from the backend when authenticated.
 */
function ClerkProviderAdapter({ children }: PropsWithChildren<unknown>) {
  const router = useRouter();
  const auth = useAuth();
  const { user } = useUser();
  const setAuth = useAuthStore((state) => state.setAuth);
  const setUserData = useAuthStore((state) => state.setUserData);
  const userData = useAuthStore((state) => state.userData);

  // Sync Clerk auth state to auth store
  useEffect(() => {
    setAuth(
      auth.isSignedIn ?? false,
      auth.userId ?? undefined,
      user?.fullName ?? undefined,
      user?.emailAddresses?.map((email) => email.emailAddress),
    );
  }, [auth.isSignedIn, auth.userId, user, setAuth]);

  // Fetch user data from backend when authenticated
  useEffect(() => {
    if (auth.isSignedIn && auth.userId && !userData?.id) {
      fetch(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/users/${auth.userId}`)
        .then((res) => {
          if (res.ok) {
            res.json().then((data) => {
              setUserData(true, data);
            });
          } else if (res.status === 404) {
            setUserData(false, undefined);
            router.push(`/onboarding?id=${auth.userId}`);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch user data:", error);
        });
    }
  }, [auth.isSignedIn, auth.userId, userData?.id, setUserData, router]);

  return <>{children}</>;
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <ClerkProviderAdapter>{children}</ClerkProviderAdapter>
    </ClerkProvider>
  );
}

"use client";

import { ClerkProvider, useAuth, useUser } from "@clerk/nextjs";
import { PropsWithChildren, useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth";
import { UserData } from "@/types/user";
import { useRouter } from "next/navigation";
import { api, ApiError, setClerkToken } from "@/api";

function ClerkProviderAdapter({ children }: PropsWithChildren<unknown>) {
  const router = useRouter();
  const auth = useAuth();
  const { user } = useUser();
  const signIn = useAuthStore((state) => state.signIn);
  const signOut = useAuthStore((state) => state.signOut);
  const setUserData = useAuthStore((state) => state.setUserData);
  const userData = useAuthStore((state) => state.userData);
  const [isFetchingToken, setIsFetchingToken] = useState(false);

  useEffect(() => {
    const getToken = async () => {
      if (auth.isSignedIn && !isFetchingToken) {
        setIsFetchingToken(true);
        try {
          const token = await auth.getToken();
          setClerkToken(token);
        } catch (error) {
          console.error("Failed to get Clerk token:", error);
        } finally {
          setIsFetchingToken(false);
        }
      } else if (!auth.isSignedIn) {
        setClerkToken(null);
      }
    };
    getToken();
  }, [auth.isSignedIn, auth.getToken, isFetchingToken]);

  useEffect(() => {
    if (auth.isLoaded) {
      if (auth.isSignedIn) {
        signIn(
          auth.isSignedIn ?? false,
          auth.userId ?? undefined,
          user?.fullName ?? undefined,
          user?.emailAddresses?.map((email) => email.emailAddress),
        );
      } else {
        signOut();
      }
    }
  }, [auth.isLoaded, auth.isSignedIn, auth.userId, user, signIn, signOut]);

  useEffect(() => {
    if (auth.isSignedIn && !userData) {
      api
        .get<UserData>("/users/me")
        .then((res) => {
          setUserData(true, res.data);
        })
        .catch((error) => {
          if (error instanceof ApiError && error.status === 404) {
            setUserData(false, undefined);
            router.push("/onboarding");
          } else {
            console.error("Failed to fetch user data:", error);
          }
        });
    }
  }, [auth.isSignedIn, userData, setUserData, router]);

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

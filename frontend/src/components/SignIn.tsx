"use client";

import { useAuthStore } from "@/stores/auth";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@opengovsg/design-system-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignIn() {
  const router = useRouter();
  const signInAsGuest = useAuthStore((state) => state.signInAsGuest);

  useEffect(() => {
    router.prefetch("/home");
  }, [router]);

  const handleSignInAsGuest = () => {
    signInAsGuest();
    router.push("/");
  };

  return (
    <div className="flex h-dvh max-h-dvh flex-col">
      <main className="flex h-full w-full flex-col place-content-center gap-4 overflow-auto p-8">
        <h3 className="text-2xl font-bold">Welcome to CareCompass</h3>
        <span>
          We are a care recommender that provides personalized recommendations
          based on your caregiving needs.
        </span>
        <Image
          src="/img/meditation.svg"
          alt="logo"
          width={500}
          height={200}
          className="py-4"
        />
        <SignInButton forceRedirectUrl="/">
          <Button>Sign In</Button>
        </SignInButton>
        <button
          className="underline underline-offset-4"
          onClick={handleSignInAsGuest}
        >
          Try as a Guest
        </button>
      </main>
    </div>
  );
}

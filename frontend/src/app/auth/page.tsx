'use client'

import { Button } from "@opengovsg/design-system-react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

export default function Auth() {
  const router = useRouter();
  return (
    <div className="flex flex-col h-dvh max-h-dvh">
      <main className="h-full overflow-auto flex w-full flex-col p-8 gap-4 place-content-center">
        <h3 className="font-bold text-2xl">Welcome to CareCompass</h3>
        <span className="">We are a care recommender that provides personalized recommendations based on your caregiving needs.</span>
        <Image src="/img/scene-messaging.svg" alt="logo" width={500} height={200} />
        <Button onClick={() => {
          const userId = uuidv4();
          localStorage.setItem('cc-userId', userId);
          router.push(`/onboarding?id=${userId}`);
        }}>Get Started</Button>
        {/* <SignInButton forceRedirectUrl="/">
          <Button>Get Started</Button>
        </SignInButton> */}
      </main>
  </div>
  )
}

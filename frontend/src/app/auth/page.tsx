'use client'

import { SignInButton } from "@clerk/nextjs";
import { Button } from "@opengovsg/design-system-react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

export default function Auth() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleContinueNoSignIn = () => {
    const userId = uuidv4();
    localStorage.setItem('cc-userId', userId);

    setIsSubmitting(true);
    
    const personalDetails = {
      citizenship: " ",
      care_recipient_age: 65,
      care_recipient_citizenship: "",
      care_recipient_residence: 0,
      care_recipient_relationship: "",
      clerk_id: userId
    }
  
    fetch(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(personalDetails),
    }).then((res) => {
      if (res.ok) {
        router.push("/chat");
      } else {
        toast.error('Something went wrong. Please try again later.')
      }
    }).catch(() => {
      toast.error('Something went wrong. Please try again later.')
    }).finally(() => {
      setIsSubmitting(false);
    });
  }

  return (
    <div className="flex flex-col h-dvh max-h-dvh">
      <main className="h-full overflow-auto flex w-full flex-col p-8 gap-4 place-content-center">
        <h3 className="font-bold text-2xl">Welcome to CareCompass</h3>
        <span className="">We are a care recommender that provides personalized recommendations based on your caregiving needs.</span>
        <Image src="/img/scene-messaging.svg" alt="logo" width={500} height={200} />
        <SignInButton forceRedirectUrl="/">
          <Button isDisabled={isSubmitting}>Sign In</Button>
        </SignInButton>
        <Button variant="outline" onClick={handleContinueNoSignIn} isDisabled={isSubmitting}>Continue without Sign In</Button>
      </main>
  </div>
  )
}

"use client";

import { Button } from "@opengovsg/design-system-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  function handleSingpass() {
    router.push("/setup?singpass=true");
  }

  function handleNoSingpass() {
    router.push("/setup?singpass=false");
  }

  return (
    <div className="flex flex-col h-dvh max-h-dvh">
      <main className="h-full overflow-auto flex w-full flex-col p-8 gap-4 place-content-center">
        <h3 className="font-bold text-2xl">Welcome to CareCompass+</h3>
        <span className="">We are a care recommender that provides personalized recommendations based on your caregiving needs.</span>
        <Image src="/img/scene-messaging.svg" alt="logo" width={500} height={200} />
        <Button onClick={handleSingpass}>Sign in with Singpass</Button>
        <Button variant="outline" onClick={handleNoSingpass}>Continue without signing in</Button>
      </main>
  </div>
  )
}

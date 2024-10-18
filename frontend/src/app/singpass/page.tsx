"use client";

import LoadingSpinner from "@/ui/loading";
import { Button, BxRightArrowAlt } from "@opengovsg/design-system-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

function SingpassAuth() {
  const router = useRouter();

  function handleMyInfo() {
      alert("Singpass integration is not available in this demo.\n\nPreloaded data will be used instead.");
      router.push(`/chat`);
  }

  function handleScanNRIC() {
      alert("This option allows caregivers to scan the care recipient's NRIC to retrieve basic information such as name, age, and address.\n\nThis feature is not available yet and preloaded data will be used instead.");
      router.push(`/chat`);
  }

  function handleNext() {
    router.push(`/chat`);
  }

  return (
    <div className="flex flex-col h-dvh max-h-dvh">
      <main className="h-full overflow-auto flex w-full flex-col p-8 gap-8 place-content-center">
        <Image src="/img/scene-communication.svg" alt="logo" width={500} height={200} />
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-lg">{`Would you like to share your care recipient’s details for a more personalised experience?`}</span>
          <span className="text-sm">This information will be used to recommend any subsidies or services that may be useful to you.</span>
        </div>
        <div className="flex flex-col gap-4">
          <Button variant="solid" onClick={handleMyInfo} rightIcon={<BxRightArrowAlt />} bgColor="#F4333D" borderColor="#F4333D" _hover={{ bg: '#df0c17', borderColor:"#df0c17" }}>Yes, Authorize MyInfo</Button>
          <Button variant="solid" onClick={handleScanNRIC} rightIcon={<BxRightArrowAlt />}>Yes, scan NRIC</Button>
          <Button variant="outline" onClick={handleNext} rightIcon={<BxRightArrowAlt />}>Skip for now</Button>
        </div>
      </main>
  </div>
  )
}

export default function SingpassAuthWithSuspense() {
  return <Suspense fallback={<LoadingSpinner />}><SingpassAuth /></Suspense>;
}
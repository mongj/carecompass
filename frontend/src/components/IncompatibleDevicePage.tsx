"use client";
import Image from "next/image";

export function IncompatibleDevicePage() {
  return (
    <main className="hidden h-full w-full flex-col place-content-center place-items-center gap-4 p-8 sm:flex">
      <h3 className="text-4xl font-bold">Welcome to CareCompass</h3>
      <span className="">
        Sorry, CareCompass is currently only available for mobile devices.
      </span>
      <Image
        src="/img/scene-messaging.svg"
        alt="logo"
        width={500}
        height={200}
      />
    </main>
  );
}

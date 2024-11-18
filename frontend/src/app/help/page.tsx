"use client";

import { BackButton } from "@/ui/button";
import Link from "next/link";

const OPTIONS = [
  {
    title: "I’d like to learn how to care for my loved one and myself.",
    subtitle: "Educational Resources",
    link: "/help/education",
  },
  {
    title: "I’d like to speak to someone.",
    subtitle: "Hotline",
    link: "/help/hotline",
  },
  {
    title: "I’d like to connect with other caregivers and/or join a community",
    subtitle: "Community Support",
    link: "/help/community",
  },
];

export default function HelpPage() {
  return (
    <div className="flex h-full w-full flex-col gap-4">
      <BackButton />
      <h1 className="mb-4 text-2xl font-semibold leading-tight text-brand-primary-500">
        Let me know which help and support options you’d like to get started
        with
      </h1>
      {OPTIONS.map((option) => (
        <Link href={option.link} key={option.link}>
          <div className="flex flex-col gap-1 rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-500">{option.subtitle}</p>
            <h2 className="font-semibold leading-tight">{option.title}</h2>
          </div>
        </Link>
      ))}
    </div>
  );
}

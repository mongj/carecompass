"use client";

import Carousel from "@/ui/carousel/Carousel";
import { useUser } from "@clerk/nextjs";
import { EmblaOptionsType } from "embla-carousel";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type SlideDataType = {
  title: string;
  img: string;
  link: string;
};

const slideData: SlideDataType[] = [
  {
    title: "What caregiving services are available?",
    img: "/img/illustration_1.svg",
    link: "/careservice",
  },
  {
    title: "What financial schemes might I be eligible for?",
    img: "/img/illustration_2.svg",
    link: "/dashboard",
  },
  {
    title: "Where can I go for help and support?",
    img: "/img/illustration_3.svg",
    link: "/help",
  },
];

export default function Home() {
  const router = useRouter();
  const { user } = useUser();
  const OPTIONS: EmblaOptionsType = { align: "start" };
  const greeting = user?.firstName ? `Hello ${user.firstName}` : "Hello there";

  useEffect(() => {
    router.prefetch("/careservice");
    router.prefetch("/dashboard");
    router.prefetch("/help");
  }, [router]);

  return (
    <div className="flex h-full w-full flex-col place-content-center place-items-start">
      <div className="flex h-full max-h-[512px] w-full flex-col place-content-between">
        <h1 className="text-xl font-semibold">{greeting}</h1>
        <div className="flex flex-col gap-8">
          <h1 className="text-2xl font-semibold text-brand-primary-500">
            How can we help you today?
          </h1>
          <Carousel
            slides={slideData.map((data, index) => (
              <MenuCard data={data} key={index} />
            ))}
            options={OPTIONS}
          />
        </div>
      </div>
    </div>
  );
}

function MenuCard({ data }: { data: SlideDataType }) {
  const router = useRouter();
  return (
    <div className="min-w-0 flex-[0_0_80%] pl-6 first:pl-0">
      <div
        className="flex h-[50vh] max-h-[50vh] min-h-64 cursor-pointer select-none flex-col place-content-center place-items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 text-lg font-semibold shadow transition-colors duration-200 hover:bg-gray-50"
        onClick={() => router.push(data.link)}
      >
        <Image
          src={data.img}
          alt={data.title}
          height={150}
          width={150}
          className="max-w-[30vw]"
        />
        <span className="text-center text-xl leading-tight">{data.title}</span>
      </div>
    </div>
  );
}

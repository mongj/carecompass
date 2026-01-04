"use client";

import { useAuthStore } from "@/stores/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ReactElement, useEffect, useMemo } from "react";

interface MenuCardData {
  span: ReactElement;
  text: string;
  img: string;
  link: string;
  isSignInRequired: boolean;
}

const cardDataList: MenuCardData[] = [
  {
    span: (
      <span>
        What <span className="text-brand-primary-500">caregiving services</span>{" "}
        are available?
      </span>
    ),
    text: "What caregiving services are available?",
    img: "/img/illustration_5.svg",
    link: "/careservice",
    isSignInRequired: false,
  },
  {
    span: (
      <span>
        What <span className="text-brand-primary-500">financial schemes</span>{" "}
        might my <span className="text-brand-primary-500">loved one</span> be
        eligible for?
      </span>
    ),
    text: "Find out what financial schemes are available for your loved one",
    img: "/img/illustration_3.svg",
    link: "/dashboard",
    isSignInRequired: true,
  },
  {
    span: (
      <span>
        Where can I go for{" "}
        <span className="text-brand-primary-500">help and support</span>?
      </span>
    ),
    text: "Where can I go for help and support?",
    img: "/img/illustration_1.svg",
    link: "/help",
    isSignInRequired: true,
  },
  {
    span: (
      <span>
        How can I <span className="text-brand-primary-500">monitor</span> my{" "}
        <span className="text-brand-primary-500">
          loved one&apos;s mental state
        </span>
        ?
      </span>
    ),
    text: "How can I monitor my loved one's mental state?",
    img: "/img/illustration_2.svg",
    link: "/heartbeat",
    isSignInRequired: true,
  },
  {
    span: (
      <span>
        How can I <span className="text-brand-primary-500">plan ahead</span>{" "}
        with my loved one for{" "}
        <span className="text-brand-primary-500">end-of-life</span>?
      </span>
    ),
    text: "How can I plan ahead with my loved one for end-of-life?",
    img: "/img/illustration_4.svg",
    link: "https://mylegacy.life.gov.sg/end-of-life-planning/",
    isSignInRequired: false,
  },
];

export default function Home() {
  const router = useRouter();
  const isSignedIn = useAuthStore((state) => state.isSignedIn);

  const { enabledCards, disabledCards } = useMemo(() => {
    let enabledCards: MenuCardData[] = [];
    const disabledCards: MenuCardData[] = [];
    if (isSignedIn) {
      enabledCards = cardDataList;
    } else {
      cardDataList.forEach((i) => {
        if (i.isSignInRequired) {
          disabledCards.push(i);
        } else {
          enabledCards.push(i);
        }
      });
    }
    return {
      enabledCards,
      disabledCards,
    };
  }, [isSignedIn]);

  useEffect(() => {
    const addToHomeScreenPrompted = localStorage.getItem(
      "cc_add_to_homescreen_prompted",
    );
    if (addToHomeScreenPrompted !== "true") {
      router.push("/add-to-homescreen");
      return;
    }

    router.prefetch("/careservice");
    router.prefetch("/dashboard");
    router.prefetch("/help");
  }, [router]);

  return (
    <div className="flex h-full w-full flex-col place-content-start place-items-start pt-8">
      <div className="flex h-full max-h-[512px] w-full flex-col place-content-between">
        <div className="mb-6 flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-brand-primary-500">
            Explore Caregiving Questions
          </h1>
          <span className="text-xl font-bold text-[rgb(128,128,128,0.55)]">
            See what other caregivers are asking
          </span>
        </div>
        <div className="flex flex-col gap-2 pb-8">
          {enabledCards.map((data, index) => (
            <MenuCard key={index} data={data} />
          ))}
        </div>
        {disabledCards.length > 0 && (
          <div className="flex flex-col gap-2 pb-8">
            <p>
              <i>Sign-In Required</i>
            </p>
            {disabledCards.map((data, index) => (
              <MenuCard key={index} data={data} isDisabled />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MenuCard({
  data,
  isDisabled,
}: {
  data: MenuCardData;
  isDisabled?: boolean;
}) {
  const router = useRouter();

  const handleClick = () => {
    !isDisabled && router.push(data.link);
  };

  return (
    <div
      className={`flex cursor-pointer place-items-center gap-3 rounded-2xl bg-white p-3 shadow-md hover:bg-gray-50 ${isDisabled ? "opacity-50 grayscale" : ""}`}
      onClick={handleClick}
    >
      <div className="mb-auto flex min-h-20 min-w-20 place-content-center place-items-center rounded-xl bg-[#F2F2F2]">
        <Image
          src={data.img}
          height={64}
          width={64}
          className="max-h-16 max-w-16"
          alt={data.text}
        />
      </div>
      <div className="text-base text-[#2C2E34]">{data.span}</div>
    </div>
  );
}

"use client";

import { BackButton } from "@/ui/button";
import { PhoneIcon } from "@chakra-ui/icons";
type HotlineData = {
  name: string;
  description: string;
  link: string;
};

const HOTLINES: HotlineData[] = [
  {
    name: "Community Outreach Team (CREST)",
    description:
      "Provides emotional support for caregivers and persons with or at risk of dementia. Helps facilitate linkages with relevant health and social care services where necessary. ",
    link: "1800-650-6060",
  },
  {
    name: "Dementia Helpline",
    description:
      "Provides information and service linkages on dementia care. Operated by Dementia Singapore, Singapore’s leading Social Service Agency (SSA) in specialised dementia care.",
    link: "63770700",
  },
  {
    name: "Caregiver Services Support Care Line",
    description:
      "Speak with trained care coordinators to brainstorm practical solutions. Operated by TOUCH Community Services, a not-for-profit charitable organisation.",
    link: "68046555",
  },
];

export default function Page() {
  return (
    <div className="flex h-full w-full flex-col gap-4">
      <BackButton />
      <h3 className="text-lg font-semibold leading-tight text-gray-500">
        I see that you wish to speak to a professional for help.
      </h3>
      <h1 className="mb-4 text-2xl font-semibold leading-tight text-brand-primary-500">
        Here are some agencies with qualified professionals you can speak to
      </h1>
      <section className="flex flex-col gap-2 pb-8">
        {HOTLINES.map((hotline, index) => (
          <HotlineCard key={index} hotline={hotline} />
        ))}
      </section>
    </div>
  );
}

function HotlineCard({ hotline }: { hotline: HotlineData }) {
  return (
    <div className="flex place-content-start place-items-start gap-2 rounded-md border border-gray-200 bg-white p-4 text-left">
      <div className="flex flex-col gap-2">
        <span className="text-lg font-semibold">{hotline.name}</span>
        <span>{hotline.description}</span>
        <div className="flex place-items-center gap-2">
          <PhoneIcon color="#1361f0" />
          <a
            href={`tel:${hotline.link}`}
            className="text-brand-primary-500 underline"
          >
            {hotline.link}
          </a>
        </div>
      </div>
    </div>
  );
}

"use client";

import { BackButton } from "@/ui/button";
import ExternalLink from "@/ui/ExternalLink";
type PartnerData = {
  name: string;
  description: string;
  link: string;
};

const PARTNERS: PartnerData[] = [
  {
    name: "Caregivers Alliance Limited",
    description:
      "Caregivers Alliance Limited (CAL) is a non-profit organisation in Singapore dedicated to meeting the needs of caregivers of persons with mental health issues through education, support networks, crisis support, tailored services and self-care enablement.\n\nWhile there are other organisations providing support to the community affected by mental health issues, only CAL focuses exclusively on supporting caregivers.",
    link: "https://www.cal.org.sg/programme-support",
  },
  {
    name: "Dementia Singapore",
    description:
      "Singapore’s leading Social Service Agency in specialised dementia care, caregiver support, training, consultancy, and advocacy.",
    link: "https://dementia.org.sg/csg",
  },
];

export default function Page() {
  return (
    <div className="flex h-full w-full flex-col gap-4">
      <BackButton />
      <h3 className="text-lg font-semibold leading-tight text-gray-500">
        I see that you would like to connect with likeminded caregivers.
      </h3>
      <h1 className="mb-4 text-2xl font-semibold leading-tight text-brand-primary-500">
        Here are some resources and communities where you may find support and
        shared experiences
      </h1>
      <section className="flex flex-col gap-2 pb-8">
        {PARTNERS.map((partner, index) => (
          <PartnerCard key={index} partner={partner} />
        ))}
      </section>
    </div>
  );
}

function PartnerCard({ partner }: { partner: PartnerData }) {
  return (
    <div className="flex place-content-start place-items-start gap-2 rounded-md border border-gray-200 bg-white p-4 text-left">
      <div className="flex flex-col gap-2">
        <span className="text-lg font-semibold">{partner.name}</span>
        <span className="whitespace-pre-line leading-tight">
          {partner.description}
        </span>
        <ExternalLink link={partner.link} text="Learn more" />
      </div>
    </div>
  );
}

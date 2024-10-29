"use client";

import { EligibilityCriteria, SchemeData } from "@/types/scheme";
import CustomMarkdown from "@/ui/CustomMarkdown";
import LoadingSpinner from "@/ui/loading";
import { Text } from "@chakra-ui/react";
import { BxsCheckCircle } from "@opengovsg/design-system-react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function SupportDetails() {
  const param = useSearchParams();
  const [scheme, setScheme] = useState<SchemeData>();

  useEffect(() => {
    fetch('/data/schemes.json')
      .then((response) => response.json() as Promise<SchemeData[]>)
      .then((json) => {
        setScheme(json.find((scheme) => scheme.id === param.get('id')));
      });
  }, [param]);

  if (!scheme) {
    return <LoadingSpinner />;
  }

  const numCriteria = scheme.eligibility.length
  const numFulfilledCriteria = scheme.eligibility.filter((criteria) => criteria.satisfied).length

  return (
    <div className="flex flex-col h-full w-full gap-4 py-6">
      <section className="flex flex-col gap-2">
        <h3 className="font-semibold text-lg">{scheme.name}</h3>
        <div className="flex p-4 bg-white border border-gray-200 rounded-md gap-2 place-items-start place-content-start text-left">
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-sm">Overview</span>
            <span className="text-sm mb-4">{scheme.description}</span>
            <span className="font-semibold text-sm">Benefits</span>
            <span className="text-sm">{scheme.benefits}</span>
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-2">
        <h3 className="font-semibold text-lg">Eligibility</h3>
        <div className="flex flex-col p-4 bg-white border border-gray-200 rounded-md gap-3 place-items-start place-content-start text-left">
        <Text color="green" fontSize="sm" fontWeight="semibold">{numFulfilledCriteria} of {numCriteria} eligibility criteria met</Text>
          <div className="flex flex-col gap-3">
            {scheme.eligibility.map((criteria, index) => <CriteriaIndicator key={index} criteria={criteria} />)}
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-2 pb-6">
        <h3 className="font-semibold text-lg">Next steps</h3>
        <div className="flex flex-col p-4 bg-white border border-gray-200 rounded-md gap-2 place-items-start place-content-start text-left">
          <div className="flex flex-col text-sm gap-3">
            <CustomMarkdown content={scheme.nextSteps} />
          </div>
        </div>
      </section>
    </div>
  );
}

function CriteriaIndicator({ criteria }: { criteria: EligibilityCriteria }) {
  return (
    <div className="flex gap-2 place-items-start">
      <BxsCheckCircle color={criteria.satisfied ? "green" : "default"} fontSize="1.5rem" className="flex-none" />
      <span className="text-sm place-self-center">{criteria.description}</span>
    </div>
  );
}

export default function SupportDetailsWithSuspense() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SupportDetails />
    </Suspense>
  );
}
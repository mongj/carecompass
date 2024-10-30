"use client";

import { EligibilityCriteria, SchemeData } from "@/types/scheme";
import CustomMarkdown from "@/ui/CustomMarkdown";
import LoadingSpinner from "@/ui/loading";
import { Text } from "@chakra-ui/react";
import { useAuth } from "@clerk/nextjs";
import { BxsCheckCircle } from "@opengovsg/design-system-react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

function SupportDetails() {
  const param = useSearchParams();
  const [scheme, setScheme] = useState<SchemeData>();
  const auth = useAuth();

  useEffect(() => {
    fetch("/data/schemes.json")
      .then((response) => response.json() as Promise<SchemeData[]>)
      .then((json) => {
        setScheme(json.find((scheme) => scheme.id === param.get("id")));
      });
  }, [param]);

  if (!scheme) {
    return <LoadingSpinner />;
  }

  const numCriteria = scheme.eligibility.length;
  const numFulfilledCriteria = auth.isSignedIn
    ? scheme.eligibility.filter((criteria) => criteria.satisfied).length
    : 0;

  return (
    <div className="flex h-full w-full flex-col gap-4 py-6">
      <section className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold">{scheme.name}</h3>
        <div className="flex place-content-start place-items-start gap-2 rounded-md border border-gray-200 bg-white p-4 text-left">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold">Overview</span>
            <span className="mb-4 text-sm">{scheme.description}</span>
            <span className="text-sm font-semibold">Benefits</span>
            <span className="text-sm">{scheme.benefits}</span>
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold">Eligibility</h3>
        <div className="flex flex-col place-content-start place-items-start gap-3 rounded-md border border-gray-200 bg-white p-4 text-left">
          {auth.isSignedIn ? (
            <Text fontSize="sm" fontWeight="semibold">
              {numFulfilledCriteria} of {numCriteria} eligibility criteria met
            </Text>
          ) : (
            <section className="w-full rounded border border-brand-primary-300 bg-brand-primary-100 px-4 py-2">
              <p className="text-sm text-brand-primary-900">
                Sign in to use eligibility checker
              </p>
            </section>
          )}
          <div className="flex flex-col gap-3">
            {scheme.eligibility.map((criteria, index) => (
              <CriteriaIndicator key={index} criteria={criteria} />
            ))}
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-2 pb-6">
        <h3 className="text-lg font-semibold">Next steps</h3>
        <div className="flex flex-col place-content-start place-items-start gap-2 rounded-md border border-gray-200 bg-white p-4 text-left">
          <div className="flex flex-col gap-3 text-sm">
            <CustomMarkdown content={scheme.nextSteps} />
          </div>
        </div>
      </section>
    </div>
  );
}

function CriteriaIndicator({ criteria }: { criteria: EligibilityCriteria }) {
  const auth = useAuth();
  if (!auth.isSignedIn) {
    criteria.satisfied = false;
  }

  return (
    <div className="flex place-items-start gap-2">
      <BxsCheckCircle
        color={criteria.satisfied ? "green" : "default"}
        fontSize="1.5rem"
        className="flex-none"
      />
      <span className="place-self-center text-sm">{criteria.description}</span>
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

"use client";

import { SchemeData } from "@/types/scheme";
import { BackButton } from "@/ui/button";
import CustomMarkdown from "@/ui/CustomMarkdown";
import LoadingSpinner from "@/ui/loading";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

function SupportDetails() {
  const param = useSearchParams();
  const [scheme, setScheme] = useState<SchemeData>();

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

  return (
    <div className="flex h-full w-full flex-col gap-4 py-6">
      <BackButton />
      <section className="flex flex-col gap-2">
        <h3 className="text-xl font-semibold">{scheme.name}</h3>
        <div className="flex place-content-start place-items-start gap-2 rounded-md border border-gray-200 bg-white p-4 text-left">
          <div className="flex flex-col gap-2">
            <span className="text-lg font-semibold">Overview</span>
            <CustomMarkdown content={scheme.description} />
            <span className="text-lg font-semibold">Benefits</span>
            <CustomMarkdown content={scheme.benefits} />
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold">Eligibility</h3>
        <div className="flex flex-col place-content-start place-items-start gap-3 rounded-md border border-gray-200 bg-white p-4 text-left">
          <CustomMarkdown content={scheme.eligibility} />
        </div>
      </section>
      <section className="flex flex-col gap-2 pb-6">
        <h3 className="text-lg font-semibold">Next steps</h3>
        <div className="flex flex-col place-content-start place-items-start gap-2 rounded-md border border-gray-200 bg-white p-4 text-left">
          <CustomMarkdown content={scheme.nextSteps} />
        </div>
      </section>
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

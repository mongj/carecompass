"use client";

import { useUserStore } from "@/stores/user";
import { SchemeData } from "@/types/scheme";
import { BackButton } from "@/ui/button";
import CustomMarkdown from "@/ui/CustomMarkdown";
import LoadingSpinner from "@/ui/loading";
import { checkAllSchemesEligibility } from "@/util/eligibilityChecker";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

function SupportDetails() {
  const param = useSearchParams();
  const [scheme, setScheme] = useState<SchemeData>();
  const user = useUserStore((state) => state.user);

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

  const eligibilityResults = checkAllSchemesEligibility(user);
  const schemeHere = eligibilityResults.find(
    (result) => result.schemeId === scheme.id,
  );

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
          {/* <CustomMarkdown content={scheme.eligibility} /> */}
          <div className="w-full">
            {schemeHere?.eligibleReasons.map((message, index) => (
              <div key={index} className="flex items-start gap-3 py-1">
                <svg
                  className="mt-0.5 h-6 w-6 flex-shrink-0"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 0.5C5.20156 0.5 0.5 5.20156 0.5 11C0.5 16.7984 5.20156 21.5 11 21.5C16.7984 21.5 21.5 16.7984 21.5 11C21.5 5.20156 16.7984 0.5 11 0.5ZM15.5352 7.57109L10.5992 14.4148C10.5302 14.5111 10.4393 14.5896 10.3339 14.6437C10.2286 14.6978 10.1118 14.7261 9.99336 14.7261C9.87491 14.7261 9.75816 14.6978 9.6528 14.6437C9.54743 14.5896 9.45649 14.5111 9.3875 14.4148L6.46484 10.3648C6.37578 10.2406 6.46484 10.0672 6.61719 10.0672H7.71641C7.95547 10.0672 8.18281 10.182 8.32344 10.3789L9.99219 12.6945L13.6766 7.58516C13.8172 7.39062 14.0422 7.27344 14.2836 7.27344H15.3828C15.5352 7.27344 15.6242 7.44688 15.5352 7.57109V7.57109Z"
                    fill="#2ec91c"
                  />
                </svg>
                <span className="text-md">{message}</span>
              </div>
            ))}
            {schemeHere?.ineligibleReasons &&
              schemeHere.ineligibleReasons.map((message, index) => (
                <div key={index} className="flex items-start gap-3 py-1">
                  <svg
                    className="mt-0.5 h-6 w-6 flex-shrink-0"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11 0.5C5.20156 0.5 0.5 5.20156 0.5 11C0.5 16.7984 5.20156 21.5 11 21.5C16.7984 21.5 21.5 16.7984 21.5 11C21.5 5.20156 16.7984 0.5 11 0.5ZM15.2148 8.70312L13.1679 11L15.2148 13.2969C15.3562 13.4383 15.3562 13.65 15.2148 13.7914L13.7914 15.2148C13.65 15.3562 13.4383 15.3562 13.2969 15.2148L11 13.1679L8.70312 15.2148C8.56172 15.3562 8.35 15.3562 8.20859 15.2148L6.78516 13.7914C6.64375 13.65 6.64375 13.4383 6.78516 13.2969L8.83203 11L6.78516 8.70312C6.64375 8.56172 6.64375 8.35 6.78516 8.20859L8.20859 6.78516C8.35 6.64375 8.56172 6.64375 8.70312 6.78516L11 8.83203L13.2969 6.78516C13.4383 6.64375 13.65 6.64375 13.7914 6.78516L15.2148 8.20859C15.3562 8.35 15.3562 8.56172 15.2148 8.70312Z"
                      fill="#ed0524"
                    />
                  </svg>
                  <span className="text-md">{message}</span>
                </div>
              ))}
            {schemeHere?.additionalVerificationDetails &&
              schemeHere.additionalVerificationDetails.map((message, index) => (
                <div key={index} className="flex items-start gap-3 py-1">
                  <svg
                    className="mt-0.5 h-6 w-6 flex-shrink-0"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11 0.5C5.20156 0.5 0.5 5.20156 0.5 11C0.5 16.7984 5.20156 21.5 11 21.5C16.7984 21.5 21.5 16.7984 21.5 11C21.5 5.20156 16.7984 0.5 11 0.5ZM15.5352 7.57109L10.5992 14.4148C10.5302 14.5111 10.4393 14.5896 10.3339 14.6437C10.2286 14.6978 10.1118 14.7261 9.99336 14.7261C9.87491 14.7261 9.75816 14.6978 9.6528 14.6437C9.54743 14.5896 9.45649 14.5111 9.3875 14.4148L6.46484 10.3648C6.37578 10.2406 6.46484 10.0672 6.61719 10.0672H7.71641C7.95547 10.0672 8.18281 10.182 8.32344 10.3789L9.99219 12.6945L13.6766 7.58516C13.8172 7.39062 14.0422 7.27344 14.2836 7.27344H15.3828C15.5352 7.27344 15.6242 7.44688 15.5352 7.57109V7.57109Z"
                      fill="#d9dbda"
                    />
                  </svg>
                  <span className="text-md">{message}</span>
                </div>
              ))}
            {schemeHere?.otherDetails &&
              schemeHere.eligibleReasons.length > 0 &&
              schemeHere.otherDetails.map((message, index) => (
                <div key={index} className="flex items-start gap-3 py-1">
                  <span className="text-md">{message}</span>
                </div>
              ))}
          </div>
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

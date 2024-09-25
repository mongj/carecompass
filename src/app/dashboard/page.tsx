"use client";

import { SchemeData } from "@/types/scheme";
import { Text } from "@chakra-ui/react";
import { BxsCheckCircle } from "@opengovsg/design-system-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";


export default function SupportDashboard() {
  const [data, setData] = useState<SchemeData[]>([]);

  useEffect(() => {
    fetch('/data/schemes.json')
      .then((response) => response.json())
      .then((json) => setData(json));
  }, []);

  return (
    <div className="flex flex-col h-full w-full gap-4 py-6">
      <section className="flex flex-col gap-2">
        <h3 className="font-semibold text-lg">My Active Support</h3>
        <div className="flex p-4 bg-white border border-gray-200 rounded-md min-h-32 text-center place-content-center place-items-center">
          <span className="text-sm text-gray-500 whitespace-pre-line">{`None for now\nExplore support options below`}</span>
        </div>
      </section>
      <section className="flex flex-col gap-2 pb-6">
        <h3 className="font-semibold text-lg">Explore Support</h3>
        {data.map((scheme, index) => <SchemeButton key={index} scheme={scheme} />)}
      </section>
    </div>
  );
}

function SchemeButton({ scheme }: { scheme: SchemeData }) {
  const router = useRouter();

  const numCriteria = scheme.eligibility.length
  const numFulfilledCriteria = scheme.eligibility.filter((criteria) => criteria.satisfied).length

  function handleClick() {
    router.push(`/dashboard/schemes?id=${scheme.id}`);
  }
  
  return (
    <button className="flex p-4 bg-white border border-gray-200 rounded-md gap-2 place-items-start place-content-start text-left" onClick={handleClick}>
      <div className="flex flex-col gap-2">
        <span className="font-semibold text-sm">{scheme.name}</span>
        <span className="text-sm">{scheme.description}</span>
        <div className="flex place-items-center gap-2">
          <BxsCheckCircle color="green" fontSize="1.5rem" />
          <Text color="green" fontSize="sm" fontWeight="semibold">{numFulfilledCriteria} of {numCriteria} eligibility criteria met</Text>
        </div>
      </div>
    </button>
  )
}
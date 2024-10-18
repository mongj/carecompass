"use client";

import { SchemeData } from "@/types/scheme";
import { Button } from "@chakra-ui/react";
import { BxRightArrowAlt } from "@opengovsg/design-system-react";
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
  
  function handleClick() {
    router.push(`/dashboard/schemes?id=${scheme.id}`);
  }
  
  return (
    <div className="flex p-4 bg-white border border-gray-200 rounded-md gap-2 place-items-start place-content-start text-left">
      <div className="flex flex-col gap-2">
        <span className="font-semibold text-sm">{scheme.name}</span>
        <span className="text-sm">{scheme.description}</span>
        <Button variant="clear" size="sm" rightIcon={<BxRightArrowAlt />} marginLeft="auto" onClick={handleClick}>{scheme.numSteps} more steps to apply</Button>
      </div>
    </div>
  )
}
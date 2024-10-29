"use client";

import { ProgrammeData } from "@/types/programme";
import { EligibilityCriteria } from "@/types/scheme";
import CustomMarkdown from "@/ui/CustomMarkdown";
import LoadingSpinner from "@/ui/loading";
import { Text } from "@chakra-ui/react";
import { BxsCheckCircle } from "@opengovsg/design-system-react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Markdown, { defaultUrlTransform } from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function ProgrammeDetails({ params }: { params: { programmeId: string }}) {
  const param = useSearchParams();
  const [programmeData, setProgrammeData] = useState<ProgrammeData>();

  useEffect(() => {
    fetch('/data/programmes.json')
      .then((response) => response.json() as Promise<ProgrammeData[]>)
      .then((json) => {
        setProgrammeData(json.find((programme) => programme.id === params.programmeId));
      });
  }, [param]);

  if (!programmeData) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col h-full w-full gap-4 py-6">
      <section className="flex flex-col gap-2">
        <h3 className="font-semibold text-lg">{programmeData.name}</h3>
        <div className="flex p-4 bg-white border border-gray-200 rounded-md gap-2 place-items-start place-content-start text-left">
          <div className="flex flex-col gap-2">
            <span className="font-semibold">Overview</span>
            <span className="text-sm mb-4">{programmeData.description}</span>
            {programmeData.content && <CustomMarkdown content={programmeData.content} />}
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-2 pb-6">
        <h3 className="font-semibold text-lg">Next steps</h3>
        <div className="flex flex-col p-4 bg-white border border-gray-200 rounded-md gap-2 place-items-start place-content-start text-left">
          <div className="flex flex-col text-sm gap-3">
            {programmeData.actionable && <CustomMarkdown content={programmeData.actionable} />}
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

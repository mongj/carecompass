"use client";

import { ProgrammeData } from "@/types/programme";
import CustomMarkdown from "@/ui/CustomMarkdown";
import LoadingSpinner from "@/ui/loading";
import { useState, useEffect } from "react";

export default function ProgrammeDetails({ params }: { params: { programmeId: string }}) {
  const [programmeData, setProgrammeData] = useState<ProgrammeData>();

  useEffect(() => {
    fetch('/data/programmes.json')
      .then((response) => response.json() as Promise<ProgrammeData[]>)
      .then((json) => {
        setProgrammeData(json.find((programme) => programme.id === params.programmeId));
      });
  }, [params.programmeId]);

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

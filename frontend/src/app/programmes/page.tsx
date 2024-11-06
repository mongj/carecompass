"use client";

import { ProgrammeData, EventData } from "@/types/programme";
import ExternalLink from "@/ui/ExternalLink";
import { Button } from "@chakra-ui/react";
import { BxRightArrowAlt } from "@opengovsg/design-system-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Programmes() {
  const [programmeData, setProgrammeData] = useState<ProgrammeData[]>([]);
  const [eventData, setEventData] = useState<EventData[]>([]);

  useEffect(() => {
    fetch("/data/programmes.json")
      .then((response) => response.json())
      .then((json) => setProgrammeData(json));
  }, []);

  useEffect(() => {
    fetch("/data/events.json")
      .then((response) => response.json())
      .then((json) => setEventData(json));
  }, []);

  return (
    <div className="flex h-full w-full flex-col gap-4 py-6">
      <section className="flex flex-col gap-2 pb-6">
        <h3 className="text-lg font-semibold">Educational Programmes</h3>
        {programmeData.map((programme, index) => (
          <ProgrammeCard key={index} programme={programme} />
        ))}
      </section>
      <section className="flex flex-col gap-2 pb-6">
        <h3 className="text-lg font-semibold">Educational Events</h3>
        {eventData.map((event, index) => (
          <ProgrammeCard key={index} programme={event} />
        ))}
      </section>
    </div>
  );
}

function ProgrammeCard({ programme }: { programme: ProgrammeData }) {
  const router = useRouter();

  function handleClick() {
    router.push(`/programmes/${programme.id}`);
  }

  return (
    <div className="flex place-content-start place-items-start gap-2 rounded-md border border-gray-200 bg-white p-4 text-left">
      <div className="flex flex-col gap-2">
        <span className="text-lg font-semibold">{programme.name}</span>
        <span>{programme.description}</span>
        {programme.link ? (
          <ExternalLink link={programme.link} text="Learn more" />
        ) : (
          <Button
            onClick={handleClick}
            rightIcon={<BxRightArrowAlt />}
            colorScheme="blue"
            variant="link"
          >
            Learn more
          </Button>
        )}
      </div>
    </div>
  );
}

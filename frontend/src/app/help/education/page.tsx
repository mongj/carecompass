"use client";

import { ProgrammeData, EventData } from "@/types/programme";
import { BackButton } from "@/ui/button";
import { Button } from "@chakra-ui/react";
import { BxRightArrowAlt } from "@opengovsg/design-system-react";
import ExternalLink from "@/ui/ExternalLink";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/ui/loading";

export default function Page() {
  const [programmeData, setProgrammeData] = useState<ProgrammeData[]>([]);
  const [eventData, setEventData] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      fetch("/data/programmes.json").then((response) => response.json()),
      fetch("/data/events.json").then((response) => response.json()),
    ]).then(([programmeJson, eventJson]) => {
      setProgrammeData(programmeJson);
      setEventData(eventJson);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <BackButton />
      <h3 className="text-lg font-semibold leading-tight text-gray-500">
        I see that you’re looking for support to better care for your loved one
        and yourself.
      </h3>
      <h1 className="mb-4 text-2xl font-semibold leading-tight text-brand-primary-500">
        Here are some programmes that may help
      </h1>
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
    router.push(`/help/education/${programme.id}`);
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

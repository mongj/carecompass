"use client";

import { api } from "@/api";
import { DDCBase } from "@/types/ddc";
import { BackButton } from "@/ui/button";
import LoadingSpinner from "@/ui/loading";
import { constructAddress } from "@/util/address";
import { Button } from "@chakra-ui/react";
import { BxRightArrowAlt, Input } from "@opengovsg/design-system-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DementiaDaycarePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [centres, setCentres] = useState<DDCBase[]>([]);

  useEffect(() => {
    setIsLoading(true);
    api
      .get("/services/dementia-daycare")
      .then((response) => {
        setCentres(response.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const filteredCentres = centres.filter((centre) => {
    return (
      centre.name.toLowerCase().includes(query.toLowerCase()) ||
      centre.block?.toLowerCase().includes(query.toLowerCase()) ||
      centre.streetName?.toLowerCase().includes(query.toLowerCase()) ||
      centre.buildingName?.toLowerCase().includes(query.toLowerCase()) ||
      centre.postalCode.toLowerCase().includes(query.toLowerCase())
    );
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col gap-4 bg-white p-6">
      <BackButton />
      <h1 className="text-xl font-semibold">Dementia Day Care Centres</h1>
      <Input
        placeholder="Search for a centre"
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="flex flex-col divide-y divide-solid">
        {filteredCentres.map((centre) => (
          <CentreCard key={centre.id} centre={centre} />
        ))}
      </div>
    </div>
  );
}

function CentreCard({ centre }: { centre: DDCBase }) {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/careservice/dementia-daycare/${centre.id}`);
  };

  const address = constructAddress(
    centre.postalCode,
    centre.block,
    centre.streetName,
    centre.buildingName,
    centre.unitNo,
  );

  return (
    <div className="flex flex-col gap-4 py-4">
      <span className="text-lg font-semibold">{centre.name}</span>
      <div className="flex flex-col gap-2">
        <span>{address}</span>
        <Button
          variant="clear"
          rightIcon={<BxRightArrowAlt fontSize="1.5rem" />}
          marginLeft="auto"
          onClick={handleViewDetails}
        >
          More Info
        </Button>
      </div>
    </div>
  );
}

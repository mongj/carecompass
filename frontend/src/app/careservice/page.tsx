"use client";

import { DDCRecommendation } from "@/types/ddc";
import {
  Badge,
  Button,
  BxRightArrowAlt,
  Input,
  Textarea,
} from "@opengovsg/design-system-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  ReadonlyURLSearchParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import LoadingSpinner from "@/ui/loading";
import { api } from "@/api";
import { Rating } from "@smastrom/react-rating";
import HomeCareServices from "./homecareService";
import { BackButton, BookmarkButton } from "@/ui/button";
import { Divider } from "@chakra-ui/react";
import { ReviewTargetType } from "@/types/review";
import { constructAddress } from "@/util/address";
import { formatPriceRange } from "@/util/priceInfo";

type CareServicesData = {
  title: string;
  description: string;
  eligibleForSubsidies: boolean;
  icon: string;
  enabled?: boolean;
};

type Stepper = {
  increment: () => void;
  decrement: () => void;
};

type Params = {
  value: ReadonlyURLSearchParams;
  append: (name: string, value: string) => URLSearchParams;
  remove: (name: string) => URLSearchParams;
};

const careServices: CareServicesData[] = [
  {
    title: "Daycare Services",
    description:
      "Full day programmes offered by centres for seniors with dementia. This could be useful if your loved one requires supervision during the day.",
    eligibleForSubsidies: true,
    icon: "/icon/daycare.svg",
    enabled: true,
  },
  {
    title: "Home Care Services",
    description:
      "Assistance with day-to-day care tasks and medical services at your home.",
    icon: "/icon/homecare.svg",
    enabled: true,
    eligibleForSubsidies: true,
  },
  {
    title: "Hire a Foreign Domestic Worker",
    description:
      "Pre-trained in eldercare, they will have basic skills to care for your loved one.",
    icon: "/icon/careworker.svg",
    eligibleForSubsidies: false,
  },
  {
    title: "Engage a Nursing Home",
    description:
      "Residential care facility that would assist with your loved one's activities of daily living and nursing care needs.",
    icon: "/icon/nursinghome.svg",
    eligibleForSubsidies: false,
  },
];

export default function CareServiceRecommender() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedService = searchParams.get("service");

  const handleServiceSelection = (service: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("service", service);
    router.push("?" + params.toString());
  };

  if (selectedService === "Home Care Services") {
    return <HomeCareServices />;
  }

  const sections = [
    CareServiceOverview,
    DaycareLocationPreference,
    DaycareOtherPreferences,
    DaycareRecommendations,
  ];

  const step = searchParams.get("step")
    ? parseInt(searchParams.get("step") as string)
    : 0;

  const appendQueryParam = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    return params;
  };

  const removeQueryParam = (name: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(name);
    return params;
  };

  const param: Params = {
    value: searchParams,
    append: appendQueryParam,
    remove: removeQueryParam,
  };

  const incrementIndex = () => {
    const p = new URLSearchParams(param.value.toString());
    const currentStep = parseInt(p.get("step") || "0");

    let nextStep = 0;
    if (currentStep === 0) {
      nextStep = 1;
    } else if (currentStep === 1 && p.has("prefLoc")) {
      nextStep = 2;
    } else if (
      (currentStep === 1 || currentStep === 2) &&
      p.has("prefPickupDropoff")
    ) {
      nextStep = 3;
    } else if (currentStep === 3 && (p.has("pickup") || p.has("dropoff"))) {
      nextStep = 4;
    } else if (
      (currentStep === 1 || currentStep === 2 || currentStep === 4) &&
      p.has("prefPrice")
    ) {
      nextStep = 5;
    } else {
      nextStep = 6;
    }

    if (nextStep < sections.length) {
      p.set("step", String(nextStep));
      router.push("?" + p.toString());
    }
  };

  const decrementIndex = () => {
    router.back();
  };

  const stepper: Stepper = {
    increment: incrementIndex,
    decrement: decrementIndex,
  };

  function CareServiceOverview({ stepper }: DrawerSectionProps) {
    return (
      <section className="flex flex-col">
        <BackButton />
        <span className="py-4 text-2xl font-semibold leading-tight text-brand-primary-500">
          Let me know which caregiving option you&apos;d like to get started
          with
        </span>
        <div className="mt-4 flex flex-col gap-2">
          {careServices.map((service, index) => (
            <CareServiceButton
              key={index}
              service={service}
              incrementIndex={stepper.increment}
            />
          ))}
        </div>
      </section>
    );
  }

  function CareServiceButton({
    service,
    incrementIndex,
  }: {
    service: CareServicesData;
    incrementIndex: () => void;
  }) {
    const handleClick = () => {
      if (service.title === "Home Care Services") {
        handleServiceSelection("Home Care Services");
      } else {
        incrementIndex();
      }
    };

    return (
      <button
        className={`flex place-content-start place-items-start gap-2 rounded-md border border-gray-200 p-4 text-left ${!service.enabled && "bg-gray-100"} transition-all duration-150 hover:bg-gray-50`}
        onClick={handleClick}
        disabled={!service.enabled}
      >
        <Image src={service.icon} alt="ds" width={40} height={40} />
        <div className="flex flex-col gap-2">
          <span className="text-lg font-semibold">{service.title}</span>
          <span>{service.description}</span>
          {service.eligibleForSubsidies && (
            <Badge
              colorScheme={service.enabled ? "success" : "neutral"}
              variant="subtle"
            >
              $ May be eligible for subsidies
            </Badge>
          )}
          {!service.enabled && (
            <span className="text-sm italic">
              This recommender is not yet available
            </span>
          )}
        </div>
      </button>
    );
  }

  function DaycareLocationPreference() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [postalCode, setPostalCode] = useState(
      searchParams.get("home") || "",
    );

    const isValidPostalCode =
      postalCode.length === 6 && !isNaN(Number(postalCode));

    return (
      <section className="flex flex-col gap-4">
        <BackButton />
        <span className="text-lg font-semibold leading-tight text-gray-500">
          I see that you&apos;re looking out for daycare services for your loved
          one.
        </span>
        <span className="text-2xl font-semibold leading-tight text-brand-primary-500">
          Could you provide me your postal code to assist you better?
        </span>
        <Input
          placeholder="e.g. 510296"
          value={postalCode}
          onChange={(e) => {
            setPostalCode(e.target.value);
          }}
        />
        <div className="mt-4 flex w-full gap-2">
          <Button
            onClick={() => {
              const p = new URLSearchParams(searchParams.toString());
              p.set("step", "2");
              router.push("?" + p.toString());
            }}
            className="w-[calc(50%-4px)]"
            variant="outline"
          >
            Skip
          </Button>
          <Button
            className="w-[calc(50%-4px)]"
            isDisabled={!isValidPostalCode}
            onClick={() => {
              const p = new URLSearchParams(searchParams.toString());
              p.set("home", postalCode);
              // Temporary fix to set the step to 6 without triggering the increment function
              p.set("step", "2");
              router.replace("?" + p.toString());
            }}
          >
            Next
          </Button>
        </div>
      </section>
    );
  }

  function DaycareOtherPreferences() {
    const router = useRouter();
    const searchParams = useSearchParams();

    return (
      <section className="flex flex-col gap-4">
        <BackButton />
        <span className="text-lg font-semibold leading-tight text-gray-500">
          Got it.
        </span>
        <span className="text-2xl font-semibold leading-tight text-brand-primary-500">
          Are there any other information you&apos;d like us to be mindful of?
        </span>
        {/* This is just a placeholder for now */}
        <Textarea rows={5} />
        <Button
          className="w-full"
          onClick={() => {
            const p = new URLSearchParams(searchParams.toString());
            // Temporary fix to set the step to 6 without triggering the increment function
            p.set("step", "3");
            router.replace("?" + p.toString());
          }}
        >
          Next
        </Button>
      </section>
    );
  }

  function DaycareRecommendations({ param }: DrawerSectionProps) {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(true);
    const [recommendations, setRecommendations] = useState<DDCRecommendation[]>(
      [],
    );

    const homePostalCode = param.value.get("home");

    useEffect(() => {
      router.prefetch("/careservice/dementia-daycare/[centreId]");
    }, [router]);

    useEffect(() => {
      api
        .post("/services/dementia-daycare/recommendations", {
          // API handles the case where homePostalCode is null
          location: homePostalCode,
        })
        .then((response) => {
          setRecommendations(response.data);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, [homePostalCode]);

    const handleShowAll = () => {
      router.push("/careservice/dementia-daycare");
    };

    if (isLoading) {
      return <LoadingSpinner />;
    }

    return (
      <section className="flex flex-col gap-4">
        <BackButton />
        <span className="text-lg font-semibold leading-tight text-gray-500">
          Thank you.
        </span>
        <span className="text-2xl font-semibold leading-tight text-brand-primary-500">
          Based on your inputs, here are the recommended daycare centres
        </span>
        <div className="flex flex-col gap-4">
          {recommendations.map((centre, index) => (
            <DaycareRecommendationCard key={index} centre={centre} />
          ))}
        </div>
        <Button variant="outline" onClick={handleShowAll}>
          Show me the full list of centres
        </Button>
      </section>
    );
  }

  function DaycareRecommendationCard({
    centre,
  }: {
    centre: DDCRecommendation;
  }) {
    const router = useRouter();

    useEffect(() => {
      router.prefetch(`/careservice/dementia-daycare/${centre.id}`);
    }, [router, centre.id]);

    const parseDistance = (distance: number) => {
      return `${(distance / 1000).toFixed(1)}km`;
    };

    const parseDuration = (duration: number) => {
      const minutes = Math.floor(duration / 60);
      return `${minutes} min`;
    };

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
    const distance =
      centre.distanceFromHome || centre.distanceFromHome == 0
        ? `(${parseDistance(centre.distanceFromHome)} away from home)`
        : "";

    return (
      <div className="flex flex-col gap-4 rounded-md border border-gray-200 p-4">
        <span className="text-lg font-semibold">{centre.name}</span>
        {centre.reviewCount > 0 && (
          <div className="flex gap-2">
            <Rating
              readOnly
              value={centre.averageRating}
              className="max-w-24"
            />
            <span>(from {centre.reviewCount} reviews)</span>
          </div>
        )}
        {centre.maxPrice !== null && (
          <div className="flex flex-col gap-2">
            <span>
              <b>{formatPriceRange(centre.maxPrice, centre.minPrice)}/month</b>
            </span>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <span>
            {address} {distance}
          </span>
          {centre.distanceFromHome !== undefined &&
            centre.distanceFromHome > 0 && (
              <div className="flex flex-col rounded border border-brand-primary-400 bg-brand-primary-50 p-4">
                <span>
                  <b>{parseDuration(centre.drivingDuration!)}</b> by car, or{" "}
                  <b>{parseDuration(centre.transitDuration!)}</b> by bus/MRT
                </span>
              </div>
            )}
        </div>
        <Divider />
        <div className="flex">
          <BookmarkButton
            targetId={centre.id}
            targetType={ReviewTargetType.DEMENTIA_DAY_CARE}
            title={centre.name}
            link={`/careservice/dementia-daycare/${centre.id}`}
            variant="clear"
          />
          <Button
            variant="clear"
            rightIcon={<BxRightArrowAlt fontSize="1.5rem" />}
            marginLeft="auto"
            onClick={handleViewDetails}
          >
            View Details
          </Button>
        </div>
      </div>
    );
  }

  const SectionComponent = sections[step];

  return (
    <div className="h-full w-full overflow-auto bg-white p-8">
      <SectionComponent stepper={stepper} param={param} />
    </div>
  );
}

type DrawerSectionProps = { stepper: Stepper; param: Params };

"use client";

import { DDCRecommendation } from "@/types/ddc";
import {
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderMark,
  RangeSliderThumb,
  RangeSliderTrack,
  Stack,
} from "@chakra-ui/react";
import {
  Badge,
  Button,
  BxRightArrowAlt,
  Checkbox,
  FormLabel,
  Input,
} from "@opengovsg/design-system-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  ReadonlyURLSearchParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import LoadingSpinner from "@/ui/loading";
import { SignInButton, useAuth } from "@clerk/nextjs";
import { api } from "@/api";
import { Rating } from "@smastrom/react-rating";
import HomeCareServices from "./homecareService";

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

const DEFAULT_POSTAL_CODE = 319398;
const DEFAULT_MIN_PRICE = 10;
const DEFAULT_MAX_PRICE = 50;

const careServices: CareServicesData[] = [
  {
    title: "Daycare Services",
    description:
      "Full day programmes offered by centres for seniors with dementia. This could be useful if your father requires supervision during the day.",
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
    eligibleForSubsidies: false,
  },
  {
    title: "Hire a Foreign Domestic Worker",
    description:
      "Pre-trained in eldercare, they will have basic skills to care for your father.",
    icon: "/icon/careworker.svg",
    eligibleForSubsidies: false,
  },
  {
    title: "Engage a Nursing Home",
    description:
      "Residential care facility that would assist with your father’s activities of daily living and nursing care needs.",
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
    DaycarePreferenceOverview,
    DaycareLocationPreference,
    DaycarePickupDropoffPreference,
    DaycarePickupDropoffLocation,
    DaycarePricePreference,
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
        <span className="text-lg leading-tight">
          {`These are your caregiving options recommended based on your loved one's profile.`}
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
        className={`flex place-content-start place-items-start gap-2 rounded-md border border-gray-200 p-4 text-left ${!service.enabled && "bg-gray-100"}`}
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

  function DaycarePreferenceOverview({ stepper, param }: DrawerSectionProps) {
    const router = useRouter();

    function handleCheckLocation(e: React.ChangeEvent<HTMLInputElement>) {
      const p = new URLSearchParams(param.value.toString());
      e.target.checked ? p.set("prefLoc", "true") : p.delete("prefLoc");
      router.replace("?" + p.toString());
    }

    function handleCheckOthers(e: React.ChangeEvent<HTMLInputElement>) {
      const p = new URLSearchParams(param.value.toString());
      e.target.checked ? p.set("prefOthers", "") : p.delete("prefOthers");
      router.replace("?" + p.toString());
    }

    function handleInputOthers(e: React.ChangeEvent<HTMLInputElement>) {
      const p = new URLSearchParams(param.value.toString());
      e.target.value
        ? p.set("prefOthers", e.target.value)
        : p.delete("prefOthers");
      router.replace("?" + p.toString());
    }

    return (
      <section className="flex flex-col gap-4">
        <h1 className="text-xl font-semibold">Daycare Services</h1>
        <span className="leading-tight">
          What factors are important to you when choosing a daycare service?
        </span>
        <Stack direction="column" spacing={1}>
          <Checkbox
            onChange={handleCheckLocation}
            isChecked={param.value.has("prefLoc")}
          >
            Location
          </Checkbox>
          {/* temporarily removed because these 2 filters are not implemented yet */}
          {/* <Checkbox
          onChange={handleCheckPrice}
          isChecked={param.value.has("prefPrice")}
        >
          Price
        </Checkbox>
        <Checkbox
          onChange={handleCheckPickupDropoff}
          isChecked={param.value.has("prefPickupDropoff")}
        >
          Pick-up / drop-off service
        </Checkbox> */}
          <Checkbox.OthersWrapper>
            <Checkbox.OthersCheckbox
              onChange={handleCheckOthers}
              isChecked={param.value.has("prefOthers")}
            />
            <Checkbox.OthersInput
              onChange={handleInputOthers}
              value={param.value.get("prefOthers") || ""}
            />
          </Checkbox.OthersWrapper>
        </Stack>
        <div className="mt-4 flex w-full gap-2">
          <Button
            onClick={stepper.decrement}
            className="w-[calc(50%-4px)]"
            variant="outline"
          >
            Back
          </Button>
          <Button onClick={stepper.increment} className="w-[calc(50%-4px)]">
            Next
          </Button>
        </div>
      </section>
    );
  }

  function DaycareLocationPreference({ stepper, param }: DrawerSectionProps) {
    const router = useRouter();

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
      const p = new URLSearchParams(param.value.toString());
      p.set("home", e.target.value);
      router.replace("?" + p.toString());
    }

    function isPostalCodeValid() {
      const postalCode = param.value.get("home") || "";
      return postalCode.length === 6 && !isNaN(Number(postalCode));
    }

    return (
      <section className="flex flex-col gap-4">
        <h1 className="text-xl font-semibold">Daycare Services</h1>
        <span className="leading-tight">What is your home address?</span>
        <Input
          placeholder="e.g. 510296"
          defaultValue={param.value.get("home") || undefined}
          onChange={handleInputChange}
        />
        <div className="mt-4 flex w-full gap-2">
          <Button
            onClick={stepper.decrement}
            className="w-[calc(50%-4px)]"
            variant="outline"
          >
            Back
          </Button>
          <Button
            className="w-[calc(50%-4px)]"
            isDisabled={!param.value.has("home") || !isPostalCodeValid()}
            onClick={() => stepper.increment()}
          >
            Next
          </Button>
        </div>
      </section>
    );
  }

  function DaycarePickupDropoffPreference({
    stepper,
    param,
  }: DrawerSectionProps) {
    const router = useRouter();

    function handleCheckPickup(e: React.ChangeEvent<HTMLInputElement>) {
      const p = new URLSearchParams(param.value.toString());
      e.target.checked ? p.set("pickup", "true") : p.delete("pickup");
      router.replace("?" + p.toString());
    }

    function handleCheckDropoff(e: React.ChangeEvent<HTMLInputElement>) {
      const p = new URLSearchParams(param.value.toString());
      e.target.checked ? p.set("dropoff", "true") : p.delete("dropoff");
      router.replace("?" + p.toString());
    }

    return (
      <section className="flex flex-col gap-4">
        <h1 className="text-xl font-semibold">Daycare Services</h1>
        <span className="leading-tight">
          Would you require pick up and drop off services?
        </span>
        <Stack direction="column" spacing={1}>
          <Checkbox
            onChange={handleCheckPickup}
            isChecked={param.value.has("pickup")}
          >
            Pick-up
          </Checkbox>
          <Checkbox
            onChange={handleCheckDropoff}
            isChecked={param.value.has("dropoff")}
          >
            Drop-off
          </Checkbox>
        </Stack>
        <div className="mt-4 flex w-full gap-2">
          <Button
            onClick={stepper.decrement}
            className="w-[calc(50%-4px)]"
            variant="outline"
          >
            Back
          </Button>
          <Button onClick={stepper.increment} className="w-[calc(50%-4px)]">
            Next
          </Button>
        </div>
      </section>
    );
  }

  function DaycarePickupDropoffLocation({
    stepper,
    param,
  }: DrawerSectionProps) {
    const router = useRouter();

    function updateParam(key: string, value: string) {
      const p = new URLSearchParams(param.value.toString());
      p.set(key, value);
      router.replace("?" + p.toString());
    }

    const needPickup = param.value.has("pickup");
    const needDropoff = param.value.has("dropoff");

    if (needPickup && !param.value.has("pickupLoc")) {
      const p = new URLSearchParams(param.value.toString());
      p.set("pickupLoc", String(DEFAULT_POSTAL_CODE));
      router.replace("?" + p.toString());
    }

    if (needDropoff && !param.value.has("dropoffLoc")) {
      const p = new URLSearchParams(param.value.toString());
      p.set("dropoffLoc", String(DEFAULT_POSTAL_CODE));
      router.replace("?" + p.toString());
    }

    return (
      <section className="flex flex-col gap-4">
        <h1 className="text-xl font-semibold">Daycare Services</h1>
        <span className="leading-tight">
          To check if the daycare centre offers <b>Pick-up and drop-off</b> to
          your desired locations, please confirm the postal code(s) below:
        </span>
        {needPickup && (
          <div className="flex flex-col">
            <FormLabel isRequired>Postal code for pick-up</FormLabel>
            <Input
              placeholder="e.g. 510296"
              value={DEFAULT_POSTAL_CODE}
              onChange={(e) => updateParam("pickupLoc", e.target.value)}
            />
          </div>
        )}
        {needDropoff && (
          <div className="flex flex-col">
            <FormLabel isRequired>Postal code for drop-off</FormLabel>
            <Input
              placeholder="e.g. 510296"
              value={DEFAULT_POSTAL_CODE}
              onChange={(e) => updateParam("dropoffLoc", e.target.value)}
            />
          </div>
        )}
        <div className="mt-4 flex w-full gap-2">
          <Button
            onClick={stepper.decrement}
            className="w-[calc(50%-4px)]"
            variant="outline"
          >
            Back
          </Button>
          <Button onClick={stepper.increment} className="w-[calc(50%-4px)]">
            Next
          </Button>
        </div>
      </section>
    );
  }

  function DaycarePricePreference({ stepper, param }: DrawerSectionProps) {
    const router = useRouter();

    if (!param.value.has("minp")) {
      const p = new URLSearchParams(param.value.toString());
      p.set("minp", String(DEFAULT_MIN_PRICE));
      router.replace("?" + p.toString());
    }

    if (!param.value.has("maxp")) {
      const p = new URLSearchParams(param.value.toString());
      p.set("maxp", String(DEFAULT_MAX_PRICE));
      router.replace("?" + p.toString());
    }

    const minp = parseInt(
      param.value.get("minp") || DEFAULT_MIN_PRICE.toString(),
    );
    const maxp = parseInt(
      param.value.get("maxp") || DEFAULT_MAX_PRICE.toString(),
    );

    function handleDragEnd(value: number[]) {
      const p = new URLSearchParams(param.value.toString());
      p.set("minp", String(value[0]));
      p.set("maxp", String(value[1]));
      router.replace("?" + p.toString());
    }
    return (
      <section className="flex flex-col gap-4">
        <h1 className="text-xl font-semibold">Daycare Services</h1>
        <span className="leading-tight">
          What price are you willing to pay per day?
        </span>
        <span className="text-sm leading-tight text-gray-400">
          (You can change this later)
        </span>
        <RangeSlider
          defaultValue={[minp, maxp]}
          min={10}
          max={90}
          step={10}
          width="90%"
          marginBottom={8}
          marginX="auto"
          onChangeEnd={handleDragEnd}
        >
          <RangeSliderMark value={10} className="ml-[-16px] pt-4">
            $10
          </RangeSliderMark>
          <RangeSliderMark value={50} className="ml-[-16px] pt-4">
            $50
          </RangeSliderMark>
          <RangeSliderMark value={90} className="ml-[-16px] pt-4">
            $80
          </RangeSliderMark>
          <RangeSliderTrack>
            <RangeSliderFilledTrack />
          </RangeSliderTrack>
          <RangeSliderThumb boxSize={6} index={0} />
          <RangeSliderThumb boxSize={6} index={1} />
        </RangeSlider>
        <div className="mt-4 flex w-full gap-2">
          <Button
            onClick={stepper.decrement}
            className="w-[calc(50%-4px)]"
            variant="outline"
          >
            Back
          </Button>
          <Button onClick={stepper.increment} className="w-[calc(50%-4px)]">
            Next
          </Button>
        </div>
      </section>
    );
  }

  function DaycareRecommendations({ param }: DrawerSectionProps) {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(true);
    const [recommendations, setRecommendations] = useState<DDCRecommendation[]>(
      [],
    );
    const [searchSaved, setSearchSaved] = useState(false);
    const auth = useAuth();

    const homePostalCode = param.value.get("home");

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
        <h1 className="text-xl font-semibold">Daycare Services</h1>
        <span className="leading-tight">
          Thank you! Based on your inputs, I recommend the following:
        </span>
        <div className="flex flex-col gap-4">
          {recommendations.map((centre, index) => (
            <DaycareRecommendationCard key={index} centre={centre} />
          ))}
        </div>
        {auth.isSignedIn ? (
          <Button onClick={() => setSearchSaved(true)} isDisabled={searchSaved}>
            {searchSaved ? "Saved!" : "Save search"}
          </Button>
        ) : (
          <SignInButton>
            <Button variant="solid" colorScheme="blue">
              Sign in to save search result
            </Button>
          </SignInButton>
        )}
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

    const address = `${centre.block} ${centre.streetName} ${centre.buildingName} ${centre.postalCode}`;
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
        <Button
          variant="clear"
          rightIcon={<BxRightArrowAlt fontSize="1.5rem" />}
          marginLeft="auto"
          onClick={handleViewDetails}
        >
          More Info
        </Button>
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

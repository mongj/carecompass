/* eslint-disable @typescript-eslint/no-unused-vars */

// This component is very hacky and will be deprecated soon
"use client";

import { DDCData, DDCView } from "@/types/ddc";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
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
  BxChevronLeft,
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
import Slider from "react-slick";
import CustomMarkdown from "@/ui/CustomMarkdown";
import { SignInButton, useAuth } from "@clerk/nextjs";

function PhotoSlider({ photos }: { photos: string[] }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <>
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
      />
      <Slider {...settings} className="mb-6">
        {photos.map((photo, index) => (
          <Image
            key={index}
            src={photo}
            alt="ds"
            width={400}
            height={200}
            className="max-h-48 rounded-md"
          />
        ))}
      </Slider>
    </>
  );
}

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

const sections = [
  CareServiceOverview,
  DaycarePreferenceOverview,
  DaycareLocationPreference,
  DaycarePickupDropoffPreference,
  DaycarePickupDropoffLocation,
  DaycarePricePreference,
  DaycareRecommendations,
];

export default function CareServiceRecommender() {
  const [data, setData] = useState<DDCData[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();

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

  useEffect(() => {
    fetch("/data/ddc.json")
      .then((response) => response.json())
      .then((json) => setData(json));
  }, []);

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

  const SectionComponent = sections[step];

  return (
    <div className="h-full w-full overflow-auto bg-white p-8">
      {data.length > 0 ? (
        <SectionComponent stepper={stepper} data={data} param={param} />
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
}

type DrawerSectionProps = { stepper: Stepper; data: DDCData[]; param: Params };

function CareServiceOverview({ stepper, data, param }: DrawerSectionProps) {
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
  return (
    <button
      className={`flex place-content-start place-items-start gap-2 rounded-md border border-gray-200 p-4 text-left ${!service.enabled && "bg-gray-100"}`}
      onClick={incrementIndex}
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

function DaycarePreferenceOverview({
  stepper,
  data,
  param,
}: DrawerSectionProps) {
  const router = useRouter();

  function handleCheckLocation(e: React.ChangeEvent<HTMLInputElement>) {
    const p = new URLSearchParams(param.value.toString());
    e.target.checked ? p.set("prefLoc", "true") : p.delete("prefLoc");
    router.replace("?" + p.toString());
  }

  function handleCheckPrice(e: React.ChangeEvent<HTMLInputElement>) {
    const p = new URLSearchParams(param.value.toString());
    e.target.checked ? p.set("prefPrice", "true") : p.delete("prefPrice");
    router.replace("?" + p.toString());
  }

  function handleCheckPickupDropoff(e: React.ChangeEvent<HTMLInputElement>) {
    const p = new URLSearchParams(param.value.toString());
    e.target.checked
      ? p.set("prefPickupDropoff", "true")
      : p.delete("prefPickupDropoff");
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

function DaycareLocationPreference({
  stepper,
  data,
  param,
}: DrawerSectionProps) {
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
  data,
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
  data,
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

function DaycarePricePreference({ stepper, data, param }: DrawerSectionProps) {
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

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  function toRad(value: number) {
    return (value * Math.PI) / 180;
  }

  const R = 6371; // Radius of the Earth in kilometers
  const c = Math.acos(
    Math.sin(toRad(lat1)) * Math.sin(toRad(lat2)) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.cos(toRad(lon2) - toRad(lon1)),
  );

  return parseFloat((R * c).toFixed(1)); // Distance in kilometers
}

function DaycareRecommendations({ stepper, data, param }: DrawerSectionProps) {
  const router = useRouter();
  const [homeLat, setHomeLat] = useState(0);
  const [homeLng, setHomeLng] = useState(0);
  const [searchSaved, setSearchSaved] = useState(false);
  const auth = useAuth();

  const homePostalCode = param.value.get("home");

  useEffect(() => {
    if (homePostalCode) {
      fetch(
        `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${homePostalCode}&returnGeom=Y&getAddrDetails=Y&pageNum=1`,
      )
        .then((res) => res.json())
        .then((addr) => {
          setHomeLat(parseFloat(addr.results[0].LATITUDE));
          setHomeLng(parseFloat(addr.results[0].LONGITUDE));
        });
    }
  }, [homePostalCode]);

  const views: DDCView[] = data.map((c) => {
    return {
      ...c,
      distanceFromHome: haversineDistance(homeLat, homeLng, c.lat, c.lng),
      price:
        param.value.has("pickup") && param.value.has("dropoff")
          ? c.priceWithTwoWayTransport
          : param.value.has("dropoff") || param.value.has("pickup")
            ? c.priceWithOneWayTransport
            : c.priceNoTransport,
    };
  });

  // filter out centres that do not have pickup/dropoff services (if required) and price range
  const filteredViews = views
    .filter((v) => {
      if (
        param.value.has("pickup") &&
        !v.dropoffPickupAvailability.includes("Pickup")
      ) {
        return false;
      }
      if (
        param.value.has("dropoff") &&
        !v.dropoffPickupAvailability.includes("Dropoff")
      ) {
        return false;
      }
      return true;
    })
    .filter((v) => {
      const minp = parseInt(param.value.get("minp") || "0");
      const maxp = parseInt(param.value.get("maxp") || "1000000");
      return v.price >= minp && v.price <= maxp;
    });

  const sortedViews = filteredViews.sort((a, b) => {
    // we sort by distance if that's available, else sort by name
    if (homePostalCode) {
      return a.distanceFromHome - b.distanceFromHome;
    } else {
      return a.display_name.localeCompare(b.display_name);
    }
  });

  const recommendations = sortedViews.slice(0, 3);

  const centreId = param.value.get("centre");
  const display = param.value.get("show");
  const selectedCentres = views.filter((c) => c.friendlyId === centreId);

  function handleShowAll() {
    const p = param.append("show", "all");
    router.push("?" + p.toString());
  }

  function handleShowRecommendations() {
    const p = param.append("show", "recommendations");
    router.push("?" + p.toString());
  }

  return selectedCentres.length > 0 ? (
    <DaycareCentreDetails {...selectedCentres[0]} />
  ) : display === "all" ? (
    <section className="flex flex-col gap-4">
      <Button
        variant="link"
        leftIcon={<BxChevronLeft fontSize="1.5rem" />}
        marginRight="auto"
        onClick={() => router.back()}
      >
        Back
      </Button>
      <span className="leading-tight">
        List of all dementia daycare centres:
      </span>
      <div className="flex flex-col gap-4">
        {sortedViews.map((centre, index) => (
          <DaycareRecommendationCard
            key={index}
            centre={centre}
            param={param}
          />
        ))}
      </div>
    </section>
  ) : (
    <section className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Daycare Services</h1>
      <span className="leading-tight">
        Thank you! Based on your inputs, I recommend the following:
      </span>
      <div className="flex flex-col gap-4">
        {recommendations.map((centre, index) => (
          <DaycareRecommendationCard
            key={index}
            centre={centre}
            param={param}
          />
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
  param,
}: {
  centre: DDCView;
  param: Params;
}) {
  const router = useRouter();
  const homePostalCode = param.value.get("home");

  const avgReview =
    centre.reviews.reduce((acc, cur) => acc + cur.rating, 0) /
    centre.reviews.length;

  function handleClick() {
    const p = new URLSearchParams(param.value.toString());
    p.set("centre", centre.friendlyId);
    router.push(`?${p.toString()}`);
  }

  return (
    <div className="flex flex-col gap-4 rounded-md border border-gray-200 p-4">
      <span className="text-lg font-semibold">{centre.name}</span>
      <div className="flex flex-col gap-2">
        {/* <span><b>Price per day: </b>${centre.price}</span> */}
        {homePostalCode && (
          <span>
            <b>Location: </b>
            {centre.distanceFromHome}km from home
          </span>
        )}
        {/* <span className="flex gap-1 place-items-center">
          <b>Pickup/Dropoff: </b>
          <div className="flex gap-2">
            {centre.dropoffPickupAvailability.map((e, i) => <Badge key={i} colorScheme="success" variant="subtle">{e}</Badge>)}
          </div>
        </span> */}
        {!isNaN(avgReview) && (
          <span>
            <b>Google Reviews:</b> {avgReview} ⭐
          </span>
        )}
      </div>
      <Button
        variant="clear"
        rightIcon={<BxRightArrowAlt fontSize="1.5rem" />}
        marginLeft="auto"
        onClick={handleClick}
      >
        More Info
      </Button>
    </div>
  );
}

function DaycareCentreDetails(data: DDCView) {
  const router = useRouter();
  const avgReview =
    data.reviews.reduce((acc, cur) => acc + cur.rating, 0) /
    data.reviews.length;

  // TODO: move all constant strings to a separate data file
  const applicationDetails =
    "- You will need to get a referral from a hospital, polyclinic or GP who is familiar with your loved ones’ condition and needs. You may also contact the service provider for a discussion. \n\n - For further assistance, contact the Agency for Integrated Care (AIC) at [1800 650 6060](tel:18006506060), email [enquiries@aic.sg](mailto:enquiries@aic.sg) or walk in to a nearby [AIC Link](https://www.aic.sg/about-us/aic-link-locations/).";

  return (
    <section className="flex flex-col gap-4">
      <PhotoSlider photos={data.photos} />
      <h1 className="text-xl font-semibold">{data.name}</h1>
      <Accordion allowToggle>
        <AccordionItem>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              How to apply?
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <CustomMarkdown content={applicationDetails} />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <span>
            <b>Operating hours: </b>
          </span>
          <span>{data.operatingHours.join(", \n")}</span>
        </div>
        {/* <div className="flex flex-col">
          <span><b>Price per day: </b><Popover>
            <PopoverTrigger>
              <a className="underline">(how is this calculated?)</a>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Price estimation</PopoverHeader>
              <PopoverBody>
                <span className="whitespace-pre-line">
                  {`We calculated your Monthly Household Income per Capita to be S$2,600 using information from Singpass.\n
                  Based on this, you may be eligible for a 50% subsidy under MOH’s Subsidy for Non-Residential Long-Term Care Services.\n
                  To accurately determine the price you will pay, please complete the Household Means Testing via the HOMES Portal.`}
                </span>
              </PopoverBody>
            </PopoverContent>
          </Popover></span>
          <span>${data.price.toFixed(2)}</span>
        </div> */}
        {/* <span className="flex gap-1 place-items-center">
          <b>Pickup/Dropoff: </b>
          <div className="flex gap-2">
            {data.dropoffPickupAvailability.map((e, i) => <Badge key={i} colorScheme="success" variant="subtle">{e}</Badge>)}
          </div>
        </span> */}
        {!isNaN(avgReview) && (
          <span>
            <b>Google Reviews:</b> {avgReview} ⭐
          </span>
        )}
        <div className="my-2 flex flex-col gap-2">
          <span className="text-lg">
            <b>Contact Details</b>
          </span>
          <div className="flex flex-col gap-2">
            {data.phone && (
              <span>
                <b>Phone: </b>
                <a
                  href={`tel:+65${data.phone}`}
                  target="_blank"
                  className="text-blue-500 underline"
                >
                  {data.phone}
                </a>
              </span>
            )}
            {data.email && (
              <span>
                <b>Email: </b>
                <a
                  href={`mailto:${data.email}`}
                  target="_blank"
                  className="text-blue-500 underline"
                >
                  {data.email}
                </a>
              </span>
            )}
            {data.website && (
              <span>
                <b>Website: </b>
                <a
                  href={data.website}
                  target="_blank"
                  className="text-blue-500 underline"
                >
                  {data.website}
                </a>
              </span>
            )}
          </div>
        </div>
        <div className="my-2 flex flex-col gap-2">
          <span className="text-lg">
            <b>Address</b>
          </span>
          <div className="flex flex-col">
            {data.buildingName && <span>{data.buildingName}</span>}
            <span>
              {data.block} {data.streetName} {data.unitNo}, {data.postalCode}
            </span>
          </div>
        </div>
      </div>
      <div id="embed-map-canvas" className="w-full">
        <iframe
          // api key from https://www.embed-map.com/
          src={`https://www.google.com/maps/embed/v1/place?q=${data.name.replace(" ", "+")}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`}
          allowFullScreen
          className="h-96 w-full rounded-md border border-gray-200 shadow"
        />
      </div>
      <ReviewSection reviews={data.reviews} />
    </section>
  );
}

function ReviewSection({ reviews }: { reviews: DDCView["reviews"] }) {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Reviews</h1>
      <div className="flex flex-col gap-4">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 rounded-md border border-gray-200 p-4"
          >
            <span className="font-semibold">{review.author}</span>
            <div className="flex gap-2">
              <span>
                {review.rating} {"⭐".repeat(Math.round(review.rating))}
              </span>
              <span>{review.relative_time}</span>
            </div>
            <span>{review.review_text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

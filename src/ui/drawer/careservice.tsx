/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { DDCData } from "@/types/ddc";
import { Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, RangeSlider, RangeSliderFilledTrack, RangeSliderMark, RangeSliderThumb, RangeSliderTrack, Stack } from "@chakra-ui/react";
import { Badge, Button, BxChevronLeft, BxRightArrowAlt, Checkbox, FormLabel, Input } from "@opengovsg/design-system-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ReadonlyURLSearchParams, useRouter, useSearchParams } from 'next/navigation'
import LoadingSpinner from "../loading";

type CareServicesData = {
  title: string;
  description: string;
  eligibleForSubsidies: boolean;
  icon: string;
  enabled?: boolean;
}

type Stepper = {
  increment: () => void;
  decrement: () => void;
}

type Params = {
  value: ReadonlyURLSearchParams;
  append: (name: string, value: string) => URLSearchParams;
  remove: (name: string) => URLSearchParams;
}

const careServices: CareServicesData[] = [
  {
    title: "Daycare Services",
    description: "Full day programmes offered by centres for seniors with dementia. This could be useful if your father requires supervision during the day.",
    eligibleForSubsidies: true,
    icon: "/icon/daycare.svg",
    enabled: true
  },
  {
    title: "Home Care Services",
    description: "Assistance with day-to-day care tasks and medical services at your home.",
    icon: "/icon/homecare.svg",
    eligibleForSubsidies: false
  },
  {
    title: "Hire a Foreign Domestic Worker",
    description: "Pre-trained in eldercare, they will have basic skills to care for your father.",
    icon: "/icon/careworker.svg",
    eligibleForSubsidies: false
  },
  {
    title: "Engage a Nursing Home",
    description: "Residential care facility that would assist with your father’s activities of daily living and nursing care needs.",
    icon: "/icon/nursinghome.svg",
    eligibleForSubsidies: false
  }
]

const sections = [
  CareServiceOverview,
  DaycarePreferenceOverview,
  DaycareLocationPreference,
  DaycarePickupDropoffPreference,
  DaycarePickupDropoffLocation,
  DaycarePricePreference,
  DaycareRecommendations
]

export default function CareServiceRecommender() {
  const [data, setData] = useState<DDCData[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(searchParams.get('step') ? parseInt(searchParams.get('step') as string) : 0);

  const appendQueryParam = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(name, value)
    return params
  }

  const removeQueryParam = (name: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete(name)
    return params
  }

  const param: Params = {
    value: searchParams,
    append: appendQueryParam,
    remove: removeQueryParam
  }

  useEffect(() => {
    fetch('/data/ddc.json')
      .then((response) => response.json())
      .then((json) => setData(json));
  }, []);

  const incrementIndex = () => {
    if (currentIndex < sections.length - 1) {
      setCurrentIndex(i => i + 1);
      router.push('?' + appendQueryParam('step', String(currentIndex + 1)).toString())
    }
  }

  const decrementIndex = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
      router.push('?' + appendQueryParam('step', String(currentIndex - 1)).toString())
    }
  }

  const stepper: Stepper = {
    increment: incrementIndex,
    decrement: decrementIndex
  }

  return (
    <div className='w-full h-full px-8 pb-8 overflow-auto place-content-center'>
      {data.length > 0 ? sections[currentIndex](stepper, data, param) : <LoadingSpinner />}
    </div>
  )
}

function CareServiceOverview(stepper: Stepper, data: DDCData[], param: Params) {
  return (
    <section className="flex flex-col">
      <span className="leading-tight">These are your caregiving options recommended based on your Father’s medical profile.</span>
      <div className="flex flex-col gap-2 mt-4">
        {careServices.map((service, index) => <CareServiceButton key={index} service={service} incrementIndex={stepper.increment} />)}
      </div>
    </section>
  )
}

function CareServiceButton({ service, incrementIndex }: { service: CareServicesData; incrementIndex: () => void }) {
  return (
    <button className={`flex p-4 border border-gray-200 rounded-md gap-2 place-items-start place-content-start text-left ${!service.enabled && 'bg-gray-100'}`} onClick={incrementIndex}>
      <Image src={service.icon} alt="ds" width={40} height={40} />
      <div className="flex flex-col gap-2">
        <span className="font-semibold text-sm">{service.title}</span>
        <span className="text-sm">{service.description}</span>
        {service.eligibleForSubsidies && <Badge colorScheme={service.enabled ? "success" : "neutral"} variant="subtle">$ May be eligible for subsidies</Badge>}
        {!service.enabled && <span className="text-xs italic">This recommender is not yet available</span>}
      </div>
    </button>
  )
}

function DaycarePreferenceOverview(stepper: Stepper, data: DDCData[], param: Params) {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Daycare Services</h1>
      <span className="leading-tight">What factors are important to you when choosing a daycare service?</span>
      <Stack direction="column" spacing={1}>
        <Checkbox>Location</Checkbox>
        <Checkbox>Price</Checkbox>
        <Checkbox>Pick-up / drop-off service</Checkbox>
        <Checkbox.OthersWrapper>
          <Checkbox.OthersCheckbox />
          <Checkbox.OthersInput />
        </Checkbox.OthersWrapper>
      </Stack>
      <div className="flex w-full gap-2 mt-4">
        <Button onClick={stepper.decrement} className="w-[calc(50%-4px)]" variant="outline">Back</Button>
        <Button onClick={stepper.increment} className="w-[calc(50%-4px)]">Next</Button>
      </div>
    </section>
  )
}

function DaycareLocationPreference(stepper: Stepper, data: DDCData[], param: Params) {
  const router = useRouter()
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Daycare Services</h1>
      <div className="flex flex-col gap-4">
        <span className="leading-tight">Okay, based on your choices, please answer the following questions.</span>
        <span className="leading-tight"><b>Are you searching for centres close to you and your Father’s home address?</b></span>
        <span className="leading-tight">Feel free to update your postal code below.</span>
      </div>
      <Input placeholder="Your home postal code" value={510296} />
      <div className="flex w-full gap-2 mt-4">
        <Button onClick={stepper.decrement} className="w-[calc(50%-4px)]" variant="outline">Back</Button>
        <Button 
          className="w-[calc(50%-4px)]"
          onClick={() => {
          stepper.increment();
          router.push('?' + param.append('postal', '510296').toString())
        }}>
          Next
        </Button>
      </div>
    </section>
  )
}

function DaycarePickupDropoffPreference(stepper: Stepper, data: DDCData[], param: Params) {
  const router = useRouter()
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Daycare Services</h1>
      <span className="leading-tight">Would you require pick up and drop off services?</span>
      <Stack direction="column" spacing={1}>
        <Checkbox onChange={
          (e) => {
            e.target.checked ? 
            router.push('?' + param.append('pickup', String(e.target.checked)).toString()) : 
            router.push('?' + param.remove('pickup').toString())
          }
        }>Pick-up
        </Checkbox>
        <Checkbox onChange={
          (e) => {
            e.target.checked ? 
            router.push('?' + param.append('dropoff', String(e.target.checked)).toString()) : 
            router.push('?' + param.remove('dropoff').toString())
          }
        }>Drop-off
        </Checkbox>
      </Stack>
      <div className="flex w-full gap-2 mt-4">
        <Button onClick={stepper.decrement} className="w-[calc(50%-4px)]" variant="outline">Back</Button>
        <Button onClick={stepper.increment} className="w-[calc(50%-4px)]">Next</Button>
      </div>
    </section>
  )
}

function DaycarePickupDropoffLocation(stepper: Stepper, data: DDCData[], param: Params) {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Daycare Services</h1>
      <span className="leading-tight">To check if the daycare centre offers <b>Pick-up and drop-off</b> to your desired locations, please confirm the postal code(s) below:</span>
      <div className="flex flex-col">
        <FormLabel isRequired>Postal code for pick-up</FormLabel>
        <Input placeholder="e.g. 429912" value={510296} />
      </div>
      <div className="flex flex-col">
        <FormLabel isRequired>Postal code for pick-up</FormLabel>
        <Input placeholder="e.g. 429912" value={510296} />
      </div>
      <div className="flex w-full gap-2 mt-4">
        <Button onClick={stepper.decrement} className="w-[calc(50%-4px)]" variant="outline">Back</Button>
        <Button onClick={stepper.increment} className="w-[calc(50%-4px)]">Next</Button>
      </div>
    </section>
  )
}

function DaycarePricePreference(stepper: Stepper, data: DDCData[], param: Params) {
  const router = useRouter()
  function handleDragEnd(value: number[]) {
    const p = new URLSearchParams(param.value.toString())
    p.delete('minp')
    p.delete('maxp')
    p.append('minp', String(value[0]))
    p.append('maxp', String(value[1]))
    router.push('?' + p.toString())
  }
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Daycare Services</h1>
      <span className="leading-tight">What price are you willing to pay per day?</span>
      <span className="text-sm text-gray-400 leading-tight">(You can change this later)</span>
      <RangeSlider defaultValue={[10, 50]} min={10} max={90} step={10} width="90%" marginBottom={8} marginX="auto" onChangeEnd={handleDragEnd}>
        <RangeSliderMark value={10} className="pt-4 ml-[-16px]">
          $10
        </RangeSliderMark>
        <RangeSliderMark value={50} className="pt-4 ml-[-16px]">
          $50
        </RangeSliderMark>
        <RangeSliderMark value={90} className="pt-4 ml-[-16px]">
          $80
        </RangeSliderMark>
        <RangeSliderTrack>
          <RangeSliderFilledTrack />
        </RangeSliderTrack>
        <RangeSliderThumb boxSize={6} index={0} />
        <RangeSliderThumb boxSize={6} index={1} />
      </RangeSlider>
      <div className="flex w-full gap-2 mt-4">
        <Button onClick={stepper.decrement} className="w-[calc(50%-4px)]" variant="outline">Back</Button>
        <Button onClick={stepper.increment} className="w-[calc(50%-4px)]">Next</Button>
      </div>
    </section>
  )
}

function DaycareRecommendations(stepper: Stepper, data: DDCData[], param: Params) {
  const router = useRouter()
  const recommendations = data.slice(0, 3);

  const centreId = param.value.get('centre');
  const display = param.value.get('show');
  const selectedCentres = data.filter(c => c.friendlyId === centreId);

  function handleShowAll() {
    const p = param.append('show', 'all')
    router.push('?' + p.toString())
  }

  function handleShowRecommendations() {
    const p = param.append('show', 'recommendations')
    router.push('?' + p.toString())
  }

  return selectedCentres.length > 0 ? (
    <DaycareCentreDetails {...selectedCentres[0]} />
  ) : display === "all" ? (
    <section className="flex flex-col gap-4">
      <Button variant="link" leftIcon={<BxChevronLeft fontSize="1.5rem" />} marginRight="auto" onClick={handleShowRecommendations}>Back</Button>
      <span className="leading-tight">List of all dementia daycare centres:</span>
      <div className="flex flex-col gap-4">
        {data.map((centre, index) => <DaycareRecommendationCard key={index} centre={centre} param={param} />)}
      </div>
    </section>
  ) : (
    <section className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Daycare Services</h1>
      <span className="leading-tight">Thank you! Based on your inputs, I recommend the following:</span>
      <div className="flex flex-col gap-4">
        {recommendations.map((centre, index) => <DaycareRecommendationCard key={index} centre={centre} param={param} />)}
      </div>
      <Button>Save search</Button>
      <Button variant="outline" onClick={handleShowAll}>Show me the full list of centres</Button>
    </section>
  )
}

function DaycareRecommendationCard({ centre, param }: { centre: DDCData; param: Params }) {
  const router = useRouter()
  function handleClick() {
    const p = new URLSearchParams(param.value.toString())
    p.set('centre', centre.friendlyId)
    router.push(`?${p.toString()}`)
  }
  return (
    <div className="flex flex-col gap-4 p-4 border border-gray-200 rounded-md">
      <span className="font-semibold">{centre.name}</span>
      <div className="flex flex-col gap-2 text-sm">
        <span><b>Price per day: </b>${centre.price}</span>
        <span><b>Location: </b>{centre.distanceFromHome}km from home</span>
        <span className="flex gap-1 place-items-center">
          <b>Pickup/Dropoff: </b>
          <div className="flex gap-2">
            {centre.dropoffPickupAvailability.map((e, i) => <Badge key={i} colorScheme="success" variant="subtle">{e}</Badge>)}
          </div>
        </span>
        <span><b>Google reviews: </b>{centre.googleReviews} ⭐</span>
      </div>
      <Button variant="clear" rightIcon={<BxRightArrowAlt fontSize="1.5rem" />} marginLeft="auto" onClick={handleClick}>More Info</Button>
    </div>
  )
}

function DaycareCentreDetails(data: DDCData) {
  const router = useRouter()
  function handleClick() {
    router.back()
  }

  return (
    <section className="flex flex-col gap-4">
      <Button variant="link" leftIcon={<BxChevronLeft fontSize="1.5rem" />} marginRight="auto" onClick={handleClick}>Back</Button>
      <h1 className="text-xl font-semibold">{data.name}</h1>
      <div className="flex flex-col gap-4 text-sm">
        <span>{data.about}</span>
        <div className="flex flex-col">
          <span><b>Operating hours: </b></span>
          <span>{data.operatingHours.join(', \n')}</span>
        </div>
        <div className="flex flex-col">
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
        </div>
        <span className="flex gap-1 place-items-center">
          <b>Pickup/Dropoff: </b>
          <div className="flex gap-2">
            {data.dropoffPickupAvailability.map((e, i) => <Badge key={i} colorScheme="success" variant="subtle">{e}</Badge>)}
          </div>
        </span>
        <span><b>Google reviews: </b>{data.googleReviews} ⭐</span>
        <div className="flex flex-col gap-2 my-2">
          <span className="text-lg"><b>Contact Details</b></span>
          <div className="flex flex-col gap-2">
            {data.phone && <span><b>Phone: </b><a href={`tel:+65${data.phone}`} target="_blank" className="underline text-blue-500">{data.phone}</a></span>}
            {data.email && <span><b>Email: </b><a href={`mailto:${data.email}`} target="_blank" className="underline text-blue-500">{data.email}</a></span>}
            {data.website && <span><b>Website: </b><a href={data.website} target="_blank" className="underline text-blue-500">{data.website}</a></span>}
          </div>
        </div>
        <div className="flex flex-col gap-2 my-2">
          <span className="text-lg"><b>Address</b></span>
          <div className="flex flex-col">
            {data.buildingName && <span>{data.buildingName}</span>}
            <span>{data.block} {data.streetName} {data.unitNo}, {data.postalCode}</span>
          </div>
        </div>
      </div>
      <div id="embed-map-canvas" className="w-full">
        <iframe
          // api key from https://www.embed-map.com/
          src={`https://www.google.com/maps/embed/v1/place?q=${data.name.replace(' ', '+')}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`}
          allowFullScreen
          className="w-full h-96 rounded-md border border-gray-200 shadow"
        />
      </div>
    </section>
  )
}
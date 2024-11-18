"use client";

import { ProviderCard } from "@/components/ProviderCard";
import {
  HomeCareDetail,
  SERVICE_ID_TO_LABEL,
  transformHomeCareData,
} from "@/types/homecare";
import LoadingSpinner from "@/ui/loading";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function HomeCarePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [providers, setProviders] = useState<HomeCareDetail[]>([]);
  const searchParams = useSearchParams();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const queriedServices = searchParams.get("services")?.split(",") || [];
  console.log(queriedServices);

  useEffect(() => {
    setIsLoading(true);
    setSelectedServices(queriedServices);
    console.log(selectedServices);

    fetch("/data/homecare1.json")
      .then((response) => response.json())
      .then((data) => {
        const homeCareServices = transformHomeCareData(data);
        setProviders(homeCareServices);
        console.log(homeCareServices.length);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error loading homecare data:", error);
        setIsLoading(false);
      });
  }, []);

  const filteredProviders = useMemo(() => {
    return (
      providers
        .filter((provider) => {
          // Convert selected service IDs to labels for comparison
          const selectedServiceLabels = selectedServices.map(
            (id) => SERVICE_ID_TO_LABEL[id],
          );
          // Check if provider has all selected services
          return selectedServiceLabels.every((serviceLabel) =>
            provider.services.includes(serviceLabel),
          );
        })
        // Sort providers by rating (descending), handling null/undefined ratings
        .sort((a, b) => {
          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;
          return ratingB - ratingA;
        })
    );
  }, [providers, selectedServices]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col gap-1 bg-white p-6">
      <div>
        <h1 className="text-2xl font-bold">Home Care Services</h1>
        <p className="py-1 font-semibold text-gray-600">
          Find care centres and clinics near you.
        </p>
      </div>

      {/* Services Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {Object.values(SERVICE_ID_TO_LABEL).map((service) => {
          const serviceId = Object.entries(SERVICE_ID_TO_LABEL).find(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ([_id, label]) => label === service,
          )?.[0];
          const isSelected = serviceId && selectedServices.includes(serviceId);

          return (
            <button
              key={service}
              onClick={() => {
                if (serviceId) {
                  setSelectedServices((prev) =>
                    isSelected
                      ? prev.filter((id) => id !== serviceId)
                      : [...prev, serviceId],
                  );
                }
              }}
              className={`rounded-xl px-4 py-2 text-sm ${
                isSelected
                  ? "bg-[#1E1E1E] text-white"
                  : "bg-[#DADADA] text-gray-800"
              }`}
            >
              {service}
            </button>
          );
        })}
      </div>

      {/* Provider Cards */}
      <div className="mt-4 flex flex-col gap-4">
        {filteredProviders.map((provider) => (
          <ProviderCard
            key={provider.id}
            provider={provider}
            baseUrl="/careservice/homecare"
          />
        ))}
      </div>
    </div>
  );
}
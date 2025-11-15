"use client";

import { SchemeData } from "@/types/scheme";
import { BackButton } from "@/ui/button";
import LoadingSpinner from "@/ui/loading";
import { Button } from "@chakra-ui/react";
import { SignInButton } from "@clerk/nextjs";
import { useAuthStore } from "@/stores/auth";
import { BxRightArrowAlt } from "@opengovsg/design-system-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function SupportDashboard() {
  const isSignedIn = useAuthStore((state) => state.isSignedIn);
  const [data, setData] = useState<SchemeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch("/data/schemes.json")
      .then((response) => response.json())
      .then((json) => {
        setData(json);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex h-full w-full flex-col gap-4 py-6">
      <BackButton />
      <section className="flex flex-col gap-2 pb-6">
        <h3 className="py-4 text-2xl font-semibold">
          Explore Financial Support
        </h3>
        {!isSignedIn && (
          <section className="flex flex-col gap-4 rounded border border-brand-primary-300 bg-brand-primary-100 p-4">
            <p className="text-brand-primary-900">
              Sign in to get personalized recommendations
            </p>
            <SignInButton>
              <Button variant="solid" size="xs" colorScheme="blue">
                Sign in
              </Button>
            </SignInButton>
          </section>
        )}
        {data.map((scheme, index) => (
          <SchemeButton key={index} scheme={scheme} />
        ))}
      </section>
    </div>
  );
}

function SchemeButton({ scheme }: { scheme: SchemeData }) {
  const router = useRouter();

  function handleClick() {
    router.push(`/dashboard/schemes?id=${scheme.id}`);
  }

  return (
    <div className="flex place-content-start place-items-start gap-2 rounded-md border border-gray-200 bg-white p-4 text-left">
      <div className="flex flex-col gap-2">
        <span className="text-lg font-semibold">{scheme.name}</span>
        <span>{scheme.shortDescription}</span>
        <Button
          variant="clear"
          size="sm"
          rightIcon={<BxRightArrowAlt />}
          marginLeft="auto"
          onClick={handleClick}
        >
          View Details
        </Button>
      </div>
    </div>
  );
}

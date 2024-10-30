"use client";

import { SchemeData } from "@/types/scheme";
import { Button } from "@chakra-ui/react";
import { SignInButton, useAuth } from "@clerk/nextjs";
import { BxRightArrowAlt } from "@opengovsg/design-system-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";


export default function SupportDashboard() {
  const [data, setData] = useState<SchemeData[]>([]);
  const auth = useAuth();

  useEffect(() => {
    fetch('/data/schemes.json')
      .then((response) => response.json())
      .then((json) => setData(json));
  }, []);

  return (
    <div className="flex flex-col h-full w-full gap-4 py-6">
      {!auth.isSignedIn && (
        <section className="flex flex-col gap-4 p-4 bg-brand-primary-100 rounded border border-brand-primary-300">
          <p className="text-brand-primary-900">Sign in to get personalized recommendations</p>
          <SignInButton>
            <Button variant="solid" size="xs" colorScheme="blue">Sign in</Button>
          </SignInButton>
        </section>
      )}
      <section className="flex flex-col gap-2 pb-6">
        <h3 className="font-semibold text-lg">Explore Support</h3>
        {data.map((scheme, index) => <SchemeButton key={index} scheme={scheme} />)}
      </section>
    </div>
  );
}

function SchemeButton({ scheme }: { scheme: SchemeData }) {
  const router = useRouter();
  const auth = useAuth();
  
  function handleClick() {
    router.push(`/dashboard/schemes?id=${scheme.id}`);
  }
  
  return (
    <div className="flex p-4 bg-white border border-gray-200 rounded-md gap-2 place-items-start place-content-start text-left">
      <div className="flex flex-col gap-2">
        <span className="font-semibold text-sm">{scheme.name}</span>
        <span className="text-sm">{scheme.description}</span>
        <Button
          variant="clear"
          size="sm"
          rightIcon={<BxRightArrowAlt />}
          marginLeft="auto"
          onClick={handleClick}
        >
          {auth.isSignedIn ? `${scheme.numSteps} more steps to apply` : "View details"}
        </Button>
      </div>
    </div>
  )
}
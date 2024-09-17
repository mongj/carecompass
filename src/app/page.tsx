'use client'

import { IconButton, Input } from "@opengovsg/design-system-react";
import Image from "next/image";
import { AddIcon, SearchIcon } from "@chakra-ui/icons";

export default function Home() {
  return (
    <div className="flex h-screen">
      <section className="min-w-64 bg-textured-gradient bg-cover shadow-md p-8">
        <div className="flex flex-col place-items-center gap-8">
          <Image src="/img/logo.svg" alt="Logo" width={64} height={64} />
          <button className="rounded-full bg-white px-4 py-2 text-black flex place-items-center gap-2 border border-gray-100 hover:bg-gray-200 ease-in-out duration-200">
            <AddIcon />
            <span>New thread</span>
          </button>
        </div>
      </section>
      <main className="w-full flex flex-col place-content-between p-8">
        <section className="flex w-full h-full place-items-center place-content-center">
          <div className="flex flex-col place-items-center">
            <span className="text-3xl">Meet</span>
            <h3 className="text-5xl">Care<b>Compass</b></h3>
          </div>
        </section>
        <section>
          <div className="flex gap-4">
            <Input placeholder="Ask me something" />
            <IconButton icon={<SearchIcon />} aria-label={"Search"} />
          </div>
        </section>
      </main>
    </div>
  );
}

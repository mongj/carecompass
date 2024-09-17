"use client";

import Image from "next/image";
import { AddIcon } from "@chakra-ui/icons";
import Search from "@/ui/search";

export default function Home() {
  return (
    <div className="flex h-screen">
      <section className="min-w-64 bg-textured-gradient bg-cover p-8 shadow-md">
        <div className="flex flex-col place-items-center gap-8">
          <Image src="/img/logo.svg" alt="Logo" width={64} height={64} />
          <button className="flex place-items-center gap-2 rounded-full border border-gray-100 bg-white px-4 py-2 text-black duration-200 ease-in-out hover:bg-gray-200">
            <AddIcon />
            <span>New thread</span>
          </button>
        </div>
      </section>
      <main className="flex w-full flex-col place-content-between p-8">
        <section className="flex h-full w-full place-content-center place-items-center">
          <div className="flex flex-col place-items-center">
            <span className="text-3xl">Meet</span>
            <h3 className="text-5xl">
              Care<b>Compass</b>
            </h3>
          </div>
        </section>
        <section>
          <Search />
        </section>
      </main>
    </div>
  );
}

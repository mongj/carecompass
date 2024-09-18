"use client";

import Image from "next/image";
import { AddIcon } from "@chakra-ui/icons";
import Search from "@/ui/Search";
import { useParams, useRouter } from "next/navigation";
import { ChatContext } from "./context";
import { useState } from "react";
import ChatHistory from "@/ui/ChatHistory";
import { Thread } from "@/types/chat";

export default function ChatLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const params = useParams<{ chatId: string }>();
  const [chats, setChats] = useState<Thread[]>([]);
  
  function handleNewThread() {
    router.replace(`/chat`);
  }

  return (
    <ChatContext.Provider value={{ chats, setChats }}>
      <div className="flex h-screen max-h-screen">
        <section className="w-64 min-w-64 bg-textured-gradient bg-cover px-4 py-8 shadow-md">
          <div className="flex flex-col place-items-center gap-8">
            <Image src="/img/logo.svg" alt="Logo" width={64} height={64} />
            <button className="flex place-items-center gap-2 rounded-full border border-gray-100 bg-white px-4 py-2 text-black duration-200 ease-in-out hover:bg-gray-200" onClick={handleNewThread}>
              <AddIcon />
              <span>New thread</span>
            </button>
            <ChatHistory router={router} />
          </div>
        </section>
        <main className="max-h-screen overflow-hidden flex w-full flex-col place-content-between p-8 gap-4 bg-gray-100">
          <section className="flex h-full w-full place-content-center place-items-center">
            {children}
          </section>
          <section className="w-full">
            <Search currentChatId={params.chatId} />
          </section>
        </main>
      </div>
    </ChatContext.Provider>
  );
}

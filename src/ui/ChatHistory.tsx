'use client';

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useChatContext } from "@/app/chat/context";

export default function ChatHistory({ router }: { router: AppRouterInstance}) {
  const { chats } = useChatContext();

  return (
    <div className="flex flex-col w-full gap-1">
      {chats.map((chat) => (
        <button 
          key={chat.id}
          onClick={() => router.replace(`/chat/${chat.id}`)}
          className="whitespace-nowrap w-full max-w-56 text-white text-left text-sm hover:bg-gray-600 hover:bg-opacity-35 ease-in-out duration-100 px-4 py-2 rounded-lg text-ellipsis overflow-hidden"
        >
          {chat.title}
        </button>
      ))}
    </div>
  );
}
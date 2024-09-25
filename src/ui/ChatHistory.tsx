'use client';

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useChatContext } from "@/app/chat/context";

export default function ChatHistory({ router }: { router: AppRouterInstance}) {
  const { chats } = useChatContext();

  return (
    <div className="flex flex-col p-6 gap-4">
      <h3 className="font-semibold text-xl">
        Chat History
      </h3>
      <div className="flex flex-col w-full gap-1">
        {chats.map((chat) => (
          <button 
            key={chat.id}
            onClick={() => router.replace(`/chat/${chat.id}`)}
            className="whitespace-nowrap w-full max-w-56 text-left text-sm hover:bg-gray-600 hover:bg-opacity-35 ease-in-out duration-100 px-2 py-1 rounded-md text-ellipsis overflow-hidden"
          >
            {chat.title}
          </button>
        ))}
      </div>
    </div>
  );
}
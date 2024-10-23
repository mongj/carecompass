'use client';

import { useUserStore } from "@/stores/user";
import { GetUserThreadResponse } from "@/types/chat";
import { Skeleton, Stack } from "@chakra-ui/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useEffect, useState } from "react";

export default function ChatHistory({ router, onClose }: { router: AppRouterInstance, onClose?: () => void }) {
  const user_id = useUserStore((state) => state.user.clerk_id);
  const [chats, setChats] = useState<GetUserThreadResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/users/${user_id}/threads`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    }).then((res) => {
      if (res.ok) {
        res.json().then((data) => setChats(data));
      }
    }).finally(() => setIsLoading(false));
  }, [user_id]);

  return (
    <div className="flex flex-col gap-4 h-full">
      <h3 className="font-semibold text-xl">
        Chat History
      </h3>
      {isLoading || chats == undefined ? 
      <Stack spacing={4}>
        {Array.from({ length: 10 }).map((_, index) => (
          <Skeleton key={index} height="32px" width="100%" />
        ))}
      </Stack> : 
      <div className="flex flex-col w-full gap-1 place-content-start h-full">
        {chats.map((chat) => (
          <button 
            key={chat.thread_id}
            onClick={() => {
              if (onClose) {
                onClose();
              }
              router.replace(`/chat/${chat.thread_id}`)
            }}
            className="whitespace-nowrap w-full max-w-56 text-left hover:bg-gray-600 hover:bg-opacity-35 ease-in-out duration-100 pr-2 py-1 rounded-md text-ellipsis overflow-hidden"
          >
            {chat.title || "Untitled - " + chat.thread_id}
          </button>
        ))}
      </div>}
    </div>
  );
}
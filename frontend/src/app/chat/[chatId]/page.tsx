"use client";

import ChatMessage from "@/ui/chat/ChatMessage";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/ui/loading";
import { useCurrentThreadStore } from "@/stores/currentThread";
import { Avatar } from "@chakra-ui/react";
import { PulseLoader } from "react-spinners";

export default function Chat({ params }: { params: { chatId: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isNew = searchParams.get("new") === "true";

  const [isLoading, setIsLoading] = useState(true);
  const currentThread = useCurrentThreadStore((state) => state.thread);
  currentThread.id = params.chatId;

  useEffect(() => {
    if (isNew) {
      setIsLoading(false);
      return;
    }

    fetch(
      `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/threads/${params.chatId}/messages`,
    )
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            useCurrentThreadStore.setState((state) => {
              return {
                thread: {
                  ...state.thread,
                  messages: data,
                },
              };
            });
          });
        } else {
          useCurrentThreadStore.getState().reset();
          router.replace("/chat");
        }
      })
      .catch((error) => {
        // TODO: Handle error
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [params.chatId, isNew]);

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        const bottomMarker = document.getElementById("msg-bottom");
        if (bottomMarker) {
          bottomMarker.scrollIntoView();
        }
      }, 0); // A slight delay ensures rendering is done
    }
  }, [isLoading, currentThread.messages]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <section className="flex h-[calc(100dvh-184px)] w-full flex-col place-content-start gap-4 overflow-y-auto">
      {currentThread.messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      <div id="msg-bottom" />
      {useCurrentThreadStore.getState().isWaitingForResponse && (
        <div className="flex place-items-start gap-2 md:gap-4">
          <Avatar className="sticky mt-2" src="/img/logo.svg" size="xs" />
          <div className="flex w-[calc(100%-40px)] flex-col rounded-lg border bg-white p-4 md:w-[calc(100%-48px)]">
            <PulseLoader color="#1361F0" size={8} />
          </div>
        </div>
      )}
    </section>
  );
}

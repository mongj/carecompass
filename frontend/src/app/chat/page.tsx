"use client";

import { useAuthStore } from "@/stores/auth";
import LoadingSpinner from "@/ui/loading";
import { useChatQuery } from "@/util/hooks/useChatQuery";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

type ChatPrompt = {
  label: string;
  query: string;
};

const chatPrompts: ChatPrompt[] = [
  {
    label: "🏥 What caregiving options do I have?",
    query: "What caregiving options do I have?",
  },
  {
    label: "💵 What support might I be eligible for?",
    query: "What support might I be eligible for?",
  },
  {
    label: "🙌 Where can I go for help and support?",
    query: "Where can I go for help and support?",
  },
];

function ChatIntro() {
  const router = useRouter();
  const user = useAuthStore((state) => state.currentUser);
  const { handleSubmitPrompt } = useChatQuery();

  // get name from localstorage
  const threadId =
    typeof window !== "undefined"
      ? window.localStorage.getItem("cc-threadId")
      : null;
  if (threadId) {
    router.push(`/chat/${threadId}`);
  }

  return (
    <div className="flex h-full w-full flex-col place-content-between place-items-center">
      <div className="flex h-full flex-col place-content-center place-items-center gap-2 text-center">
        <span className="text-xl font-bold md:text-3xl">
          {user && user.firstName ? `Welcome, ${user.firstName}` : "Welcome!"}
        </span>
        <span>
          CareCompass is a care recommender that provides you recommendations
          based on your caregiving needs.
        </span>
      </div>
      <div className="flex w-full flex-col gap-2">
        <span className="font-semibold">How can I help you today?</span>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
          {chatPrompts.map((chatPrompt, index) => (
            <form
              key={index}
              className="w-full"
              onSubmit={(e) => {
                handleSubmitPrompt(e, chatPrompt.query);
              }}
            >
              <button
                key={index}
                className="min-h-12 w-full rounded-md border border-[rgb(191,194,200)] bg-white px-4 py-2 leading-tight duration-100 ease-in hover:bg-gray-50"
                type="submit"
              >
                {chatPrompt.label}
              </button>
            </form>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ChatIntroWithSuspense() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ChatIntro />
    </Suspense>
  );
}

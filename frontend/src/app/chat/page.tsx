"use client";

import LoadingSpinner from '@/ui/loading';
import { useChatQuery } from '@/util/hooks/useChatQuery';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';

type ChatPrompt = {
  label: string;
  query: string;
}

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
  }
];


function ChatIntro() {
  const router = useRouter();
  // const user = useAuthStore(state => state.currentUser);
  const { handleSubmitPrompt } = useChatQuery()

  // get name from localstorage
  const threadId = typeof window !== "undefined" ? window.localStorage.getItem('cc-threadId') : null;
  if (threadId) {
    router.push(`/chat/${threadId}`);
  }
  
  return (
    <div className="flex flex-col h-full w-full place-items-center place-content-between">
      <div className="flex flex-col place-items-center h-full place-content-center text-center gap-2">
        <span className="text-xl md:text-3xl font-bold">{`Welcome!`}</span>
        {/* <span className="text-xl md:text-3xl font-bold">{`Welcome, ${user.firstName}`}</span> */}
        <span>CareCompass is a care recommender that provides you recommendations based on your caregiving needs.</span>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <span className="font-semibold text-sm">How can I help you today?</span>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
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
                className="w-full bg-white px-4 py-2 min-h-12 border border-[rgb(191,194,200)] rounded-md hover:bg-gray-50 ease-in duration-100 leading-tight text-sm"
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

'use client';

import ChatMessage from "@/ui/chat/ChatMessage";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { ChatContext, useChatContext } from "../context";


export default function Chat({ params }: { params: { chatId: string }}) {
  const router = useRouter();
  
  const { chats } = useChatContext();
  const currentChat = chats.filter((chat) => chat.id === params.chatId)[0];
  
  if (!currentChat) {
    router.replace("/chat");
  }

  return currentChat && (
    <section className="flex flex-col gap-4 w-full h-full place-content-start">
      {currentChat.messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
    </section>
  );
}
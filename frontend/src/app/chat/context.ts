import { Thread } from "@/types/chat";
import { createContext, Dispatch, SetStateAction, useContext } from "react";

interface ChatContextType {
  chats: Thread[];
  setChats: Dispatch<SetStateAction<Thread[]>>;
}

export const ChatContext = createContext<ChatContextType | undefined>(
  undefined,
);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};

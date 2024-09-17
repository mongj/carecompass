import { Thread } from "@/types/chat";
import { SearchIcon } from "@chakra-ui/icons";
import { IconButton, Input } from "@opengovsg/design-system-react";
import { useRouter } from "next/navigation";
import { useState, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { ChatContext, useChatContext } from "@/app/chat/context";

export default function Search({ currentChatId } : { currentChatId?: string }) {
  const router = useRouter()
  const [prompt, setPrompt] = useState("");
  const { chats, setChats } = useChatContext();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const query = prompt.trim();

    // Clear the input field
    setPrompt("");

    if (!query) {
      return;
    }

    if (currentChatId) {
      // update the current chat
      const chatIndex = chats.findIndex((chat) => chat.id === currentChatId);
      if (chatIndex != -1) {
        chats[chatIndex].messages.push({
          id: uuidv4(),
          role: "user",
          content: query,
        });
        router.replace(`/chat/${currentChatId}`);
      } else {
        router.replace("/chat");
      }
    } else {
      // create a new chat
      const chatId = uuidv4();
      const newChat: Thread = {
        id: chatId,
        title: query,
        messages: [{
          id: uuidv4(),
          role: "user",
          content: query,
        }],
      };
      chats.push(newChat);

      router.replace(`/chat/${chatId}`);
    }

    setChats(chats);

    // TODO: Query backend for response    
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setPrompt(e.target.value);
  }

  return (
    <form className="flex w-full gap-2" onSubmit={handleSubmit}>
      <Input placeholder="Ask me something" value={prompt} onChange={handleInput}/>
      <IconButton icon={<SearchIcon />} aria-label={"Search"} type="submit" />
    </form>
  );
}

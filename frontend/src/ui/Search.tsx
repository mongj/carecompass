/* eslint-disable @typescript-eslint/no-unused-vars */
import { Thread } from "@/types/chat";
import { SearchIcon } from "@chakra-ui/icons";
import { IconButton, Input } from "@opengovsg/design-system-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useChatContext } from "@/app/chat/context";

export default function Search({ currentChatId } : { currentChatId?: string }) {
  const router = useRouter()
  const [prompt, setPrompt] = useState("");
  const { chats, setChats } = useChatContext();

  function handleSubmitPrompt(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const query = prompt.trim();

    // Clear the input field
    setPrompt("");

    if (!query) {
      return;
    }

    console.log("Search for:", query);
    getConversationResponse(query);

    // if (currentChatId) {
    //   // update the current chat
    //   const chatIndex = chats.findIndex((chat) => chat.id === currentChatId);
    //   if (chatIndex != -1) {
    //     chats[chatIndex].messages.push({
    //       id: uuidv4(),
    //       role: "user",
    //       "content": query,
    //     });
    //   } else {
    //     router.replace(`/chat`);
    //   }
    // } else {
    //   // create a new chat
    //   currentChatId = uuidv4();
    //   const newChat: Thread = {
    //     id: currentChatId,
    //     title: query,
    //     messages: [{
    //       id: uuidv4(),
    //       role: "user",
    //       "content": query,
    //     }],
    //   };
    //   chats.push(newChat);
    // }

    // setChats(chats);
    // router.replace(`/chat/${currentChatId}`);
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setPrompt(e.target.value);
  }

  return (
    <form className="flex w-full gap-2 my-6" onSubmit={handleSubmitPrompt}>
      <Input placeholder="Message" value={prompt} onChange={handleInput} />
      <IconButton icon={<SearchIcon />} aria-label={"Search"} type="submit" />
    </form>
  );
}

async function getConversationResponse(prompt: string) {
  const response = await fetch('http://127.0.0.1:8000/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "prompt": prompt
    })
  })
  let combined = '';
  if (response.body) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8'); // Decodes the binary data into a string
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true }); // Convert Uint8Array to string
      combined += chunk;
      console.log('data:', combined);
    }
  }
}
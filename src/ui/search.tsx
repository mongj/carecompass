import { Message, Thread } from "@/types/chat";
import { SearchIcon } from "@chakra-ui/icons";
import { IconButton, Input } from "@opengovsg/design-system-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useChatContext } from "@/app/chat/context";
import { parse } from "partial-json";

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
          "content": query,
        });
      } else {
        router.replace("/chat");
      }
    } else {
      // create a new chat
      currentChatId = uuidv4();
      const newChat: Thread = {
        id: currentChatId,
        title: query,
        messages: [{
          id: uuidv4(),
          role: "user",
          "content": query,
        }],
      };
      chats.push(newChat);
    }

    setChats(chats);
    router.replace(`/chat/${currentChatId}`);

    // TODO: Query backend for response
    // This is a placeholder for the actual backend query

    const json = `
    {
      "content": [
        {
          "type": "text",
          "content": "Communicating effectively with someone who has dementia requires patience, empathy, and specific strategies to make it easier for both you and your loved one. Here are some practical steps:"
        },
        {
          "type": "ui",
          "content": [
            {
              "header": "1. Simplify Your Communication",
              "content": "Use short, simple sentences: Speak slowly and clearly. Avoid using complex words or phrases that might confuse them. One question at a time: Ask questions that require simple answers, like 'yes' or 'no.' Give time to respond: Be patient. It may take them longer to process what you’re saying and to reply."
            },
            {
              "header": "2. Use Non-Verbal Cues",
              "content": "Maintain eye contact: This helps to keep their attention and provides reassurance. Use gentle gestures: Point or demonstrate what you mean, if words are not enough. Facial expressions matter: Smile or nod to offer encouragement and make them feel more at ease."
            },
            {
              "header": "3. Be Reassuring and Calm",
              "content": "Stay positive: Speak in a friendly, non-judgmental tone. Don't correct or argue: If they say something that doesn’t make sense, don’t argue. It’s more important to keep them comfortable and reassured than to correct them."
            },
            {
              "header": "4. Adapt to Their Mood",
              "content": "Go with the flow: If your loved one is frustrated, change the topic or take a break to let them calm down. Forcing a conversation might upset them further. Avoid overwhelming them: Too much information at once can be confusing. Break tasks or ideas into smaller parts."
            },
            {
              "header": "5. Focus on Familiar Topics",
              "content": "Talk about the past: People with dementia often remember past events better than recent ones, so discussing old memories can bring comfort. Use memory aids: Show photos or familiar objects that can trigger memories and make the conversation more engaging."
            },
            {
              "header": "6. Maintain a Routine",
              "content": "Set regular times for conversation: A consistent routine helps reduce confusion and stress, making communication smoother over time."
            },
            {
              "header": "7. Seek Professional Help",
              "content": "Dementia care resources: Attend workshops, or reach out to organizations like the Agency for Integrated Care (AIC) or Dementia Singapore for tips and support​​. Download useful apps: Apps like CARA provide resources for caregivers, including features like 'Ask the Experts' and helplines for immediate advice​. Lastly, if you’re struggling with these conversations, remember to contact a local dementia helpline at 6377 0700 or seek support from caregiver groups that understand the challenges​."
            }
          ]
        },
        {
          "type": "text",
          "content": "Let me know if you need more information or assistance! I'm always here to help :)" 
        }
      ]
    }
    `.replaceAll("\n", "").replace(/\s{2,}/g, ' ').trim();
    
    const words = json.split(" ");

    if (query === "How do I effectively communicate with someone who has dementia?") {
      const chatIndex = chats.findIndex((chat) => chat.id === currentChatId);
      if (chatIndex != -1) {
        // Add a bot message
        const responseId = uuidv4();
        const responseMessage: Message = {
          id: responseId,
          role: "bot",
          "content": "",
        }
        setChats((prevChats) => prevChats.map(
          (chat) => chat.id === currentChatId 
            ? {...chat, messages: chat.messages.concat(responseMessage)} 
            : chat
          )
        );

        // Write words to the bot message at set intervals
        let index = -1;
        let newContent = "";
        const interval = setInterval(() => {
          setChats((prevChats) =>
            prevChats.map((chat) =>
              chat.id === currentChatId
                ? {
                    ...chat,
                    messages: chat.messages.map((message) =>
                      message.id === responseId
                        ? {
                            ...message,
                            "content": parse(newContent),
                          }
                        : message
                    ),
                  }
                : chat
              )
            );
            index++;
            newContent += " " + words[index];

            router.replace(`/chat/${currentChatId}`);

            if (index >= words.length - 1) {
              clearInterval(interval);
            }
          }, 25);
      }
    }
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

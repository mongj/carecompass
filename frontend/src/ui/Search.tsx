import { useCurrentThreadStore } from "@/stores/currentThread";
import { useUserStore } from "@/stores/user";
import { CreateThreadResponse } from "@/types/chat";
import { SearchIcon } from "@chakra-ui/icons";
import { IconButton, Input } from "@opengovsg/design-system-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Search({ currentChatId } : { currentChatId?: string }) {
  console.log(currentChatId)
  const router = useRouter();
  const [prompt, setPrompt] = useState("");

  async function handleSubmitPrompt(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const query = prompt.trim();

    // Clear the input field
    setPrompt("");

    if (!query) {
      return;
    }

    let threadId = currentChatId;

    if (!threadId) {
      // Create a new chat
      const newThreadId = await createThread();
      threadId = newThreadId;
      // Add the message to the current chat
      useCurrentThreadStore.setState(() => {
        return {
          thread: {
            id: newThreadId,
            messages: [
              {
                id: 'NEW_USER_MESSAGE',
                role: 'user',
                content: query,
              },
            ],
          },
        };
      });
      router.push(`/chat/${newThreadId}?new=true`);
    } else {
      // Add the message to the current chat
      useCurrentThreadStore.setState((state) => {
        return {
          thread: {
            ...state.thread,
            messages: [
              ...state.thread.messages,
              {
                id: 'NEW_USER_MESSAGE' + state.thread.messages.length,
                role: 'user',
                content: query,
              },
            ],
          },
        };
      });
    }

    getResponse(threadId, query);
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

async function createThread() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/threads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: useUserStore.getState().user.clerk_id
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to create thread');
    }
    const data: CreateThreadResponse = await response.json();
    return data.thread_id;
  } catch (error) {
    throw error; // Re-throw the error so that the calling function can handle it
  }
}

async function getResponse(threadId: string, query: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/threads/${threadId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "query": query
    })
  })
  let combined = '';
  const messageId = 'NEW_ASST_MESSAGE' + useCurrentThreadStore.getState().thread.messages.length; // TODO: fix this

  if (response.body) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8'); // Decodes the binary data into a string
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true }); // Convert Uint8Array to string
      const parsedChunk = parseEventStream(chunk);
      if (parsedChunk) {
        combined += parsedChunk
        // Temp fix to remove citations from openai response
        combined = combined.replace(/【.*?】/g, '')
        useCurrentThreadStore.setState((state) => {
          if (!state.thread.messages.find((message) => message.id === messageId)) {
            return {
              thread: {
                ...state.thread,
                messages: [
                  ...state.thread.messages,
                  {
                    id: messageId,
                    role: 'assistant',
                    content: combined,
                  },
                ],
              },
            };
          } else {
            return {
              thread: {
                ...state.thread,
                messages: state.thread.messages.map((message) => {
                  if (message.id === messageId) {
                    return {
                      ...message,
                      content: combined,
                    };
                  }
                  return message;
                }),
              },
            }
          }
        });
      }
    }
  }
}

function parseEventStream(input: string): string {
  // Match all occurrences of token values from the input
  const tokenRegex = /"token":\s*"([^"]+)"/g;
  let match;
  let result = "";

  // Iterate over all matches and concatenate the token values
  while ((match = tokenRegex.exec(input)) !== null) {
    result += match[1];  // Append the captured group (token value)
  }

  // Replace unicode escape sequences (like \uXXXX) with actual Unicode characters
  result = result.replace(/\\u([0-9a-fA-F]{4})/g, (_, unicode) => {
    return String.fromCharCode(parseInt(unicode, 16));
  });

  return result.replace(/\\n/g, '\n');
}
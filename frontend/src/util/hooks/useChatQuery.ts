import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentThreadStore } from "@/stores/currentThread";
import { CreateThreadResponse, MessageRole } from "@/types/chat";
import getUserId from "../getUserId";

export function useChatQuery(currentChatId?: string) {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handleSubmitPrompt = async (
    e: React.FormEvent<HTMLFormElement>,
    input?: string,
  ) => {
    e.preventDefault();

    // Override prompt if input is provided
    const query = (input || prompt).trim();

    // Clear the input field
    setPrompt("");

    if (!query) {
      return;
    }

    setIsSending(true);

    let threadId = currentChatId;

    if (!threadId) {
      // Create a new chat
      const newThreadId = await createThread();
      threadId = newThreadId;
      // Add the message to the current chat
      useCurrentThreadStore.setState(() => ({
        thread: {
          id: newThreadId,
          messages: [
            {
              id: "NEW_USER_MESSAGE",
              role: MessageRole.User,
              content: query,
            },
          ],
        },
      }));
      router.push(`/chat/${newThreadId}?new=true`);
    } else {
      // Add the message to the current chat
      useCurrentThreadStore.setState((state) => ({
        thread: {
          ...state.thread,
          messages: [
            ...state.thread.messages,
            {
              id: "NEW_USER_MESSAGE" + state.thread.messages.length,
              role: MessageRole.User,
              content: query,
            },
          ],
        },
      }));
    }

    getResponse(threadId, query);
    setIsSending(false);
  };

  return { prompt, setPrompt, isSending, handleInput, handleSubmitPrompt };
}

async function createThread() {
  try {
    const userId = getUserId();
    if (!userId) {
      throw new Error("User ID is missing");
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/threads`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
        }),
      },
    );
    if (!response.ok) {
      throw new Error("Failed to create thread");
    }
    const data: CreateThreadResponse = await response.json();
    return data.thread_id;
  } catch (error) {
    throw error; // Re-throw the error so that the calling function can handle it
  }
}

async function getResponse(threadId: string, query: string) {
  useCurrentThreadStore.getState().setIsWaitingForResponse(true);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/threads/${threadId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    },
  );
  let combined = "";
  const messageId =
    "NEW_ASST_MESSAGE" +
    useCurrentThreadStore.getState().thread.messages.length;

  if (response.body) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    while (true) {
      const { value, done } = await reader.read();

      if (useCurrentThreadStore.getState().isWaitingForResponse) {
        useCurrentThreadStore.getState().setIsWaitingForResponse(false);
      }

      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const parsedChunk = parseEventStream(chunk);
      if (parsedChunk) {
        combined += parsedChunk;
        useCurrentThreadStore.setState((state) => {
          if (
            !state.thread.messages.find((message) => message.id === messageId)
          ) {
            return {
              thread: {
                ...state.thread,
                messages: [
                  ...state.thread.messages,
                  {
                    id: messageId,
                    role: MessageRole.Assistant,
                    content: combined,
                  },
                ],
              },
            };
          } else {
            return {
              thread: {
                ...state.thread,
                messages: state.thread.messages.map((message) =>
                  message.id === messageId
                    ? {
                        ...message,
                        role: MessageRole.Assistant,
                        content: combined,
                      }
                    : message,
                ),
              },
            };
          }
        });
      }
    }
  }
}

function parseEventStream(input: string): string {
  const tokenRegex = /"token":\s*"(.*)"/g;
  let match;
  let result = "";

  while ((match = tokenRegex.exec(input)) !== null) {
    result += match[1];
  }

  result = result.replace(/\\u([0-9a-fA-F]{4})/g, (_, unicode) =>
    String.fromCharCode(parseInt(unicode, 16)),
  );

  return result;
}

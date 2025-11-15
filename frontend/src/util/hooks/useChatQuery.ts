import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentThreadStore } from "@/stores/currentThread";
import { CreateThreadResponse, MessageRole } from "@/types/chat";
import { useAuthStore } from "@/stores/auth";
import { toast } from "sonner";

export function useChatQuery(currentChatId?: string) {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isSending, setIsSending] = useState(false);
  const userId = useAuthStore((s) => s.userId);

  const setThreadId = useCurrentThreadStore((s) => s.setThreadId);
  const setMessages = useCurrentThreadStore((s) => s.setMessages);
  const appendUserMessage = useCurrentThreadStore((s) => s.appendUserMessage);
  const upsertAssistantMessage = useCurrentThreadStore(
    (s) => s.upsertAssistantMessage,
  );
  const setIsWaitingForResponse = useCurrentThreadStore(
    (s) => s.setIsWaitingForResponse,
  );
  const currentMessagesLength = useCurrentThreadStore(
    (s) => s.thread.messages.length,
  );

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
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
      if (!userId) {
        toast.error("Please sign in to use this feature!");
        return;
      }

      // Create a new chat
      const newThreadId = await createThread(userId);
      threadId = newThreadId;
      // Initialize thread id and first user message declaratively
      setThreadId(newThreadId);
      setMessages([
        { id: "NEW_USER_MESSAGE", role: MessageRole.User, content: query },
      ]);
      router.push(`/chat/${newThreadId}?new=true`);
    } else {
      // Add the message to the current chat declaratively
      appendUserMessage(query);
    }

    const messageId = "NEW_ASST_MESSAGE" + currentMessagesLength;
    await getResponse({
      threadId,
      query,
      messageId,
      setIsWaitingForResponse,
      upsertAssistantMessage,
    });
    setIsSending(false);
  };

  return { prompt, setPrompt, isSending, handleInput, handleSubmitPrompt };
}

async function createThread(userId: string | null) {
  try {
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

async function getResponse({
  threadId,
  query,
  messageId,
  setIsWaitingForResponse,
  upsertAssistantMessage,
}: {
  threadId: string;
  query: string;
  messageId: string;
  setIsWaitingForResponse: (b: boolean) => void;
  upsertAssistantMessage: (id: string, content: string) => void;
}) {
  setIsWaitingForResponse(true);

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

  if (response.body) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    while (true) {
      const { value, done } = await reader.read();

      setIsWaitingForResponse(false);

      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const parsedChunk = parseEventStream(chunk);
      if (parsedChunk) {
        combined += parsedChunk;
        upsertAssistantMessage(messageId, combined);
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

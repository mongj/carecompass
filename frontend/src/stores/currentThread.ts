import { Message, MessageRole, Thread } from "@/types/chat";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface CurrentThreadState {
  thread: Thread;
  isWaitingForResponse: boolean;
}

interface CurrentThreadActions {
  setIsWaitingForResponse: (isWaitingForResponse: boolean) => void;
  setThreadId: (id: string) => void;
  setMessages: (messages: Message[]) => void;
  appendUserMessage: (content: string) => void;
  upsertAssistantMessage: (messageId: string, content: string) => void;
  reset: () => void;
}

const initialState: CurrentThreadState = {
  thread: {
    id: "",
    title: "",
    messages: [],
  },
  isWaitingForResponse: false,
};

export const useCurrentThreadStore = create<
  CurrentThreadState & CurrentThreadActions
>()(
  immer((set) => ({
    ...initialState,

    setIsWaitingForResponse: (isWaitingForResponse: boolean) =>
      set((state) => {
        state.isWaitingForResponse = isWaitingForResponse;
      }),
    setThreadId: (id: string) =>
      set((state) => {
        state.thread.id = id;
      }),
    setMessages: (messages: Message[]) =>
      set((state) => {
        state.thread.messages = messages;
      }),
    appendUserMessage: (content: string) =>
      set((state) => {
        const nextId = "NEW_USER_MESSAGE" + state.thread.messages.length;
        state.thread.messages.push({
          id: nextId,
          role: MessageRole.User,
          content,
        });
      }),
    upsertAssistantMessage: (messageId: string, content: string) =>
      set((state) => {
        const existing = state.thread.messages.find((m) => m.id === messageId);
        if (existing) {
          existing.role = MessageRole.Assistant;
          existing.content = content;
        } else {
          state.thread.messages.push({
            id: messageId,
            role: MessageRole.Assistant,
            content,
          });
        }
      }),
    reset: () => set(initialState),
  })),
);

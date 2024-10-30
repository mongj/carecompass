import { Thread } from "@/types/chat";
import { create } from "zustand";

interface CurrentThreadState {
  thread: Thread;
  isWaitingForResponse: boolean;
}

interface CurrentThreadActions {
  setIsWaitingForResponse: (isWaitingForResponse: boolean) => void;
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
>()((set) => ({
  ...initialState,

  setIsWaitingForResponse: (isWaitingForResponse: boolean) =>
    set({ isWaitingForResponse }),
  reset: () => set(initialState),
}));

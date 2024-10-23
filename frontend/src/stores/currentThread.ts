import { Thread } from "@/types/chat";
import { create } from "zustand";

interface CurrentThreadState {
  thread: Thread;
}

interface CurrentThreadActions {
  reset: () => void;
}

const initialState: CurrentThreadState = {
  thread: {
    id: '',
    title: '',
    messages: [],
  }
};

export const useCurrentThreadStore = create<CurrentThreadState & CurrentThreadActions>()(
  (set) => ({
      ...initialState,

      reset: () => set(initialState),
  }),
);
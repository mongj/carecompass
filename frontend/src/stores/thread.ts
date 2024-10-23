import { Thread } from "@/types/chat";
import { create } from "zustand";

interface ThreadState {
  threads: Thread[];
}

interface ThreadActions {
  reset: () => void;
}

const initialState: ThreadState = {
  threads: [],
};

export const useThreadStore = create<ThreadState & ThreadActions>()(
  (set) => ({
      ...initialState,

      reset: () => set(initialState),
  }),
);
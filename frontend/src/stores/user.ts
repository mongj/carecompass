import { UserData } from "@/types/user";
import { create } from "zustand";

interface UserState {
  user: UserData;
}

interface UserActions {
  reset: () => void;
}

const initialState: UserState = {
  user: {} as UserData,
};

export const useUserStore = create<UserState & UserActions>()(
  (set) => ({
      ...initialState,

      reset: () => set(initialState),
  }),
);
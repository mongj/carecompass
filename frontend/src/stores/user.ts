import { UserData } from "@/types/user";
import { create } from "zustand";

interface UserState {
  user: UserData;
}

interface UserActions {
  setUser: (user: UserData) => void;
  reset: () => void;
}

const initialState: UserState = {
  user: {} as UserData,
};

export const useUserStore = create<UserState & UserActions>()((set) => ({
  ...initialState,

  setUser: (user: UserData) => set({ user }),
  reset: () => set(initialState),
}));

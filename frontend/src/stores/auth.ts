import { UserResource } from "@clerk/types";
import { create } from "zustand";

interface AuthState {
  currentUser: UserResource;
}

interface AuthActions {
  setCurrentUser: (user: UserResource) => void;
  reset: () => void;
}

const initialState: AuthState = {
  currentUser: {} as UserResource,
};

export const useAuthStore = create<AuthState & AuthActions>()((set) => ({
  ...initialState,

  setCurrentUser: (user: UserResource) => set({ currentUser: user }),
  reset: () => set(initialState),
}));

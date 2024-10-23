import { UserResource } from "@clerk/types";
import { create } from "zustand";

interface AuthState {
  currentUser: UserResource;
}

interface AuthActions {
  reset: () => void;
}

const initialState: AuthState = {
  currentUser: {} as UserResource,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  (set) => ({
      ...initialState,

      reset: () => set(initialState),
  }),
);
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { UserData } from "@/types/user";

interface AuthState {
  // Clerk auth state
  isSignedIn: boolean;
  userId?: string;
  userFullName?: string;
  emailAddresses?: string[];
  // User onboarding state
  isOnboarded?: boolean; // undefined indicates that the app has not checked if user is onboarded
  userData?: UserData;
}

interface AuthActions {
  setAuth: (
    isSignedIn: boolean,
    userId?: string,
    userFullName?: string,
    emailAddresses?: string[],
  ) => void;
  setUserData: (isOnboarded: boolean, userData?: UserData) => void;
  reset: () => void;
}

const initialState: AuthState = {
  isSignedIn: false,
  userId: undefined,
  userFullName: undefined,
  emailAddresses: undefined,
  isOnboarded: undefined,
  userData: undefined,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  immer((set) => ({
    ...initialState,

    setAuth: (
      isSignedIn: boolean,
      userId?: string,
      userFullName?: string,
      emailAddresses?: string[],
    ) =>
      set((state) => {
        state.isSignedIn = isSignedIn;
        state.userId = userId;
        state.userFullName = userFullName;
        state.emailAddresses = emailAddresses;
      }),
    setUserData: (isOnboarded: boolean, userData?: UserData) =>
      set((state) => {
        state.isOnboarded = isOnboarded;
        state.userData = userData;
      }),
    reset: () => set(initialState),
  })),
);

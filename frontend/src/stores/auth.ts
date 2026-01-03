import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { UserData } from "@/types/user";

interface AuthState {
  // Initialisation
  isInitialised: boolean;
  // Clerk auth state
  isSignedIn: boolean;
  isGuest: boolean;
  userId?: string;
  userFullName?: string;
  emailAddresses?: string[];
  // User onboarding state
  isOnboarded?: boolean; // undefined indicates that the app has not checked if user is onboarded
  userData?: UserData;
}

interface AuthActions {
  signIn: (
    isSignedIn: boolean,
    userId?: string,
    userFullName?: string,
    emailAddresses?: string[],
  ) => void;
  setUserData: (isOnboarded: boolean, userData?: UserData) => void;
  signInAsGuest: () => void;
  signOut: () => void;
}

const initialState: AuthState = {
  isInitialised: false,
  isSignedIn: false,
  isGuest: false,
  userId: undefined,
  userFullName: undefined,
  emailAddresses: undefined,
  isOnboarded: undefined,
  userData: undefined,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  immer((set) => {
    const reset = () =>
      set({
        ...initialState,
        isInitialised: true,
      });

    return {
      ...initialState,
      signIn: (
        isSignedIn: boolean,
        userId?: string,
        userFullName?: string,
        emailAddresses?: string[],
      ) => {
        reset();
        set((state) => {
          state.isSignedIn = isSignedIn;
          state.userId = userId;
          state.userFullName = userFullName;
          state.emailAddresses = emailAddresses;
        });
      },
      signInAsGuest: () => {
        reset();
        set((state) => {
          state.isGuest = true;
        });
      },
      signOut: reset,
      setUserData: (isOnboarded: boolean, userData?: UserData) => {
        set((state) => {
          state.isOnboarded = isOnboarded;
          state.userData = userData;
        });
      },
    };
  }),
);

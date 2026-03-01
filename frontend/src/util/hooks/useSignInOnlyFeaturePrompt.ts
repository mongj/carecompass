import { useAuthStore } from "@/stores/auth";
import { toast } from "sonner";

export default function useSignInOnlyFeaturePrompt() {
  const isSignedIn = useAuthStore((state) => state.isSignedIn);

  const promptIfNotSignedIn = () => {
    if (!isSignedIn) {
      toast.error("Please sign in to use this feature!");
      return true;
    }
    return false;
  };
  return { isSignedIn, promptIfNotSignedIn };
}

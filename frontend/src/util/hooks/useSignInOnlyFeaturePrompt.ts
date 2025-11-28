import { useAuthStore } from "@/stores/auth";
import { toast } from "sonner";

export default function useSignInOnlyFeaturePrompt() {
  const userId = useAuthStore((state) => state.userId);
  const promptIfNotSignedIn = () => {
    if (!userId) {
      toast.error("Please sign in to use this feature!");
      return true;
    }
    return false;
  };
  return { promptIfNotSignedIn };
}

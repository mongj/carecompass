import { SignInButton } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { Button, ButtonProps } from "@opengovsg/design-system-react";
import { BookmarkIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SaveButtonProps extends ButtonProps {
  saved?: boolean;
  link?: string;
}

export default function SaveButton({
  saved = false,
  ...props
}: SaveButtonProps) {
  const auth = useAuth();
  const [isSaved, setIsSaved] = useState(saved);

  const handleSave = () => {
    setIsSaved(true);
    toast.success("Saved!");
  };
  if (auth.isSignedIn) {
    return (
      <Button
        {...props}
        leftIcon={<BookmarkIcon size={16} />}
        aria-label="Save this page"
        isDisabled={isSaved}
        onClick={handleSave}
      >
        {isSaved ? "Saved" : "Save"}
      </Button>
    );
  }

  return (
    <SignInButton>
      <Button {...props} leftIcon={<BookmarkIcon size={16} />}>
        Sign in to save
      </Button>
    </SignInButton>
  );
}

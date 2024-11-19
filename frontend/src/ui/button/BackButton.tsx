import { Button } from "@opengovsg/design-system-react";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant="link"
      color="secondary"
      leftIcon={<ArrowLeftIcon size={16} />}
      aria-label="Back"
      onClick={() => router.back()}
    >
      Back
    </Button>
  );
}

import { useState } from "react";
import { Drawer } from "vaul";
import {
  Button,
  FormLabel,
  Textarea,
  Checkbox,
} from "@opengovsg/design-system-react";
import { useAuthStore } from "@/stores/auth";
import { Rating } from "@smastrom/react-rating";
import { ReviewCreate, ReviewSource, ReviewTargetType } from "@/types/review";
import { api } from "@/api";

interface NewReviewDrawerProps {
  serviceProviderId: number;
  targetType: ReviewTargetType;
}

export function NewReviewDrawer({
  serviceProviderId,
  targetType,
}: NewReviewDrawerProps) {
  const userFullName = useAuthStore((state) => state.userFullName);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeclarationChecked, setIsDeclarationChecked] = useState(false);
  const [review, setReview] = useState<ReviewCreate>({
    review_source: ReviewSource.IN_APP,
    target_id: serviceProviderId,
    target_type: targetType,
    overall_rating: 0,
    author_name: userFullName || "Anonymous",
    content: "",
  });

  const canSubmit = review.overall_rating === 0 || !isDeclarationChecked;

  const submitReview = () => {
    api.post("/reviews", review).then((response) => {
      if (response.status === 201) {
        setIsOpen(false);
        location.reload();
      }
    });
  };

  return (
    <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
      <Drawer.Trigger className="w-full">
        <Button className="w-full">Leave a review</Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 h-fit rounded-xl bg-white outline-none">
          <Drawer.Handle className="my-2" />
          <div className="flex flex-col gap-4 bg-white px-8 py-8 pt-6">
            <Drawer.Title className="text-xl font-semibold">
              Leave a review
            </Drawer.Title>
            <div className="flex flex-col gap-2 rounded-md border border-brand-primary-200 bg-brand-primary-50 p-4 leading-tight">
              <span>
                Thank you for helping other caregivers by sharing your
                experiences. We ask that you declare below that you have indeed
                used the{" "}
                {targetType === ReviewTargetType.DEMENTIA_DAY_CARE
                  ? "daycare"
                  : "homecare"}
                service, as we value genuine reviews only.
              </span>
              <Checkbox
                isChecked={isDeclarationChecked}
                onChange={(e) => setIsDeclarationChecked(e.target.checked)}
              >
                I declare that I have used this service and my review is based
                on my actual experiences.
              </Checkbox>
            </div>
            <div>
              <FormLabel className="mt-2" isRequired>
                Rating
              </FormLabel>
              <Rating
                value={review.overall_rating}
                className="max-w-48"
                onChange={(v: number) =>
                  setReview({
                    ...review,
                    overall_rating: v,
                  })
                }
              />
            </div>
            <div>
              <FormLabel className="mt-2">
                Please share more about why you chose this rating
              </FormLabel>
              <Textarea
                value={review.content}
                onChange={(e) =>
                  setReview({ ...review, content: e.target.value })
                }
                placeholder="Share your experience with us"
              />
            </div>
            <Button
              className="mt-4 w-full"
              onClick={submitReview}
              isDisabled={canSubmit}
            >
              Share
            </Button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

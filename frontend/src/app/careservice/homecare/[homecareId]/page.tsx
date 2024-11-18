"use client";

import {
  formatAddress,
  HomeCareDetail,
  transformHomeCareData,
} from "@/types/homecare";
import LoadingSpinner from "@/ui/loading";
import { Button, VisuallyHidden, VStack, Text } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Review, ReviewSource } from "@/types/review";
import moment from "moment";
import { Drawer } from "vaul";
import { Rating } from "@smastrom/react-rating";
import { mapReviewSource } from "@/util/review";
import PhotoSlider from "@/components/PhotoSlider";
import { getRatingColor } from "@/util/helper";
import { BackButton } from "@/ui/button";

export default function HomeCareDetailPage() {
  const { homecareId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [provider, setProvider] = useState<HomeCareDetail | undefined>();

  useEffect(() => {
    setIsLoading(true);
    fetch("/data/homecare1.json")
      .then((response) => response.json())
      .then((data) => {
        const transformedData = transformHomeCareData(data);
        const selectedProvider = transformedData.find(
          (p: HomeCareDetail) => String(p.id) === String(homecareId),
        );

        if (!selectedProvider) {
          console.error("Provider not found for ID:", homecareId);
        }
        setProvider(selectedProvider);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error loading provider data:", error);
        setIsLoading(false);
      });
  }, [homecareId]);

  if (isLoading || !provider) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex min-h-screen flex-col gap-4 overflow-x-hidden bg-white p-6">
      <BackButton />
      {/* Banner Image */}
      <div
        className={`${provider.photos !== undefined && provider.photos.length !== 0 ? "block" : "hidden"}`}
      >
        {provider.photos && <PhotoSlider photos={provider.photos} />}
      </div>

      {/* Header with Name and Rating */}
      <div>
        <h1 className="text-2xl font-bold">{provider.name}</h1>
        {/* Review Scores */}
        <div className="flex items-center gap-4 py-3">
          <div className="flex items-center gap-2">
            <div
              className="rounded p-2 text-xl font-semibold text-white"
              style={{
                backgroundColor: getRatingColor(provider.rating),
              }}
            >
              {provider.rating?.toFixed(2) || "N/A"}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="h-8 w-64 rounded bg-[#DADADA]">
              <div
                className="flex h-full items-center justify-between rounded bg-[#7D7D7D] px-2 text-sm text-white"
                style={{
                  width: `${((provider.rating || 0) / 5) * 100}%`,
                }}
              >
                <span>Google</span>
                <span>{provider.rating?.toFixed(2) || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Section */}
      <div className="-mt-4">
        <h2 className="text-md font-bold">Address</h2>
        <p className="text-gray-700">{formatAddress(provider)}</p>
      </div>

      {/* Contact Details Section */}
      <div className="-mt-2">
        <h2 className="text-md font-bold">Contact Details</h2>
        <div className="flex flex-col gap-2">
          {provider.phone && (
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>{provider.phone}</span>
            </div>
          )}
          {provider.website && (
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 104 0 2 2 0 012-2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <a
                href={provider.website}
                className="truncate hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {provider.website}
              </a>
            </div>
          )}
          {provider.email && (
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <a
                href={`mailto:${provider.email}`}
                className="text-blue-600 hover:underline"
              >
                {provider.email}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Operating Hours Section */}
      {provider.operatingHours && (
        <div>
          <h2 className="text-md mb-1 font-bold">Operating Hours</h2>
          <VStack alignItems="flex-start" gap={0}>
            {provider.operatingHours.map((hour, index) => (
              <Text key={index} className="text-gray-700">
                {hour}
              </Text>
            ))}
          </VStack>
        </div>
      )}

      {/* Reviews Section */}
      <div className="mt-1">
        <ReviewSection
          reviews={provider.reviews}
          googleRating={provider.rating}
          numOfGoogleRatings={provider.userRatingCount}
        />
      </div>
    </div>
  );
}

function ReviewDetailDrawer({ review }: { review: Review }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
      <Drawer.Trigger>
        <span className="line-clamp-4 text-left text-sm leading-tight">
          {review.content}
        </span>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 max-h-full bg-white outline-none">
          <Drawer.Handle className="my-2" />
          <div className="max-h-screen flex-1 gap-4 overflow-y-auto bg-white px-8 py-8 pt-6">
            <Button
              colorScheme="white"
              variant="link"
              aria-label="Close drawer"
              leftIcon={<ArrowLeft size={16} />}
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Back
            </Button>
            <VisuallyHidden>
              <Drawer.Title className="text-xl font-semibold">
                Review by {review.authorName}
              </Drawer.Title>
            </VisuallyHidden>
            <div className="flex flex-col gap-2">
              <span className="text-lg font-semibold">
                Review from {review.authorName}
              </span>
              <div className="flex gap-2">
                <Rating
                  readOnly
                  value={review.overallRating}
                  className="max-w-24"
                />
                <span className="text-sm">
                  {getRelativeTime(review.publishedTime)}
                </span>
              </div>
              <span>{review.content}</span>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

const getRelativeTime = (date: string) => {
  return moment.utc(date).local().fromNow();
};

function ReviewSection({
  reviews,
  googleRating,
  numOfGoogleRatings,
}: {
  reviews: Review[];
  googleRating: number;
  numOfGoogleRatings: number;
}) {
  const sortedReviews = reviews.sort((a, b) => {
    return (
      new Date(b.publishedTime).getTime() - new Date(a.publishedTime).getTime()
    );
  });

  const reviewCount = reviews.length;

  return (
    <section className="-mx-6 flex flex-col gap-1 bg-white">
      <div className="px-6">
        <h1 className="text-xl font-semibold">Reviews</h1>
        {reviewCount > 0 && (
          <div className="mt-3 flex place-items-center gap-4">
            <h3 className="text-5xl font-bold">{googleRating.toFixed(1)}</h3>
            <Rating readOnly value={googleRating} className="max-w-36" />
          </div>
        )}
      </div>
      <div className="px-6">
        <div className="flex flex-col divide-y divide-solid">
          {reviewCount && numOfGoogleRatings > reviewCount && (
            <span className="mt-2 text-sm italic text-gray-500">
              Showing 5 most recent Google reviews
            </span>
          )}
          {sortedReviews.map((review, index) => (
            <div key={index} className="flex flex-col gap-2 py-4">
              <span className="font-semibold">{review.authorName}</span>
              <div className="flex gap-2">
                <Rating
                  readOnly
                  value={review.overallRating}
                  className="max-w-24"
                />
                <span className="text-sm">
                  {getRelativeTime(review.publishedTime)}
                </span>
              </div>
              <ReviewDetailDrawer review={review} />
              {review.reviewSource !== ReviewSource.IN_APP && (
                <span className="text-sm text-gray-500">
                  This review is from {mapReviewSource(review.reviewSource)}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
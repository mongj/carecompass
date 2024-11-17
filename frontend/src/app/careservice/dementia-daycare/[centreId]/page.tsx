"use client";

import { DDCDetail } from "@/types/ddc";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  VisuallyHidden,
} from "@chakra-ui/react";
import {
  Button,
  FormLabel,
  Textarea,
  Checkbox,
} from "@opengovsg/design-system-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/ui/loading";
import Slider from "react-slick";
import CustomMarkdown from "@/ui/CustomMarkdown";
import { SignInButton, useAuth, useUser } from "@clerk/nextjs";
import { api } from "@/api";
import { Rating } from "@smastrom/react-rating";
import {
  Review,
  ReviewCreate,
  ReviewSource,
  ReviewTargetType,
} from "@/types/review";
import moment from "moment";
import { Drawer } from "vaul";
import { ArrowLeft } from "lucide-react";
import { mapReviewSource } from "@/util/review";
import { constructAddress } from "@/util/address";

export default function DaycareCentreDetails({
  params,
}: {
  params: { centreId: number };
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [centre, setCentre] = useState<DDCDetail>();

  useEffect(() => {
    api
      .get(`/services/dementia-daycare/${params.centreId}`)
      .then((response) => {
        setCentre(response.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [params.centreId]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!centre) {
    // TODO: log error to sentry, and fix placeholder text
    return <div>Centre not found</div>;
  }

  // TODO: move all constant strings to a separate data file
  const applicationDetails =
    "- You will need to get a referral from a hospital, polyclinic or GP who is familiar with your loved ones’ condition and needs. You may also contact the service provider for a discussion. \n\n - For further assistance, contact the Agency for Integrated Care (AIC) at [1800 650 6060](tel:18006506060), email [enquiries@aic.sg](mailto:enquiries@aic.sg) or walk in to a nearby [AIC Link](https://www.aic.sg/about-us/aic-link-locations/).";

  return (
    <section className="flex flex-col gap-4 bg-white p-6">
      {centre.photos && <PhotoSlider photos={centre.photos} />}
      <h1 className="text-xl font-semibold">{centre.name}</h1>
      {centre.reviewCount > 0 && (
        <div className="flex gap-2">
          <Rating readOnly value={centre.averageRating} className="max-w-24" />
          <span>(from {centre.reviewCount} reviews)</span>
        </div>
      )}
      <Accordion allowToggle>
        <AccordionItem>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              How to apply?
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <CustomMarkdown content={applicationDetails} />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <span>
            <b>Operating hours: </b>
          </span>
          <span>{centre.operatingHours.join(", \n")}</span>
        </div>
        <div className="my-2 flex flex-col gap-2">
          <span className="text-lg">
            <b>Contact Details</b>
          </span>
          <div className="flex flex-col gap-2">
            {centre.phone && (
              <span>
                <b>Phone: </b>
                <a
                  href={`tel:+65${centre.phone}`}
                  target="_blank"
                  className="text-blue-500 underline"
                >
                  {centre.phone}
                </a>
              </span>
            )}
            {centre.email && (
              <span>
                <b>Email: </b>
                <a
                  href={`mailto:${centre.email}`}
                  target="_blank"
                  className="text-blue-500 underline"
                >
                  {centre.email}
                </a>
              </span>
            )}
            {centre.website && (
              <span>
                <b>Website: </b>
                <a
                  href={centre.website}
                  target="_blank"
                  className="text-blue-500 underline"
                >
                  {centre.website}
                </a>
              </span>
            )}
          </div>
        </div>
        <div className="my-2 flex flex-col gap-2">
          <span className="text-lg">
            <b>Address</b>
          </span>
          <div className="flex flex-col">
            {constructAddress(
              centre.postalCode,
              centre.block,
              centre.streetName,
              centre.buildingName,
              centre.unitNo,
            )}
          </div>
        </div>
      </div>
      <div id="embed-map-canvas" className="w-full">
        <iframe
          // api key from https://www.embed-map.com/
          src={`https://www.google.com/maps/embed/v1/place?q=${centre.name.replace(" ", "+")}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`}
          allowFullScreen
          className="h-96 w-full rounded-md border border-gray-200 shadow"
        />
      </div>
      <ReviewSection centreId={params.centreId} reviews={centre.reviews} />
    </section>
  );
}

// TODO: use a better carousel library
function PhotoSlider({ photos }: { photos: string[] }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <>
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
      />
      <Slider {...settings} className="mb-6">
        {photos.map((photo, index) => (
          <Image
            key={index}
            src={photo}
            alt="ds"
            width={400}
            height={200}
            className="max-h-48 rounded-md"
          />
        ))}
      </Slider>
    </>
  );
}

function NewReviewDrawer({ centreId }: { centreId: number }) {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeclarationChecked, setIsDeclarationChecked] = useState(false);
  const [review, setReview] = useState<ReviewCreate>({
    review_source: ReviewSource.IN_APP,
    target_id: centreId,
    target_type: ReviewTargetType.DEMENTIA_DAY_CARE,
    overall_rating: 0,
    author_name: user?.fullName || "Anonymous",
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
      <Drawer.Trigger>
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
                used the daycare service, as we value genuine reviews only.
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

const getRelativeTime = (date: string) => {
  return moment.utc(date).local().fromNow();
};

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

function ReviewSection({
  centreId,
  reviews,
}: {
  centreId: number;
  reviews: Review[];
}) {
  const auth = useAuth();

  const sortedReviews = reviews.sort((a, b) => {
    return (
      new Date(b.publishedTime).getTime() - new Date(a.publishedTime).getTime()
    );
  });

  const reviewCount = reviews.length;
  const averageRating =
    reviews.reduce((acc, review) => acc + review.overallRating, 0) /
    reviewCount;

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Reviews</h1>
      {reviewCount > 0 && (
        <div className="flex place-items-center gap-4">
          <h3 className="text-5xl font-bold">{averageRating.toFixed(1)}</h3>
          <Rating readOnly value={averageRating} className="max-w-36" />
          {/* <span>(from {reviewCount} reviews)</span> */}
        </div>
      )}
      {auth.isSignedIn ? (
        <NewReviewDrawer centreId={centreId} />
      ) : (
        <SignInButton>
          <Button variant="solid" colorScheme="blue">
            Sign in to leave a review
          </Button>
        </SignInButton>
      )}
      <div className="flex flex-col divide-y divide-solid">
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
    </section>
  );
}

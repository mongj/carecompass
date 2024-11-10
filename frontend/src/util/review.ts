import { ReviewSource } from "@/types/review";

export function mapReviewSource(source: ReviewSource): string {
  switch (source) {
    case ReviewSource.GOOGLE:
      return "Google";
    case ReviewSource.IN_APP:
      return "In-app";
  }
}

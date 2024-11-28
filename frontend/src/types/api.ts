import { ReviewTargetType, ReviewSource } from "./review";

export interface GetReviewsParams {
  targetType: ReviewTargetType;
  targetId: number;
  limit: number;
  skip?: number;
  reviewSource?: ReviewSource;
}

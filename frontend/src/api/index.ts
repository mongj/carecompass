import { GetReviewsParams } from "@/types/api";
import { Review } from "@/types/review";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_BACKEND_URL,
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

export const getReviews = async ({
  targetType,
  targetId,
  skip = 0,
  limit = 100,
  reviewSource,
}: GetReviewsParams): Promise<Review[]> => {
  if (skip < 0) throw new Error("skip must be a non-negative number");
  if (limit <= 0) throw new Error("limit must be a positive number");

  const params = {
    skip: skip.toString(),
    limit: limit.toString(),
    target_id: targetId.toString(),
    ...(targetType && { target_type: targetType }),
    ...(reviewSource && { review_source: reviewSource }),
  };

  try {
    const { data } = await api.get<Review[]>("/reviews", { params });
    return data;
  } catch (error) {
    throw new Error(
      `Failed to fetch reviews: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};

export { api };

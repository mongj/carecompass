import { ReviewTargetType } from "./review";

export interface Bookmark {
  id: number;
  userId: string;
  targetId: number;
  targetType: ReviewTargetType;
  title: string;
  link: string;
}

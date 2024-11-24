import { ReviewSource, ReviewTargetType } from "@/types/review";
import { TagProps } from "@chakra-ui/react";

export function mapReviewSource(source: ReviewSource): string {
  switch (source) {
    case ReviewSource.GOOGLE:
      return "Google";
    case ReviewSource.IN_APP:
      return "In-app";
  }
}

export function ReviewTargetTypeToName(type: ReviewTargetType): string {
  switch (type) {
    case ReviewTargetType.DEMENTIA_DAY_CARE:
      return "Day Care";
    case ReviewTargetType.DEMENTIA_HOME_CARE:
      return "Home Care";
  }
}

export function ReviewTargetTypeToColorScheme(
  type: ReviewTargetType,
): TagProps["colorScheme"] {
  switch (type) {
    case ReviewTargetType.DEMENTIA_DAY_CARE:
      return "blue";
    case ReviewTargetType.DEMENTIA_HOME_CARE:
      return "green";
  }
}

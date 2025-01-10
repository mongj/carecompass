import { getRatingColor } from "@/util/helper";
import { Rating } from "@smastrom/react-rating";

function ReviewScore({
  rating,
  reviewCount,
}: {
  rating: number;
  reviewCount: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div
          className="rounded p-2 text-xl font-semibold text-white"
          style={{
            backgroundColor: getRatingColor(rating),
          }}
        >
          {rating?.toFixed(1) || "N/A"}
        </div>
      </div>
      <div className="flex flex-col">
        <Rating readOnly value={rating} className="max-w-24" />
        <span>(from {reviewCount} reviews)</span>
      </div>
    </div>
  );
}

export default ReviewScore;

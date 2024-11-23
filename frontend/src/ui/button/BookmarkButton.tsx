import { api } from "@/api";
import { Bookmark } from "@/types/bookmark";
import { ReviewTargetType } from "@/types/review";
import { useAuth } from "@clerk/nextjs";
import {
  Button,
  ButtonProps,
  IconButton,
} from "@opengovsg/design-system-react";
import { BookmarkIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface BookmarkButtonProps extends ButtonProps {
  targetId: number;
  targetType: ReviewTargetType;
  title: string;
  link?: string;
  mini?: boolean;
}

const UNCREATED_BOOKMARK_ID = -1;

export default function BookmarkButton({
  targetId,
  targetType,
  title,
  link,
  mini = false,
  ...props
}: BookmarkButtonProps) {
  const auth = useAuth();
  const pathname = usePathname();

  if (!link) {
    link = pathname;
  }

  const [bookmarkId, setBookmarkId] = useState(UNCREATED_BOOKMARK_ID);

  useEffect(() => {
    if (auth.userId) {
      api
        .get(
          `/bookmarks?user_id=${auth.userId}&target_id=${targetId}&target_type=${targetType}`,
        )
        .then((res) => {
          const data = res.data as Bookmark[];
          if (data.length > 0) {
            setBookmarkId(data[0].id);
          }
        });
    }
  }, [auth.userId, targetId, targetType]);

  if (!auth.userId) {
    return null;
  }

  const isMarked = bookmarkId !== UNCREATED_BOOKMARK_ID;

  const handleMark = () => {
    const bookmarkToCreate: Omit<Bookmark, "id"> = {
      userId: auth.userId,
      targetId,
      targetType,
      title,
      link,
    };

    api.post("/bookmarks", bookmarkToCreate).then((res) => {
      setBookmarkId(res.data.id);
      toast.success("Added to saved searches");
    });
  };

  const handleUnmark = () => {
    api.delete(`/bookmarks/${bookmarkId}`).then(() => {
      setBookmarkId(UNCREATED_BOOKMARK_ID);
      toast.success("Removed from saved searches");
    });
  };

  return mini ? (
    <IconButton
      {...props}
      aria-label="Save this page"
      onClick={isMarked ? handleUnmark : handleMark}
      leftIcon={
        <BookmarkIcon size={16} fill={isMarked ? "currentColor" : "none"} />
      }
    />
  ) : (
    <Button
      {...props}
      leftIcon={
        <BookmarkIcon size={16} fill={isMarked ? "currentColor" : "none"} />
      }
      aria-label="Save this page"
      onClick={isMarked ? handleUnmark : handleMark}
    >
      {isMarked ? "Saved" : "Save"}
    </Button>
  );
}

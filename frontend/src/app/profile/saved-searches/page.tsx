"use client";

import { api } from "@/api";
import { Bookmark } from "@/types/bookmark";
import {
  ReviewTargetTypeToColorScheme,
  ReviewTargetTypeToName,
} from "@/util/review";
import { useAuth } from "@clerk/nextjs";
import { Tag } from "@chakra-ui/react";
import { ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SavedSearchesPage() {
  const auth = useAuth();
  const router = useRouter();

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    if (!auth.userId) return;

    api.get(`/bookmarks?userId=${auth.userId}`).then((res) => {
      setBookmarks(res.data);
    });
  }, [auth.userId]);

  useEffect(() => {
    router.prefetch("/careservice/homecare/[homecareId]");
    router.prefetch("/careservice/dementia-daycare/[centreId]");
  }, [router]);

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <h1 className="text-2xl font-semibold">Saved Searches</h1>
      <section className="flex flex-col gap-2">
        {bookmarks.map((bookmark) => (
          <BookmarkCard key={bookmark.id} bookmark={bookmark} />
        ))}
      </section>
    </div>
  );
}

function BookmarkCard({ bookmark }: { bookmark: Bookmark }) {
  const router = useRouter();

  return (
    <button
      className="flex w-full gap-2 rounded-lg border border-gray-200 bg-white p-4 align-middle transition-all duration-150 hover:bg-gray-50"
      onClick={() => {
        router.push(bookmark.link);
      }}
    >
      <div className="flex w-full flex-col gap-2">
        <Tag
          size="xs"
          colorScheme={ReviewTargetTypeToColorScheme(bookmark.targetType)}
        >
          {ReviewTargetTypeToName(bookmark.targetType)}
        </Tag>
        <span className="w-full text-left font-semibold leading-tight">
          {bookmark.title}
        </span>
      </div>
      <ChevronRightIcon size={24} className="place-self-center" />
    </button>
  );
}

import { useEffect, useState } from "react";
import type { Bookmark } from "./lib/types";
import { bookmarksApi } from "./lib/messaging";

// Lazily fetches bookmarks the first time user enters /book mode. Returns null while loading.
// browser already keeps bookmarks in memory, so the one fetch is cheap.
export function useBookmarks(active: boolean) {
  const [bookmarks, setBookmarks] = useState<Bookmark[] | null>(null);

  useEffect(() => {
    if (active && bookmarks === null) {
      bookmarksApi.getAll().then(setBookmarks);
    }
  }, [active, bookmarks]);

  return bookmarks;
}

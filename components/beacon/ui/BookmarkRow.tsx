import type { Bookmark } from "../lib/types";
import { ResultRow } from "./ResultRow";
import { BookmarkIcon } from "../lib/icons";
import { getDomain } from "../lib/utils";

interface BookmarkRowProps {
  bookmark: Bookmark;
  selected: boolean;
  onSelect: () => void;
  onHover: () => void;
}

export function BookmarkRow({ bookmark, selected, onSelect, onHover }: BookmarkRowProps) {
  return (
    <li>
      <ResultRow
        selected={selected}
        onSelect={onSelect}
        onHover={onHover}
        icon={BookmarkIcon}
        title={bookmark.title}
        subtitle={getDomain(bookmark.url)}
      />
    </li>
  );
}

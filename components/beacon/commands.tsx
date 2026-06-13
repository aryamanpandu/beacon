import type { BeaconCommand } from "./types";
import { BookmarkIcon, HistoryIcon } from "./icons";

// Type "/" in the search to bring these up. The actual bookmark/history search
// logic is NOT implemented yet — selecting a command just enters its mode and
// shows a placeholder. Wiring up the data sources comes later.
export const COMMANDS: BeaconCommand[] = [
  {
    id: "book",
    trigger: "/book",
    label: "Bookmarks",
    description: "Search your bookmarks",
    placeholder: "Search bookmarks…",
    icon: BookmarkIcon,
  },
  {
    id: "hist",
    trigger: "/hist",
    label: "History",
    description: "Search your browsing history",
    placeholder: "Search history…",
    icon: HistoryIcon,
  },
];

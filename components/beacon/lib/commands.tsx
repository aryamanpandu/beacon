import type { BeaconCommand } from "./types";
import { BookmarkIcon, HistoryIcon, CoffeeIcon } from "./icons";

const SUPPORT_URL = "https://buymeacoffee.com/aryamanpandey";

// Type "/" in the search to bring these up. Search commands (book, hist) enter a
// filterable mode; action commands (those with a `url`) open a link and close.
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
  {
    id: "coffee",
    trigger: "/coffee",
    label: "Buy me a coffee",
    description: "Support Beacon's development",
    placeholder: "",
    icon: CoffeeIcon,
    url: SUPPORT_URL,
  },
];

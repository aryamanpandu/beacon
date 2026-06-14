import { useEffect, useMemo, useState } from "react";
import type { Tab } from "./lib/types";
import { tabsApi } from "./lib/messaging";
import { sortTabsFocusedLast } from "./lib/utils";

// Fetches the open tabs once on mount and derives window metadata. Filtering by
// the search query stays in the component since it depends on input state.
export function useTabs() {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [focusedWindowId, setFocusedWindowId] = useState<number | null>(null);

  useEffect(() => {
    tabsApi.getTabs().then((res) => {
      setFocusedWindowId(res.focusedWindowId);
      setTabs(sortTabsFocusedLast(res.tabs, res.focusedWindowId));
    });
  }, []);

  // Stable W1/W2/W3… labels keyed by windowId (sorted so numbering is consistent)
  const windowNumbers = useMemo(() => {
    const ids = [...new Set(tabs.map((t) => t.windowId))].sort((a, b) => a - b);
    return new Map(ids.map((id, i) => [id, i + 1]));
  }, [tabs]);

  const removeTab = (id: number) => setTabs((prev) => prev.filter((t) => t.id !== id));

  return {
    tabs,
    focusedWindowId,
    windowNumbers,
    multiWindow: windowNumbers.size > 1,
    removeTab,
  };
}

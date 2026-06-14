import type { Tab } from "./types";

export function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

// You're usually hunting for a tab you can't see — sink the focused window's
// tabs to the bottom so the rest surface first.
export function sortTabsFocusedLast(tabs: Tab[], focusedWindowId: number | null): Tab[] {
  return [...tabs].sort((a, b) => {
    const af = a.windowId === focusedWindowId ? 1 : 0;
    const bf = b.windowId === focusedWindowId ? 1 : 0;
    return af - bf;
  });
}

export function matchesTab(tab: Tab, query: string): boolean {
  return (
    tab.title.toLowerCase().includes(query) ||
    getDomain(tab.url).toLowerCase().includes(query)
  );
}

// Client-side substring filter for bookmark/history lists (matches title or URL)
export function filterLinks<T extends { title: string; url: string }>(
  items: T[] | null,
  query: string
): T[] {
  if (!items) return [];
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter((i) => i.title.toLowerCase().includes(q) || i.url.toLowerCase().includes(q));
}

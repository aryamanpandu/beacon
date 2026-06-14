import { useEffect, useState } from "react";

// Fetches a list the first time `active` becomes true, then keeps it. Used for
// the bookmark and history modes - both load lazily on entry and only once.
// Returns null while loading. No caching layer: the browser already holds this
// data in memory, so a single fetch per mode is cheap.
export function useLazyList<T>(active: boolean, fetcher: () => Promise<T[]>) {
  const [items, setItems] = useState<T[] | null>(null);

  useEffect(() => {
    if (active && items === null) {
      fetcher().then(setItems);
    }
  }, [active, items, fetcher]);

  return items;
}

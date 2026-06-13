import React, { useCallback, useEffect, useRef, useState } from "react";

interface Tab {
  id: number;
  title: string;
  url: string;
  favIconUrl: string;
  windowId: number;
  active: boolean;
}

interface TabSearchProps {
  onClose: () => void;
}

function getFavicon(tab: Tab): string | null {
  if (tab.favIconUrl && !tab.favIconUrl.startsWith("chrome://")) {
    return tab.favIconUrl;
  }
  return null;
}

function FaviconOrFallback({ tab }: { tab: Tab }) {
  const [errored, setErrored] = useState(false);
  const src = getFavicon(tab);

  if (!src || errored) {
    return (
      <div className="w-4 h-4 rounded-sm bg-slate-600 flex items-center justify-center flex-shrink-0">
        <svg className="w-2.5 h-2.5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14.4A6.4 6.4 0 1110 3.6a6.4 6.4 0 010 12.8z" />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={src}
      className="w-4 h-4 rounded-sm flex-shrink-0 object-contain"
      onError={() => setErrored(true)}
      alt=""
    />
  );
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function TabSearch({ onClose }: TabSearchProps) {
  const [query, setQuery] = useState("");
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [filtered, setFiltered] = useState<Tab[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Fetch tabs on mount
  useEffect(() => {
    browser.runtime.sendMessage({ type: "GET_TABS" }).then((res: { tabs: Tab[] }) => {
      setTabs(res.tabs);
      setFiltered(res.tabs);
    });
    inputRef.current?.focus();
  }, []);

  // Filter tabs when query changes
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setFiltered(tabs);
    } else {
      setFiltered(
        tabs.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            getDomain(t.url).toLowerCase().includes(q)
        )
      );
    }
    setSelectedIndex(0);
  }, [query, tabs]);

  // Scroll selected item into view
  useEffect(() => {
    const item = listRef.current?.children[selectedIndex] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  const switchToTab = useCallback(
    (tab: Tab) => {
      browser.runtime.sendMessage({ type: "SWITCH_TAB", tabId: tab.id, windowId: tab.windowId });
      onClose();
    },
    [onClose]
  );

  const closeTab = useCallback(
    (tab: Tab, e: React.MouseEvent) => {
      e.stopPropagation();
      browser.runtime.sendMessage({ type: "CLOSE_TAB", tabId: tab.id });
      setTabs((prev) => prev.filter((t) => t.id !== tab.id));
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((i) => Math.max(i - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (filtered[selectedIndex]) switchToTab(filtered[selectedIndex]);
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    },
    [filtered, selectedIndex, switchToTab, onClose]
  );

  return (
    <div
      className="fixed inset-0 z-[2147483647] flex items-start justify-center pt-[12vh] px-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(2px)" }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-xl rounded-xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: "#1e2533", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        {/* Search input */}
        <div className="flex items-center px-4 py-3 border-b border-white/10">
          <svg
            className="w-4 h-4 text-slate-400 mr-3 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search tabs…"
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 text-sm outline-none"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="text-xs text-slate-500 border border-slate-600 rounded px-1.5 py-0.5 ml-2">
            esc
          </kbd>
        </div>

        {/* Results */}
        <ul
          ref={listRef}
          className="overflow-y-auto max-h-[380px] py-1"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#3f4a5e transparent" }}
        >
          {filtered.length === 0 && (
            <li className="px-4 py-8 text-center text-slate-500 text-sm">No tabs found</li>
          )}
          {filtered.map((tab, i) => (
            <li key={tab.id}>
              <button
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors group ${
                  i === selectedIndex
                    ? "bg-slate-600/60"
                    : "hover:bg-slate-700/40"
                }`}
                onMouseEnter={() => setSelectedIndex(i)}
                onClick={() => switchToTab(tab)}
              >
                <FaviconOrFallback tab={tab} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-slate-100 truncate leading-snug">
                    {tab.title}
                  </div>
                  <div className="text-xs text-slate-500 truncate leading-snug mt-0.5">
                    {getDomain(tab.url)}
                  </div>
                </div>
                {tab.active && (
                  <span className="text-xs text-emerald-400/80 font-medium flex-shrink-0 mr-1">
                    current
                  </span>
                )}
                <button
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-500/50 text-slate-400 hover:text-slate-200 transition-all flex-shrink-0"
                  onClick={(e) => closeTab(tab, e)}
                  title="Close tab"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </button>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="flex items-center gap-4 px-4 py-2 border-t border-white/5">
          <span className="text-xs text-slate-600">
            {filtered.length} {filtered.length === 1 ? "tab" : "tabs"}
          </span>
          <div className="ml-auto flex items-center gap-3 text-xs text-slate-600">
            <span><kbd className="font-mono">↑↓</kbd> navigate</span>
            <span><kbd className="font-mono">↵</kbd> switch</span>
            <span><kbd className="font-mono">esc</kbd> close</span>
          </div>
        </div>
      </div>
    </div>
  );
}

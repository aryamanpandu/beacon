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

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function FaviconOrFallback({ tab }: { tab: Tab }) {
  const [errored, setErrored] = useState(false);
  const src = tab.favIconUrl && !tab.favIconUrl.startsWith("chrome://") ? tab.favIconUrl : null;

  if (!src || errored) {
    return (
      <div style={{ background: "rgba(245,200,66,0.12)", border: "1px solid rgba(245,200,66,0.18)" }}
        className="w-[18px] h-[18px] rounded flex items-center justify-center flex-shrink-0">
        <svg className="w-2.5 h-2.5" fill="none" stroke="#f5c842" strokeWidth={2} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
        </svg>
      </div>
    );
  }

  return (
    <img src={src} className="w-[18px] h-[18px] rounded flex-shrink-0 object-contain"
      onError={() => setErrored(true)} alt="" />
  );
}

// Lighthouse beam SVG used in the empty/header area
function BeaconLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L12 8" stroke="#f5c842" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 8L7 20H17L12 8Z" stroke="#f5c842" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 20H15" stroke="#f5c842" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 8L4 5" stroke="#f5c842" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M12 8L20 5" stroke="#f5c842" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M12 8L2 10" stroke="#f5c842" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
      <path d="M12 8L22 10" stroke="#f5c842" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

export default function TabSearch({ onClose }: TabSearchProps) {
  const [query, setQuery] = useState("");
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [filtered, setFiltered] = useState<Tab[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    browser.runtime.sendMessage({ type: "GET_TABS" }).then((res: { tabs: Tab[] }) => {
      setTabs(res.tabs);
      setFiltered(res.tabs);
    });
    // Small delay so shadow DOM is fully painted before focusing
    setTimeout(() => inputRef.current?.focus(), 30);
  }, []);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    const results = !q
      ? tabs
      : tabs.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            getDomain(t.url).toLowerCase().includes(q)
        );
    setFiltered(results);
    setSelectedIndex(0);
  }, [query, tabs]);

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

  const closeTab = useCallback((tab: Tab, e: React.MouseEvent) => {
    e.stopPropagation();
    browser.runtime.sendMessage({ type: "CLOSE_TAB", tabId: tab.id });
    setTabs((prev) => prev.filter((t) => t.id !== tab.id));
  }, []);

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
      className="fixed inset-0 flex items-start justify-center pt-[11vh] px-4"
      style={{ backgroundColor: "rgba(1, 3, 9, 0.88)", backdropFilter: "blur(3px)", zIndex: 2147483647 }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-xl overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #060e1c 0%, #030810 100%)",
          border: "1px solid rgba(245,200,66,0.18)",
          borderRadius: "14px",
          boxShadow: "0 0 0 1px rgba(245,200,66,0.06), 0 32px 64px rgba(1,3,9,0.85), 0 0 80px rgba(245,200,66,0.04)",
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: "1px solid rgba(245,200,66,0.10)" }}>
          <BeaconLogo />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search tabs…"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#e2eaf4",
              fontSize: "14px",
              caretColor: "#f5c842",
            }}
            autoComplete="off"
            spellCheck={false}
          />
          <kbd style={{
            fontSize: "11px",
            color: "#4e6a8a",
            border: "1px solid rgba(245,200,66,0.12)",
            borderRadius: "5px",
            padding: "2px 7px",
            fontFamily: "monospace",
            background: "rgba(245,200,66,0.04)",
          }}>
            esc
          </kbd>
        </div>

        {/* Results */}
        <ul
          ref={listRef}
          className="overflow-y-auto"
          style={{
            maxHeight: "380px",
            padding: "4px 0",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(245,200,66,0.15) transparent",
          }}
        >
          {filtered.length === 0 && (
            <li style={{ padding: "40px 16px", textAlign: "center", color: "#4e6a8a", fontSize: "13px" }}>
              No tabs found
            </li>
          )}
          {filtered.map((tab, i) => {
            const selected = i === selectedIndex;
            return (
              <li key={tab.id}>
                <button
                  className="w-full flex items-center gap-3 text-left group"
                  style={{
                    padding: "9px 16px",
                    background: selected ? "rgba(245,200,66,0.08)" : "transparent",
                    borderLeft: selected ? "2px solid rgba(245,200,66,0.6)" : "2px solid transparent",
                    transition: "background 0.1s, border-color 0.1s",
                    cursor: "pointer",
                    border: "none",
                    width: "100%",
                    borderLeft: selected ? "2px solid rgba(245,200,66,0.55)" : "2px solid transparent",
                  }}
                  onMouseEnter={() => setSelectedIndex(i)}
                  onClick={() => switchToTab(tab)}
                >
                  <FaviconOrFallback tab={tab} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: "13px",
                      color: selected ? "#f0e6b8" : "#c8d8ec",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      lineHeight: "1.4",
                    }}>
                      {tab.title}
                    </div>
                    <div style={{
                      fontSize: "11px",
                      color: "#2e4a66",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      lineHeight: "1.4",
                      marginTop: "1px",
                    }}>
                      {getDomain(tab.url)}
                    </div>
                  </div>
                  {tab.active && (
                    <span style={{
                      fontSize: "10px",
                      color: "#f5c842",
                      fontWeight: 500,
                      flexShrink: 0,
                      letterSpacing: "0.04em",
                      opacity: 0.8,
                    }}>
                      NOW
                    </span>
                  )}
                  <button
                    style={{
                      opacity: 0,
                      padding: "3px",
                      borderRadius: "4px",
                      background: "transparent",
                      border: "none",
                      color: "#4e6a8a",
                      cursor: "pointer",
                      flexShrink: 0,
                      transition: "opacity 0.1s, color 0.1s",
                      display: "flex",
                      alignItems: "center",
                    }}
                    className="group-hover:!opacity-100 hover:!text-[#f5c842]"
                    onClick={(e) => closeTab(tab, e)}
                    title="Close tab"
                  >
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Footer */}
        <div className="flex items-center px-4 py-2" style={{ borderTop: "1px solid rgba(245,200,66,0.07)" }}>
          <span style={{ fontSize: "11px", color: "#2e4a66" }}>
            {filtered.length} {filtered.length === 1 ? "tab" : "tabs"}
          </span>
          <div style={{ marginLeft: "auto", display: "flex", gap: "14px", fontSize: "11px", color: "#2e4a66", fontFamily: "monospace" }}>
            <span>↑↓ navigate</span>
            <span>↵ switch</span>
            <span>esc close</span>
          </div>
        </div>
      </div>
    </div>
  );
}

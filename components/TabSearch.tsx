import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { BeaconCommand } from "./beacon/lib/types";
import { COMMANDS } from "./beacon/lib/commands";
import { tabsApi } from "./beacon/lib/messaging";
import { matchesTab } from "./beacon/lib/utils";
import { colors } from "./beacon/lib/theme";
import { BeaconLogo } from "./beacon/lib/icons";
import { TabRow } from "./beacon/ui/TabRow";
import { CommandRow } from "./beacon/ui/CommandRow";
import { BookmarkRow } from "./beacon/ui/BookmarkRow";
import { EmptyState } from "./beacon/ui/EmptyState";
import { useTabs } from "./beacon/useTabs";
import { useBookmarks } from "./beacon/useBookmarks";
import { useDraggable } from "./beacon/useDraggable";

interface TabSearchProps {
  onClose: () => void;
}

export default function TabSearch({ onClose }: TabSearchProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  // null = default tab search; otherwise we're inside a "/" command's mode
  const [activeCommand, setActiveCommand] = useState<BeaconCommand | null>(null);

  const { tabs, focusedWindowId, windowNumbers, multiWindow, removeTab } = useTabs();

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const { modalRef, isDragging, onDragStart } = useDraggable(
    { x: window.innerWidth / 2 - 288, y: window.innerHeight / 2 - 220 },
    () => inputRef.current?.focus() // restore focus after a drag
  );

  // ── Derived mode state ──
  // Command palette: no active command and the query starts with "/"
  const inCommandPalette = !activeCommand && query.startsWith("/");
  const commandResults = useMemo(
    () => (inCommandPalette ? COMMANDS.filter((c) => c.trigger.startsWith(query.toLowerCase())) : []),
    [inCommandPalette, query]
  );
  const filteredTabs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return !q ? tabs : tabs.filter((t) => matchesTab(t, q));
  }, [query, tabs]);

  // Bookmark mode: lazily load on entering /book, then filter client-side
  const inBookmarkMode = activeCommand?.id === "book";
  const bookmarks = useBookmarks(inBookmarkMode);
  const filteredBookmarks = useMemo(() => {
    if (!bookmarks) return [];
    const q = query.trim().toLowerCase();
    return !q
      ? bookmarks
      : bookmarks.filter((b) => b.title.toLowerCase().includes(q) || b.url.toLowerCase().includes(q));
  }, [bookmarks, query]);

  // How many selectable rows the arrow keys move through, given the current mode
  const navLength = inCommandPalette
    ? commandResults.length
    : inBookmarkMode
    ? filteredBookmarks.length
    : activeCommand
    ? 0
    : filteredTabs.length;

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 30);
  }, []);

  // Reset the highlight whenever the visible result set changes
  useEffect(() => setSelectedIndex(0), [query, activeCommand]);

  // Keep the highlighted row scrolled into view
  useEffect(() => {
    const item = listRef.current?.children[selectedIndex] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  // ── Actions ──
  const switchToTab = useCallback(
    (tab: (typeof tabs)[number]) => {
      tabsApi.switchTo(tab.id, tab.windowId);
      onClose();
    },
    [onClose]
  );

  const closeTab = useCallback(
    (tabId: number, e: React.MouseEvent) => {
      e.stopPropagation();
      tabsApi.close(tabId);
      removeTab(tabId);
    },
    [removeTab]
  );

  const openBookmark = useCallback(
    (url: string) => {
      tabsApi.openUrl(url);
      onClose();
    },
    [onClose]
  );

  const enterCommand = useCallback((cmd: BeaconCommand) => {
    setActiveCommand(cmd);
    setQuery("");
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  // Mode-aware dismiss: back out of a command first, otherwise close Beacon
  const dismiss = useCallback(() => {
    if (activeCommand) {
      setActiveCommand(null);
      setQuery("");
    } else {
      onClose();
    }
  }, [activeCommand, onClose]);

  // Fallback Escape handler for when the input isn't focused (e.g. mid-drag).
  // When the input IS focused, its own onKeyDown handles Escape and stops the
  // event before it reaches here — so this never double-fires.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [dismiss]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Keep keystrokes inside Beacon — otherwise page-level shortcuts (e.g.
      // Google's "/" to focus its search box) steal the key while we're typing.
      e.stopPropagation();
      switch (e.key) {
        case "Escape":
          e.preventDefault();
          dismiss();
          break;
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((i) => Math.min(i + 1, Math.max(navLength - 1, 0)));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((i) => Math.max(i - 1, 0));
          break;
        case "Tab":
          // In the palette, Tab autocompletes / selects the highlighted command
          if (inCommandPalette && commandResults[selectedIndex]) {
            e.preventDefault();
            enterCommand(commandResults[selectedIndex]);
          }
          break;
        case "Enter":
          e.preventDefault();
          if (inCommandPalette) {
            const cmd = commandResults[selectedIndex];
            if (cmd) enterCommand(cmd);
          } else if (inBookmarkMode) {
            const bookmark = filteredBookmarks[selectedIndex];
            if (bookmark) openBookmark(bookmark.url);
          } else if (activeCommand) {
            // /hist — not implemented yet
          } else if (filteredTabs[selectedIndex]) {
            switchToTab(filteredTabs[selectedIndex]);
          }
          break;
        case "Backspace":
          // Backspace on an empty query backs out of the active command mode
          if (activeCommand && query === "") {
            e.preventDefault();
            setActiveCommand(null);
          }
          break;
      }
    },
    [navLength, inCommandPalette, commandResults, inBookmarkMode, filteredBookmarks, openBookmark, activeCommand, query, selectedIndex, filteredTabs, switchToTab, enterCommand, dismiss]
  );

  const placeholder = activeCommand ? activeCommand.placeholder : "Search tabs, or type / for commands";

  return (
    <div
      className="fixed inset-0"
      style={{ backgroundColor: "rgba(1, 3, 9, 0.88)", backdropFilter: "blur(3px)", zIndex: 2147483647 }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "576px",
          // transform set imperatively by useDraggable — not driven by React state
          willChange: "transform",
          background: "linear-gradient(160deg, #060e1c 0%, #030810 100%)",
          border: "1px solid rgba(245,200,66,0.18)",
          borderRadius: "14px",
          boxShadow: "0 0 0 1px rgba(245,200,66,0.06), 0 32px 64px rgba(1,3,9,0.85), 0 0 80px rgba(245,200,66,0.04)",
          overflow: "hidden",
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header — also the drag handle */}
        <div
          className="flex items-center gap-3 px-4 py-3"
          style={{ borderBottom: "1px solid rgba(245,200,66,0.10)", cursor: "grab" }}
          onMouseDown={onDragStart}
        >
          <BeaconLogo />

          {activeCommand && (
            <span
              onMouseDown={(e) => e.stopPropagation()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "12px",
                color: colors.accent,
                background: "rgba(245,200,66,0.10)",
                border: "1px solid rgba(245,200,66,0.22)",
                borderRadius: "6px",
                padding: "2px 8px 2px 6px",
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ display: "inline-flex", width: "14px", height: "14px" }}>{activeCommand.icon}</span>
              {activeCommand.label}
            </span>
          )}

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onKeyUp={(e) => e.stopPropagation()}
            onKeyPress={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            placeholder={placeholder}
            style={{
              flex: 1,
              minWidth: 0,
              background: "transparent",
              border: "none",
              outline: "none",
              color: colors.textPrimary,
              fontSize: "14px",
              caretColor: colors.accent,
              cursor: "text",
            }}
            autoComplete="off"
            spellCheck={false}
          />

          <kbd
            style={{
              fontSize: "11px",
              color: colors.textMuted,
              border: "1px solid rgba(245,200,66,0.12)",
              borderRadius: "5px",
              padding: "2px 7px",
              fontFamily: "monospace",
              background: "rgba(245,200,66,0.04)",
            }}
          >
            esc
          </kbd>
        </div>

        {/* Results — pointer-events disabled while dragging to avoid hover recalcs */}
        <ul
          ref={listRef}
          className="overflow-y-auto"
          style={{
            maxHeight: "380px",
            padding: "4px 0",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(245,200,66,0.15) transparent",
            pointerEvents: isDragging ? "none" : "auto",
          }}
        >
          {/* Mode 1: command palette (typing "/") */}
          {inCommandPalette &&
            (commandResults.length === 0 ? (
              <EmptyState title="No matching command" />
            ) : (
              commandResults.map((cmd, i) => (
                <CommandRow
                  key={cmd.id}
                  command={cmd}
                  selected={i === selectedIndex}
                  onSelect={() => enterCommand(cmd)}
                  onHover={() => setSelectedIndex(i)}
                />
              ))
            ))}

          {/* Mode 2a: bookmark search */}
          {inBookmarkMode &&
            (bookmarks === null ? (
              <EmptyState title="Loading bookmarks…" />
            ) : filteredBookmarks.length === 0 ? (
              <EmptyState title="No bookmarks found" />
            ) : (
              filteredBookmarks.map((bookmark, i) => (
                <BookmarkRow
                  key={bookmark.id}
                  bookmark={bookmark}
                  selected={i === selectedIndex}
                  onSelect={() => openBookmark(bookmark.url)}
                  onHover={() => setSelectedIndex(i)}
                />
              ))
            ))}

          {/* Mode 2b: other commands not built yet (stub) */}
          {activeCommand && !inBookmarkMode && (
            <EmptyState
              title={`${activeCommand.label} search isn’t wired up yet`}
              subtitle="Coming soon — press esc to go back to tabs"
            />
          )}

          {/* Mode 3: default tab search */}
          {!inCommandPalette &&
            !activeCommand &&
            (filteredTabs.length === 0 ? (
              <EmptyState title="No tabs found" />
            ) : (
              filteredTabs.map((tab, i) => (
                <TabRow
                  key={tab.id}
                  tab={tab}
                  selected={i === selectedIndex}
                  onSelect={() => switchToTab(tab)}
                  onHover={() => setSelectedIndex(i)}
                  onClose={(e) => closeTab(tab.id, e)}
                  multiWindow={multiWindow}
                  windowNumber={windowNumbers.get(tab.windowId)}
                  isFocusedWindow={tab.windowId === focusedWindowId}
                />
              ))
            ))}
        </ul>

        {/* Footer */}
        <div className="flex items-center px-4 py-2" style={{ borderTop: "1px solid rgba(245,200,66,0.07)" }}>
          <span style={{ fontSize: "11px", color: colors.textFaint }}>
            {inCommandPalette
              ? "Commands"
              : inBookmarkMode
              ? `${filteredBookmarks.length} ${filteredBookmarks.length === 1 ? "bookmark" : "bookmarks"}`
              : activeCommand
              ? activeCommand.label
              : `${filteredTabs.length} ${filteredTabs.length === 1 ? "tab" : "tabs"}`}
          </span>
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              gap: "14px",
              fontSize: "11px",
              color: colors.textFaint,
              fontFamily: "monospace",
            }}
          >
            {inCommandPalette ? (
              <>
                <span>↑↓ navigate</span>
                <span>↵ select</span>
                <span>esc close</span>
              </>
            ) : inBookmarkMode ? (
              <>
                <span>↑↓ navigate</span>
                <span>↵ open</span>
                <span>esc back</span>
              </>
            ) : activeCommand ? (
              <span>⌫ / esc back</span>
            ) : (
              <>
                <span>↑↓ navigate</span>
                <span>↵ switch</span>
                <span>/ commands</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

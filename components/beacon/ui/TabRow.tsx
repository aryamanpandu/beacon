import type { MouseEvent } from "react";
import type { Tab } from "../lib/types";
import { ResultRow } from "./ResultRow";
import { Favicon } from "./Favicon";
import { CloseIcon } from "../lib/icons";
import { getDomain } from "../lib/utils";
import { colors } from "../lib/theme";

interface TabRowProps {
  tab: Tab;
  selected: boolean;
  onSelect: () => void;
  onHover: () => void;
  onClose: (e: MouseEvent) => void;
  multiWindow: boolean;
  windowNumber?: number;
  isFocusedWindow: boolean;
}

export function TabRow({
  tab,
  selected,
  onSelect,
  onHover,
  onClose,
  multiWindow,
  windowNumber,
  isFocusedWindow,
}: TabRowProps) {
  const trailing = (
    <>
      {multiWindow && (
        <span
          title={isFocusedWindow ? "This window" : `Window ${windowNumber}`}
          style={{
            fontSize: "10px",
            // Current window recedes (its tabs are sorted last); other windows
            // read more clearly — that's where you're looking.
            color: isFocusedWindow ? colors.textFaint : colors.textMuted,
            fontWeight: 500,
            flexShrink: 0,
            letterSpacing: "0.04em",
            opacity: isFocusedWindow ? 0.6 : 0.9,
            fontFamily: "monospace",
          }}
        >
          W{windowNumber}
        </span>
      )}
      <button
        style={{
          opacity: 0,
          padding: "3px",
          borderRadius: "4px",
          background: "transparent",
          border: "none",
          color: colors.textMuted,
          cursor: "pointer",
          flexShrink: 0,
          transition: "opacity 0.1s, color 0.1s",
          display: "flex",
          alignItems: "center",
        }}
        className="group-hover:!opacity-100 hover:!text-[#f5c842]"
        onClick={onClose}
        title="Close tab"
      >
        <CloseIcon />
      </button>
    </>
  );

  return (
    <li>
      <ResultRow
        selected={selected}
        onSelect={onSelect}
        onHover={onHover}
        icon={<Favicon tab={tab} />}
        title={tab.title}
        subtitle={getDomain(tab.url)}
        trailing={trailing}
      />
    </li>
  );
}

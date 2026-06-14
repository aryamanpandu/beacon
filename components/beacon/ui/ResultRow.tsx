import type { ReactNode } from "react";
import { colors } from "../lib/theme";

interface ResultRowProps {
  selected: boolean;
  onSelect: () => void;
  onHover: () => void;
  icon: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  trailing?: ReactNode;
  titleMono?: boolean;
}

// The shared selectable row used by both tab results and command autocomplete:
// left icon, title + optional subtitle, optional trailing slot, with the amber
// left-accent + highlight when selected. Adds the `group` class so trailing
// children can use group-hover styling.
export function ResultRow({
  selected,
  onSelect,
  onHover,
  icon,
  title,
  subtitle,
  trailing,
  titleMono,
}: ResultRowProps) {
  return (
    <button
      className="w-full flex items-center gap-3 text-left group"
      style={{
        padding: "9px 16px",
        background: selected ? colors.accentSoftBg : "transparent",
        borderLeft: selected ? `2px solid ${colors.accentBorder}` : "2px solid transparent",
        transition: "background 0.1s, border-color 0.1s",
        cursor: "pointer",
        border: "none",
        width: "100%",
      }}
      onMouseEnter={onHover}
      onClick={onSelect}
    >
      <span style={{ display: "inline-flex", flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: "13px",
            color: selected ? colors.textBright : colors.textBody,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            lineHeight: 1.4,
            fontFamily: titleMono ? "monospace" : undefined,
          }}
        >
          {title}
        </div>
        {subtitle != null && (
          <div
            style={{
              fontSize: "11px",
              color: colors.textFaint,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: 1.4,
              marginTop: "1px",
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
      {trailing}
    </button>
  );
}

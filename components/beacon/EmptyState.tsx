import { colors } from "./theme";

// Centered placeholder row — used for "no results" states and the not-yet-built
// command stub. As a direct <li> it stays consistent with keyboard scroll logic.
export function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <li style={{ padding: subtitle ? "44px 16px" : "40px 16px", textAlign: "center" }}>
      <div style={{ fontSize: "13px", color: subtitle ? "#6f8aa8" : colors.textMuted }}>{title}</div>
      {subtitle && (
        <div style={{ fontSize: "11px", color: colors.textFaint, marginTop: "5px" }}>{subtitle}</div>
      )}
    </li>
  );
}

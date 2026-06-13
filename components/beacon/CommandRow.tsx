import type { BeaconCommand } from "./types";
import { ResultRow } from "./ResultRow";
import { colors } from "./theme";

interface CommandRowProps {
  command: BeaconCommand;
  selected: boolean;
  onSelect: () => void;
  onHover: () => void;
}

export function CommandRow({ command, selected, onSelect, onHover }: CommandRowProps) {
  return (
    <li>
      <ResultRow
        selected={selected}
        onSelect={onSelect}
        onHover={onHover}
        icon={command.icon}
        title={command.trigger}
        titleMono
        subtitle={command.description}
        trailing={
          <kbd style={{ fontSize: "10px", color: colors.textMuted, fontFamily: "monospace", flexShrink: 0 }}>
            ↵
          </kbd>
        }
      />
    </li>
  );
}

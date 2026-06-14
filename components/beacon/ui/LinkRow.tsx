import type { ReactNode } from "react";
import { ResultRow } from "./ResultRow";
import { getDomain } from "../lib/utils";

interface LinkRowProps {
  title: string;
  url: string;
  icon: ReactNode;
  selected: boolean;
  onSelect: () => void;
  onHover: () => void;
}

// A single openable link - used for both bookmark and history results. The icon
// (bookmark ribbon vs history clock) is passed in by the caller.
export function LinkRow({ title, url, icon, selected, onSelect, onHover }: LinkRowProps) {
  return (
    <li>
      <ResultRow
        selected={selected}
        onSelect={onSelect}
        onHover={onHover}
        icon={icon}
        title={title}
        subtitle={getDomain(url)}
      />
    </li>
  );
}

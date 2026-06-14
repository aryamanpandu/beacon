import type { ReactNode } from "react";

export interface Tab {
  id: number;
  title: string;
  url: string;
  favIconUrl: string;
  windowId: number;
  active: boolean;
}

// A bookmark or history entry - both are just openable links of the same shape.
export interface LinkItem {
  id: string;
  title: string;
  url: string;
}

export interface BeaconCommand {
  id: string;
  trigger: string; // e.g. "/book"
  label: string; // mode pill label, e.g. "Bookmarks"
  description: string; // shown in the autocomplete row
  placeholder: string; // input placeholder once the mode is active
  icon: ReactNode;
  // Action commands: if set, selecting the command opens this URL and closes
  // Beacon, instead of entering a search mode.
  url?: string;
}

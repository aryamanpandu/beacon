import type { ReactNode } from "react";

export interface Tab {
  id: number;
  title: string;
  url: string;
  favIconUrl: string;
  windowId: number;
  active: boolean;
}

export interface BeaconCommand {
  id: string;
  trigger: string; // e.g. "/book"
  label: string; // mode pill label, e.g. "Bookmarks"
  description: string; // shown in the autocomplete row
  placeholder: string; // input placeholder once the mode is active
  icon: ReactNode;
}

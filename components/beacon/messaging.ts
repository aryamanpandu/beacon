import type { Tab } from "./types";

export interface GetTabsResponse {
  tabs: Tab[];
  focusedWindowId: number | null;
}

// Thin wrapper around the background message channel. The background script is
// the only context allowed to touch chrome.tabs / chrome.windows directly.
export const tabsApi = {
  getTabs: () => browser.runtime.sendMessage({ type: "GET_TABS" }) as Promise<GetTabsResponse>,
  switchTo: (tabId: number, windowId: number) =>
    browser.runtime.sendMessage({ type: "SWITCH_TAB", tabId, windowId }),
  close: (tabId: number) => browser.runtime.sendMessage({ type: "CLOSE_TAB", tabId }),
};

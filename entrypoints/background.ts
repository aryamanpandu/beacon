export default defineBackground(() => {
  // When the command shortcut is triggered, tell the active tab to open the overlay.
  // Won't work on restricted pages (chrome://, New Tab, Web Store) — that's expected.
  browser.commands.onCommand.addListener(async (command) => {
    if (command !== "open-tab-search") return;

    const [activeTab] = await browser.tabs.query({ active: true, currentWindow: true });
    if (!activeTab?.id) return;

    browser.tabs.sendMessage(activeTab.id, { type: "TOGGLE_TAB_SEARCH" }).catch(() => {});
  });

  // Handle tab data + actions requested by the overlay
  browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === "GET_TABS") {
      Promise.all([
        browser.tabs.query({}),
        browser.windows.getLastFocused(),
      ]).then(([tabs, focusedWindow]) => {
        sendResponse({
          focusedWindowId: focusedWindow.id,
          tabs: tabs.map((t) => ({
            id: t.id,
            title: t.title ?? "(no title)",
            url: t.url ?? "",
            favIconUrl: t.favIconUrl ?? "",
            windowId: t.windowId,
            active: t.active,
          })),
        });
      });
      return true;
    }

    if (message.type === "SWITCH_TAB") {
      browser.tabs.update(message.tabId, { active: true });
      browser.windows.update(message.windowId, { focused: true });
      return false;
    }

    if (message.type === "CLOSE_TAB") {
      browser.tabs.remove(message.tabId);
      return false;
    }
  });
});

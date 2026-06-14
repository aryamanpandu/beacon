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

    if (message.type === "GET_BOOKMARKS") {
      // The browser already keeps bookmarks in memory
      // no caching needed. Flatten the tree to the leaf nodes that have a URL.
      browser.bookmarks.getTree().then((tree) => {
        const bookmarks: { id: string; title: string; url: string }[] = [];
        const stack = [...tree];
        while (stack.length) {
          const node = stack.pop()!;
          if (node.url) {
            bookmarks.push({ id: node.id, title: node.title || node.url, url: node.url });
          }
          if (node.children) stack.push(...node.children);
        }
        sendResponse({ bookmarks });
      });
      return true;
    }

    if (message.type === "GET_HISTORY") {
      // Pull the most recently visited pages across all time (default window is
      // only the last 24h, so startTime: 0). De-duped by URL by the API.
      browser.history.search({ text: "", maxResults: 2000, startTime: 0 }).then((items) => {
        const history = items
          .filter((it) => it.url)
          .sort((a, b) => (b.lastVisitTime ?? 0) - (a.lastVisitTime ?? 0))
          .map((it) => ({ id: it.id, title: it.title || it.url!, url: it.url! }));
        sendResponse({ history });
      });
      return true;
    }

    if (message.type === "OPEN_URL") {
      browser.tabs.create({ url: message.url });
      return false;
    }
  });
});

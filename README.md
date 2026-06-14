# Beacon

**Find any open tab before you drown in them.**

Beacon is a keyboard-driven search overlay for Chrome and Firefox. Hit one shortcut, start typing, and jump straight to the tab — or bookmark, or page from your history — you're looking for. No more squinting at a strip of 40 favicons.

Like a lighthouse cutting through a storm: one amber light, and you know exactly where to go.

```
Cmd + . (period)   →   type   →   ↵
```

---

## Features

- **⌘ Instant tab search** — one shortcut opens a centered overlay; type to filter every open tab across every window.
- **Window-aware** — tabs are tagged `W1`, `W2`… so you can tell apart look-alike pages, and tabs in the window you're already staring at sink to the bottom (you're usually hunting for something you *can't* see).
- **Slash commands** — type `/` to switch modes:
  - `/book` — search your bookmarks
  - `/hist` — search your browsing history
  - `/coffee` — support development ☕
- **Keyboard-first** — `↑ ↓` to move, `↵` to open, `Esc` to dismiss, `⌫` to back out of a command.
- **Draggable** — grab the header and move the overlay anywhere on the page.
- **Private by design** — everything runs locally in your browser. Beacon sends nothing anywhere, talks to no server, and has no analytics. Your tabs, bookmarks, and history never leave your machine.

---

## Keyboard shortcut

| Platform | Default |
| --- | --- |
| macOS | `Cmd + .` |
| Windows / Linux | `Ctrl + .` |

Want a different combo? Click the Beacon toolbar icon → **Customize shortcut**, or set it directly:

- **Chrome** — `chrome://extensions/shortcuts`
- **Firefox** — `about:addons` → gear icon → **Manage Extension Shortcuts**

> Note: the overlay can't appear on restricted pages (`chrome://`, the New Tab page, the Web Store) — browsers block extensions from running there.

---

## Run it locally

Prefer building it yourself over installing from a store? Here's the whole flow.

### Prerequisites

- [Node.js](https://nodejs.org) 18 or newer
- npm (ships with Node)

### 1. Get the code

```bash
git clone https://github.com/aryamanpandu/beacon.git
cd beacon
npm install
```

### 2a. Load it in Chrome

```bash
npm run build
```

Then:

1. Open `chrome://extensions`
2. Toggle **Developer mode** on (top-right)
3. Click **Load unpacked**
4. Select the **`.output/chrome-mv3`** folder
5. Press `Cmd/Ctrl + .` on any normal web page

### 2b. Load it in Firefox

```bash
npm run build:firefox
```

Then:

1. Open `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on…**
3. Select any file inside **`.output/firefox-mv2`** (e.g. `manifest.json`)
4. Press `Cmd/Ctrl + .`

> Temporary add-ons are removed when Firefox restarts. To keep it permanently you'd need to sign it through [addons.mozilla.org](https://addons.mozilla.org) — the add-on ID is already set up for that.

### Live development

Skip the manual reload loop — these launch a fresh browser with the extension loaded and hot-reload on every save:

```bash
npm run dev          # Chrome
npm run dev:firefox  # Firefox
```

---

## Make it yours

**Add a command** — drop another entry in the `COMMANDS` array in [`components/beacon/lib/commands.tsx`](components/beacon/lib/commands.tsx). A `url` makes it an *action* command (opens a link and closes); leave it off to make a *mode* command (enters a sub-search like `/book`).

> Please leave the `/coffee` support link as-is. Beacon is free and open - if you fork or share it, keeping the original `/coffee` link is the one thing asked in return. 🙏

---

## How it's built

| | |
| --- | --- |
| Framework | [WXT](https://wxt.dev) (cross-browser extension tooling) |
| UI | React + TypeScript |
| Styling | Tailwind CSS + inline styles, isolated in a Shadow DOM |
| Permissions | `tabs`, `bookmarks`, `history` — all read locally |

The overlay is injected as a content script inside a shadow root, so the host page's styles can't break Beacon and Beacon's styles can't break the page. A background service worker is the only piece that talks to the browser's `tabs` / `bookmarks` / `history` APIs; the UI just sends it messages.

---

## Support

If Beacon saves you from tab-chaos and you'd like to say thanks:

☕ [Buy me a coffee](https://buymeacoffee.com/aryamanpandey)

# Privacy Policy

**Beacon** - Keyboard-driven tab search for Chrome and Firefox

*Last updated: June 14, 2026*

---

## The short version

Beacon collects nothing. It stores nothing. It sends nothing anywhere.

---

## What Beacon does with your data

Beacon reads your open tabs, bookmarks, and browsing history **locally, inside your browser**, solely to display them in the search overlay while it is open. The moment you close the overlay, that data is gone. It is never written to disk, never sent to a server, and never shared with anyone - including the developer.

| Data | Accessed? | Stored? | Transmitted? |
|---|---|---|---|
| Open tabs (title, URL, favicon) | Yes - to display in search | No | No |
| Bookmarks | Yes - when you type `/book` | No | No |
| Browsing history | Yes - when you type `/hist` | No | No |
| Page content | No | No | No |
| Personal information | No | No | No |

## Permissions explained

- **`tabs`** - required to list your open tabs and switch focus to the one you select.
- **`bookmarks`** - required to power the `/book` search command.
- **`history`** - required to power the `/hist` search command.
- **`<all_urls>` (host permission)** - required to inject the search overlay into whichever page you are currently viewing. Beacon reads no content from the page itself.

## Third parties

Beacon has no third-party integrations, no analytics, no crash reporting, and no external API calls of any kind. Nothing leaves your browser.

## Changes to this policy

If anything here ever changes, the updated policy will be posted at this URL and the *Last updated* date above will reflect the change.

## Contact

Questions? Open an issue at [github.com/aryamanpandu/beacon](https://github.com/aryamanpandu/beacon).

import react from "@vitejs/plugin-react";
import { defineConfig } from "wxt";

export default defineConfig({
  vite: () => ({
    plugins: [react()],
  }),
  manifest: {
    name: "Beacon",
    description: "Keyboard-driven tab search. Hit Cmd+. (period) , type, switch.",
    version: "1.0.0",
    permissions: ["tabs", "bookmarks", "history"],
    browser_specific_settings: {
      gecko: {
        id: "beacon@aryamanpandu",
        strict_min_version: "142.0",
        data_collection_permissions: {
          required: [
            "bookmarksInfo",
            "browsingActivity",
          ]
        }
      },
    },
    icons: {
      16: "/icon/16.png",
      32: "/icon/32.png",
      48: "/icon/48.png",
      128: "/icon/128.png",
    },
    commands: {
      "open-tab-search": {
        suggested_key: {
          mac: "Command+Period",
          default: "Ctrl+Period",
        },
        description: "Open Beacon tab search",
      },
    },
    content_security_policy: {
      extension_pages: "script-src 'self'; object-src 'self';", 
    }
  },
});

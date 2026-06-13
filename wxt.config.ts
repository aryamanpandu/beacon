import react from "@vitejs/plugin-react";
import { defineConfig } from "wxt";

export default defineConfig({
  extensionApi: "chrome",
  vite: () => ({
    plugins: [react()],
  }),
  manifest: {
    name: "Beacon",
    description: "Keyboard-driven tab search for Chrome. Hit Cmd+B, type, switch.",
    version: "1.0.0",
    permissions: ["tabs"],
    icons: {
      16: "/icon/16.png",
      32: "/icon/32.png",
      48: "/icon/48.png",
      128: "/icon/128.png",
    },
    commands: {
      "open-tab-search": {
        suggested_key: {
          mac: "Command+B",
          default: "Ctrl+B",
        },
        description: "Open Beacon tab search",
      },
    },
  },
});

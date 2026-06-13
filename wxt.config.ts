import react from "@vitejs/plugin-react";
import { defineConfig } from "wxt";

export default defineConfig({
  extensionApi: "chrome",
  vite: () => ({
    plugins: [react()],
  }),
  manifest: {
    name: "Beacon",
    description: "Keyboard-driven tab search for Chrome. Hit Cmd+Shift+O, type, switch.",
    version: "1.0.0",
    permissions: ["tabs"],
    commands: {
      "open-tab-search": {
        suggested_key: {
          mac: "Command+Shift+O",
          default: "Ctrl+Shift+O",
        },
        description: "Open Beacon tab search",
      },
    },
  },
});

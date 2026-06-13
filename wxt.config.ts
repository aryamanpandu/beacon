import react from "@vitejs/plugin-react";
import { defineConfig } from "wxt";

export default defineConfig({
  extensionApi: "chrome",
  vite: () => ({
    plugins: [react()],
  }),
  manifest: {
    name: "Tab Search",
    description: "Quickly find and switch between open tabs with a keyboard shortcut",
    version: "1.0.0",
    permissions: ["tabs"],
    commands: {
      "open-tab-search": {
        suggested_key: {
          mac: "Command+Shift+O",
          default: "Ctrl+Shift+O",
        },
        description: "Open tab search overlay",
      },
    },
  },
});

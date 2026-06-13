import type { Config } from "tailwindcss";

export default {
  content: ["./entrypoints/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;

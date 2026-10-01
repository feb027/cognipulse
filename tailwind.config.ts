import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        apple: {
          bg: "#F2F2F7",
          bgDark: "#000000",
          card: "#FFFFFF",
          cardDark: "#1C1C1E",
          cardSubtle: "#F9F9FB",
          cardSubtleDark: "#2C2C2E",
          border: "rgba(0, 0, 0, 0.06)",
          borderDark: "rgba(255, 255, 255, 0.10)",
          red: "#FF2D55",
          teal: "#00C7BE",
          orange: "#FF9500",
          blue: "#007AFF",
          green: "#34C759",
          purple: "#AF52DE",
          yellow: "#FFCC00",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"SF Pro Text"',
          "var(--font-sans)",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "var(--font-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "monospace",
        ],
      },
      boxShadow: {
        apple: "0 2px 12px -2px rgba(0, 0, 0, 0.04), 0 1px 3px 0 rgba(0, 0, 0, 0.02)",
        appleHover: "0 8px 24px -4px rgba(0, 0, 0, 0.08), 0 2px 6px 0 rgba(0, 0, 0, 0.03)",
        applePill: "0 10px 30px -5px rgba(0, 0, 0, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;

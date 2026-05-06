import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#f4ede0",
          deep: "#ebe2cf",
          shadow: "#ddd2b6",
        },
        ink: {
          DEFAULT: "#1a1714",
          soft: "#574c40",
          mute: "#8a7c69",
        },
        accent: {
          red: "#8c1f1f",
          green: "#2d4a3e",
          gold: "#a07a2c",
        },
        rule: "#b8a98a",
      },
      fontFamily: {
        display: ["var(--font-display)", "Playfair Display", "Georgia", "serif"],
        serif: ["var(--font-serif)", "Source Serif 4", "Georgia", "serif"],
        meta: ["var(--font-meta)", "IBM Plex Mono", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        checkerboard:
          "repeating-conic-gradient(#1a1714 0% 25%, #f4ede0 0% 50%)",
        "checkerboard-soft":
          "repeating-conic-gradient(#1a171411 0% 25%, transparent 0% 50%)",
        "newspaper-noise":
          "radial-gradient(rgba(26,23,20,0.06) 1px, transparent 1px)",
      },
      boxShadow: {
        ink: "0 1px 0 0 #1a1714",
      },
    },
  },
  plugins: [],
};

export default config;

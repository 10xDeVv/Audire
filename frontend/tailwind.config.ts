import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#171514",
        ember: "#d86f45",
        brass: "#d9b46f",
        moss: "#6f8d79",
        paper: "#f8f1e8",
      },
      boxShadow: {
        glow: "0 24px 80px rgba(216, 111, 69, 0.18)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

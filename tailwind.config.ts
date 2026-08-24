import type { Config } from "tailwindcss";
import { colors } from "./lib/tokens";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./config/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: colors.bg,
        "bg-alt": colors.bgAlt,
        "bg-alt2": colors.bgAlt2,
        ink: colors.ink,
        "ink-soft": colors.inkSoft,
        "text-2": colors.text2,
        "text-3": colors.text3,
        "text-4": colors.text4,
        inverse: colors.inverse,
        accent: colors.accent,
      },
      borderColor: {
        hairline: colors.hairline,
        "hairline-md": colors.hairlineMd,
        "hairline-dk": colors.hairlineDk,
        "hairline-inv": colors.hairlineInv,
        "hairline-inv-md": colors.hairlineInvMd,
      },
      fontFamily: {
        sans: ["var(--font-archivo)", "system-ui", "sans-serif"],
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out-circ": "cubic-bezier(0.85, 0, 0.15, 1)",
      },
      maxWidth: {
        container: "1280px",
      },
      letterSpacing: {
        display: "-0.04em",
        label: "0.14em",
      },
    },
  },
  plugins: [],
};

export default config;

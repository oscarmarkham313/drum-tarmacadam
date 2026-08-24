/**
 * Design tokens — single source of truth.
 * Consumed by tailwind.config.ts, globals.css (via Tailwind), and the
 * Remotion project (remotion/src/tokens.ts re-exports this file).
 *
 * Palette carried over from the v1 site (styles.css :root), strays retired.
 */

export const colors = {
  bg: "#fafafa",
  bgAlt: "#f5f4f0",
  bgAlt2: "#efefeb",
  ink: "#0a0a0a",
  inkSoft: "#111111",
  text2: "#444444",
  text3: "#888888",
  text4: "#bbbbbb",
  inverse: "#ffffff",
  accent: "#16a34a",
  hairline: "rgba(0,0,0,0.08)",
  hairlineMd: "rgba(0,0,0,0.12)",
  hairlineDk: "rgba(0,0,0,0.18)",
  hairlineInv: "rgba(255,255,255,0.14)",
  hairlineInvMd: "rgba(255,255,255,0.24)",
} as const;

/** Framer Motion cubic-bezier arrays */
export const ease = {
  out: [0.16, 1, 0.3, 1] as const,     // expo-out feel — entrances
  inOut: [0.85, 0, 0.15, 1] as const,  // circ — position swaps
  back: [0.34, 1.56, 0.64, 1] as const, // slight overshoot — the accent stop
};

/** CSS strings of the same curves */
export const easeCss = {
  out: "cubic-bezier(0.16, 1, 0.3, 1)",
  inOut: "cubic-bezier(0.85, 0, 0.15, 1)",
  back: "cubic-bezier(0.34, 1.56, 0.64, 1)",
};

export const type = {
  display: "var(--font-archivo), system-ui, sans-serif",
  trackingDisplay: "-0.04em",
  trackingLabel: "0.14em",
};

export const layout = {
  container: "1280px",
  navHeight: "64px",
};

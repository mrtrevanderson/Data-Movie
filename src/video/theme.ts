export const theme = {
  // Colors
  bg: "#070B14",
  bgAlt: "#0C1220",
  // Hyundai brand colors
  hyundaiBlue: "#002C5F",      // Hyundai primary blue
  hyundaiBlueBright: "#0066CC", // lighter blue for glow/UI
  accentSilver: "#C8D0D8",     // metallic silver
  // Keep accent aliases pointing to Hyundai palette
  accent: "#0066CC",
  accentGold: "#FFB800",
  accentGreen: "#00C896",
  white: "#FFFFFF",
  whiteAlpha60: "rgba(255,255,255,0.6)",
  whiteAlpha30: "rgba(255,255,255,0.3)",
  whiteAlpha10: "rgba(255,255,255,0.1)",
  cardBg: "rgba(255,255,255,0.05)",
  cardBorder: "rgba(0,102,204,0.35)",

  // Typography — system fonts only, no downloads needed
  fontFamily:
    "'SF Pro Display', 'Helvetica Neue', 'Arial', 'Segoe UI', sans-serif",
  fontMono: "'SF Mono', 'Courier New', monospace",

  // Spacing (base unit = 1px at 4K, scale up from there)
  unit: 1,

  // Font sizes (in px at 3840×2160)
  fontSize: {
    hero: 200,
    h1: 140,
    h2: 100,
    h3: 72,
    kpiValue: 160,
    kpiLabel: 52,
    body: 48,
    caption: 38,
    small: 30,
  },

  // Line heights
  lineHeight: {
    tight: 1.1,
    normal: 1.4,
  },

  // Card dimensions
  card: {
    width: 980,
    height: 520,
    radius: 32,
    padding: 72,
  },
};

export type Theme = typeof theme;

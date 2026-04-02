export interface Theme {
  id: number;
  name: string;
  type: "Professional" | "Creative" | "Minimal" | "Bold" | "Elegant";
  colors: {
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    accent: string;
    accentForeground: string;
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    muted: string;
    mutedForeground: string;
    border: string;
  };
  typography: {
    font: "sans" | "serif" | "mono";
  };
  shape: {
    radius: "0rem" | "0.5rem" | "1rem" | "9999px"; // box-rounded
  };
}

const colorPalettes = [
  // 1. Original Orange (Bold)
  {
    name: "Impact Orange",
    colors: {
      primary: "#F28E2B",
      primaryForeground: "#FFFFFF",
      secondary: "#000000",
      secondaryForeground: "#FFFFFF",
      accent: "#FFF4E6",
      accentForeground: "#F28E2B",
      background: "#FFFFFF",
      foreground: "#111827",
      card: "#F9FAFB",
      cardForeground: "#111827",
      muted: "#F3F4F6",
      mutedForeground: "#6B7280",
      border: "#E5E7EB",
    },
  },
  // 2. Trust Blue (Professional)
  {
    name: "Corporate Blue",
    colors: {
      primary: "#2563EB",
      primaryForeground: "#FFFFFF",
      secondary: "#1E293B",
      secondaryForeground: "#FFFFFF",
      accent: "#EFF6FF",
      accentForeground: "#2563EB",
      background: "#FFFFFF",
      foreground: "#0F172A",
      card: "#F8FAFC",
      cardForeground: "#0F172A",
      muted: "#F1F5F9",
      mutedForeground: "#64748B",
      border: "#E2E8F0",
    },
  },
  // 3. Growth Green (Minimal)
  {
    name: "Growth Emerald",
    colors: {
      primary: "#059669",
      primaryForeground: "#FFFFFF",
      secondary: "#064E3B",
      secondaryForeground: "#FFFFFF",
      accent: "#ECFDF5",
      accentForeground: "#059669",
      background: "#FAFAF9",
      foreground: "#1C1917",
      card: "#FFFFFF",
      cardForeground: "#1C1917",
      muted: "#F5F5F4",
      mutedForeground: "#78716C",
      border: "#E7E5E4",
    },
  },
  // 4. Creative Purple (Creative)
  {
    name: "Creative Violet",
    colors: {
      primary: "#7C3AED",
      primaryForeground: "#FFFFFF",
      secondary: "#4C1D95",
      secondaryForeground: "#FFFFFF",
      accent: "#F5F3FF",
      accentForeground: "#7C3AED",
      background: "#FFFFFF",
      foreground: "#111827",
      card: "#F9FAFB",
      cardForeground: "#111827",
      muted: "#F3F4F6",
      mutedForeground: "#6B7280",
      border: "#E5E7EB",
    },
  },
  // 5. Elegant Dark (Elegant)
  {
    name: "Midnight Lux",
    colors: {
      primary: "#D4AF37",
      primaryForeground: "#000000", // Gold
      secondary: "#FFFFFF",
      secondaryForeground: "#000000",
      accent: "#1F2937",
      accentForeground: "#D4AF37",
      background: "#0a0a0a",
      foreground: "#FAFAFA",
      card: "#171717",
      cardForeground: "#FAFAFA",
      muted: "#262626",
      mutedForeground: "#A3A3A3",
      border: "#404040",
    },
  },
  // 6. Modern Slate (Minimal)
  {
    name: "Modern Slate",
    colors: {
      primary: "#475569",
      primaryForeground: "#FFFFFF",
      secondary: "#0f172a",
      secondaryForeground: "#FFFFFF",
      accent: "#f1f5f9",
      accentForeground: "#475569",
      background: "#ffffff",
      foreground: "#0f172a",
      card: "#f8fafc",
      cardForeground: "#0f172a",
      muted: "#e2e8f0",
      mutedForeground: "#64748B",
      border: "#cbd5e1",
    },
  },
];

export const themes: Theme[] = Array.from({ length: 30 }, (_, i) => {
  const palette = colorPalettes[i % colorPalettes.length];
  const fonts = ["sans", "serif", "mono"] as const;
  const radii = ["0rem", "0.5rem", "1rem", "9999px"] as const;

  // Deterministic variations
  const font = fonts[Math.floor(i / 6) % 3];
  const radius = radii[Math.floor(i / 2) % 4];

  return {
    id: i + 1,
    name: `${palette.name} V${Math.floor(i / 6) + 1}`,
    type:
      i % 5 === 0
        ? "Bold"
        : i % 5 === 1
        ? "Professional"
        : i % 5 === 2
        ? "Minimal"
        : "Creative",
    colors: palette.colors,
    typography: { font },
    shape: { radius },
  };
});

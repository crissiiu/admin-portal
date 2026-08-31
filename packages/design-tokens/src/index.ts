export const colors = {
  background: "#f8fafc",
  backgroundDark: "#0f172a",
  foreground: "#111827",
  foregroundDark: "#f8fafc",
  muted: "#64748b",
  mutedDark: "#94a3b8",
  surface: "#ffffff",
  surfaceDark: "#111827",
  primary: "#FF6900",
  primaryForeground: "#111827",
  brandPrimary: "#FF6900",
  brandBlue: "#1068B4",
  orangeGradientStart: "#FCB900",
  orangeGradientEnd: "#FF6900",
  border: "#dbe3ee",
  success: "#15803d",
  warning: "#b45309",
  danger: "#DC2626",
  dangerHover: "#B91C1C",
  dangerForeground: "#FFFFFF"
} as const;

export const gradients = {
  orange: "linear-gradient(180deg, #FCB900 0%, #FF6900 100%)"
} as const;

export const spacing = {
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  "2xl": "32px",
  "3xl": "48px"
} as const;

export const radii = {
  sm: "4px",
  md: "8px",
  lg: "12px"
} as const;

export const typography = {
  fontFamily:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontSizeXs: "12px",
  fontSizeSm: "14px",
  fontSizeMd: "16px",
  fontSizeLg: "18px",
  fontSizeXl: "24px",
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightSemibold: 600,
  lineHeightTight: "1.25",
  lineHeightNormal: "1.5"
} as const;

export const shadows = {
  sm: "0 1px 2px rgb(15 23 42 / 0.08)",
  md: "0 8px 24px rgb(15 23 42 / 0.12)",
  lg: "0 18px 48px rgb(15 23 42 / 0.16)"
} as const;

export const zIndices = {
  base: 0,
  sticky: 100,
  dropdown: 1000,
  modal: 1100,
  toast: 1200,
  tooltip: 1300
} as const;


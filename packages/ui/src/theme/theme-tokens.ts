import { colors, gradients, radii, shadows, spacing, typography, zIndices } from "@job-portal/design-tokens";

export type ThemeMode = "light" | "dark";

export const cssVariablePrefix = "sb";

export type ThemeCssVariables = Record<`--${typeof cssVariablePrefix}-${string}`, string>;

const sharedVariables = {
  "--sb-brand-primary": colors.brandPrimary,
  "--sb-brand-primary-foreground": colors.primaryForeground,
  "--sb-brand-blue": colors.brandBlue,
  "--sb-danger": colors.danger,
  "--sb-danger-hover": colors.dangerHover,
  "--sb-danger-foreground": colors.dangerForeground,
  "--sb-orange-gradient-start": colors.orangeGradientStart,
  "--sb-orange-gradient-end": colors.orangeGradientEnd,
  "--sb-orange-gradient": gradients.orange,
  "--sb-spacing-xs": spacing.xs,
  "--sb-spacing-sm": spacing.sm,
  "--sb-spacing-md": spacing.md,
  "--sb-spacing-lg": spacing.lg,
  "--sb-spacing-xl": spacing.xl,
  "--sb-spacing-2xl": spacing["2xl"],
  "--sb-spacing-3xl": spacing["3xl"],
  "--sb-radius-sm": radii.sm,
  "--sb-radius-md": radii.md,
  "--sb-radius-lg": radii.lg,
  "--sb-font-family": typography.fontFamily,
  "--sb-font-size-xs": typography.fontSizeXs,
  "--sb-font-size-sm": typography.fontSizeSm,
  "--sb-font-size-md": typography.fontSizeMd,
  "--sb-font-size-lg": typography.fontSizeLg,
  "--sb-font-size-xl": typography.fontSizeXl,
  "--sb-line-height-tight": typography.lineHeightTight,
  "--sb-line-height-normal": typography.lineHeightNormal,
  "--sb-shadow-sm": shadows.sm,
  "--sb-shadow-md": shadows.md,
  "--sb-shadow-lg": shadows.lg,
  "--sb-z-base": String(zIndices.base),
  "--sb-z-sticky": String(zIndices.sticky),
  "--sb-z-dropdown": String(zIndices.dropdown),
  "--sb-z-modal": String(zIndices.modal),
  "--sb-z-toast": String(zIndices.toast),
  "--sb-z-tooltip": String(zIndices.tooltip)
} satisfies ThemeCssVariables;

const modeVariables = {
  light: {
    "--sb-color-background": colors.background,
    "--sb-color-foreground": colors.foreground,
    "--sb-color-muted": colors.muted,
    "--sb-color-surface": colors.surface,
    "--sb-color-border": colors.border
  },
  dark: {
    "--sb-color-background": colors.backgroundDark,
    "--sb-color-foreground": colors.foregroundDark,
    "--sb-color-muted": colors.mutedDark,
    "--sb-color-surface": colors.surfaceDark,
    "--sb-color-border": "#334155"
  }
} satisfies Record<ThemeMode, ThemeCssVariables>;

export function getThemeCssVariables(mode: ThemeMode = "light"): ThemeCssVariables {
  return {
    ...sharedVariables,
    ...modeVariables[mode]
  };
}

export function createThemeCssText(mode: ThemeMode = "light", selector = ":root"): string {
  const variables = getThemeCssVariables(mode);
  const body = Object.entries(variables)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join("\n");

  return `${selector} {\n${body}\n}`;
}

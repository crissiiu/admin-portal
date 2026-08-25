import { colors, radii, shadows, spacing, typography, zIndices } from "@job-portal/design-tokens";
import { theme, type ThemeConfig } from "antd";

import type { ThemeMode } from "./theme-tokens";

const baseToken = {
  colorPrimary: colors.brandPrimary,
  colorInfo: colors.brandPrimary,
  colorSuccess: colors.success,
  colorWarning: colors.warning,
  colorError: colors.danger,
  colorTextLightSolid: colors.primaryForeground,
  colorBgLayout: colors.background,
  colorBgContainer: colors.surface,
  colorText: colors.foreground,
  colorTextSecondary: colors.muted,
  colorBorder: colors.border,
  borderRadius: Number.parseInt(radii.md, 10),
  borderRadiusSM: Number.parseInt(radii.sm, 10),
  borderRadiusLG: Number.parseInt(radii.lg, 10),
  fontFamily: typography.fontFamily,
  fontSize: Number.parseInt(typography.fontSizeSm, 10),
  fontSizeHeading1: Number.parseInt(typography.fontSizeXl, 10),
  fontWeightStrong: typography.fontWeightSemibold,
  boxShadow: shadows.md,
  boxShadowSecondary: shadows.sm,
  paddingXS: Number.parseInt(spacing.sm, 10),
  paddingSM: Number.parseInt(spacing.md, 10),
  padding: Number.parseInt(spacing.lg, 10),
  paddingLG: Number.parseInt(spacing.xl, 10),
  zIndexPopupBase: zIndices.dropdown,
  zIndexBase: zIndices.base
} satisfies ThemeConfig["token"];

const componentTokens = {
  Button: {
    borderRadius: Number.parseInt(radii.md, 10),
    colorPrimary: colors.orangeGradientEnd,
    colorPrimaryActive: colors.orangeGradientEnd,
    colorPrimaryHover: colors.orangeGradientStart,
    primaryColor: colors.primaryForeground,
    primaryShadow: "none"
  },
  Card: {
    borderRadiusLG: Number.parseInt(radii.md, 10),
    boxShadow: shadows.sm
  },
  Form: {
    labelRequiredMarkColor: colors.danger
  },
  Input: {
    borderRadius: Number.parseInt(radii.md, 10)
  },
  Modal: {
    borderRadiusLG: Number.parseInt(radii.md, 10)
  },
  Select: {
    borderRadius: Number.parseInt(radii.md, 10)
  },
  Tabs: {
    itemSelectedColor: colors.brandBlue
  },
  Tag: {
    borderRadiusSM: Number.parseInt(radii.sm, 10)
  }
} satisfies ThemeConfig["components"];

export const lightThemeConfig: ThemeConfig = {
  token: baseToken,
  components: componentTokens,
  algorithm: theme.defaultAlgorithm,
  cssVar: {
    key: "sales-builder-light",
    prefix: "sb-ant"
  }
};

export const darkThemeConfig: ThemeConfig = {
  token: {
    ...baseToken,
    colorBgLayout: colors.backgroundDark,
    colorBgContainer: colors.surfaceDark,
    colorText: colors.foregroundDark,
    colorTextSecondary: colors.mutedDark,
    colorBorder: "#334155"
  },
  components: componentTokens,
  algorithm: theme.darkAlgorithm,
  cssVar: {
    key: "sales-builder-dark",
    prefix: "sb-ant"
  }
};

export function getAntdThemeConfig(mode: ThemeMode = "light"): ThemeConfig {
  return mode === "dark" ? darkThemeConfig : lightThemeConfig;
}

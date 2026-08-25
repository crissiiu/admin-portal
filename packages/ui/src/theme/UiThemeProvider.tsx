"use client";

import { ConfigProvider } from "antd";
import type { CSSProperties, ReactNode } from "react";

import { getAntdThemeConfig } from "./antd-theme";
import { getThemeCssVariables, type ThemeMode } from "./theme-tokens";

type ThemeStyle = CSSProperties & Record<`--${string}`, string>;

export interface UiThemeProviderProps {
  children: ReactNode;
  mode?: ThemeMode;
}

export function UiThemeProvider({ children, mode = "light" }: UiThemeProviderProps) {
  const cssVariables = getThemeCssVariables(mode) as ThemeStyle;

  return (
    <ConfigProvider theme={getAntdThemeConfig(mode)}>
      <div data-theme={mode} style={cssVariables}>
        {children}
      </div>
    </ConfigProvider>
  );
}

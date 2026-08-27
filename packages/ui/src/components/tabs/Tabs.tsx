"use client";

import { Tabs as AntdTabs, type TabsProps as AntdTabsProps } from "antd";
import type { ReactNode } from "react";

import { cn } from "../../lib/cn";

export type TabsVariant = "line" | "pills" | "boxed";
export type TabsSize = NonNullable<AntdTabsProps["size"]>;
export type TabsPlacement = NonNullable<AntdTabsProps["tabPosition"]>;

export interface TabItem {
  children?: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
  key: string;
  label: ReactNode;
}

export interface TabsProps
  extends Omit<AntdTabsProps, "activeKey" | "defaultActiveKey" | "items" | "onChange" | "size" | "tabPosition" | "type"> {
  defaultValue?: string;
  items?: TabItem[];
  onValueChange?: (value: string) => void;
  placement?: TabsPlacement;
  size?: TabsSize;
  value?: string;
  variant?: TabsVariant;
}

const antdTypes: Record<TabsVariant, AntdTabsProps["type"]> = {
  boxed: "card",
  line: "line",
  pills: "line"
};

export function Tabs({
  className,
  defaultValue,
  items,
  onValueChange,
  placement = "top",
  size = "middle",
  value,
  variant = "line",
  ...props
}: TabsProps) {
  return (
    <AntdTabs
      activeKey={value}
      className={cn("sb-tabs", `sb-tabs--${variant}`, className)}
      defaultActiveKey={defaultValue}
      items={items}
      onChange={onValueChange}
      size={size}
      tabPosition={placement}
      type={antdTypes[variant]}
      {...props}
    />
  );
}

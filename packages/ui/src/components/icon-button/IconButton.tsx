"use client";

import { Tooltip } from "antd";
import type { ReactNode } from "react";

import { Button, type ButtonProps } from "../button";
import { cn } from "../../lib/cn";

type IconButtonSize = NonNullable<ButtonProps["size"]>;
type IconButtonVariant = NonNullable<ButtonProps["variant"]>;

const iconButtonSizes: Record<IconButtonSize, string> = {
  sm: "h-8 w-8 px-0",
  md: "h-10 w-10 px-0",
  lg: "h-11 w-11 px-0"
};

export interface IconButtonProps
  extends Omit<ButtonProps, "children" | "leftIcon" | "rightIcon" | "size" | "variant"> {
  icon: ReactNode;
  label: string;
  size?: IconButtonSize;
  tooltip?: ReactNode;
  variant?: IconButtonVariant;
}

export function IconButton({
  className,
  icon,
  label,
  loading = false,
  size = "md",
  style,
  tooltip = label,
  variant = "secondary",
  ...props
}: IconButtonProps) {
  const button = (
    <Button
      aria-label={label}
      className={cn(iconButtonSizes[size], className)}
      loading={loading}
      size={size}
      style={style}
      variant={variant}
      {...props}
    >
      {loading ? null : (
        <span aria-hidden="true" className="inline-flex shrink-0 items-center justify-center">
          {icon}
        </span>
      )}
    </Button>
  );

  return tooltip ? (
    <Tooltip title={tooltip}>
      <span className={`inline-flex ${iconButtonSizes[size]}`}>{button}</span>
    </Tooltip>
  ) : (
    button
  );
}

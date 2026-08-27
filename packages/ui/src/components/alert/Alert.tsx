"use client";

import { Alert as AntdAlert, type AlertProps as AntdAlertProps } from "antd";
import type { CSSProperties, ReactNode } from "react";

import { colors } from "@job-portal/design-tokens";

import { cn } from "../../lib/cn";

export type AlertType = "info" | "success" | "warning" | "error";
export type AlertVariant = "soft" | "outline" | "filled";

const alertStyles: Record<AlertVariant, Record<AlertType, CSSProperties>> = {
  soft: {
    info: {
      background: "rgb(16 104 180 / 0.08)",
      borderColor: "rgb(16 104 180 / 0.24)",
      color: "#0f3157"
    },
    success: {
      background: "rgb(21 128 61 / 0.08)",
      borderColor: "rgb(21 128 61 / 0.24)",
      color: "#14532d"
    },
    warning: {
      background: "rgb(252 185 0 / 0.16)",
      borderColor: "rgb(255 105 0 / 0.28)",
      color: "#7c2d12"
    },
    error: {
      background: "rgb(220 38 38 / 0.08)",
      borderColor: "rgb(220 38 38 / 0.24)",
      color: "#7f1d1d"
    }
  },
  outline: {
    info: {
      background: "transparent",
      borderColor: colors.brandBlue,
      color: "#0f3157"
    },
    success: {
      background: "transparent",
      borderColor: colors.success,
      color: "#14532d"
    },
    warning: {
      background: "transparent",
      borderColor: colors.orangeGradientEnd,
      color: "#7c2d12"
    },
    error: {
      background: "transparent",
      borderColor: colors.danger,
      color: "#7f1d1d"
    }
  },
  filled: {
    info: {
      background: colors.brandBlue,
      borderColor: colors.brandBlue,
      color: "#ffffff"
    },
    success: {
      background: colors.success,
      borderColor: colors.success,
      color: "#ffffff"
    },
    warning: {
      background: colors.warning,
      borderColor: colors.warning,
      color: "#ffffff"
    },
    error: {
      background: colors.danger,
      borderColor: colors.danger,
      color: colors.dangerForeground
    }
  }
};

export interface AlertProps extends Omit<AntdAlertProps, "description" | "message" | "type" | "variant"> {
  children?: ReactNode;
  description?: ReactNode;
  title?: ReactNode;
  type?: AlertType;
  variant?: AlertVariant;
}

export function Alert({
  children,
  className,
  description,
  role,
  showIcon = true,
  style,
  title,
  type = "info",
  variant = "soft",
  ...props
}: AlertProps) {
  const content = description ?? children;
  const alertRole = role ?? (type === "error" || type === "warning" ? "alert" : "status");

  return (
    <AntdAlert
      className={cn("rounded-[var(--sb-radius-md)] border font-medium", className)}
      description={content}
      message={title}
      role={alertRole}
      showIcon={showIcon}
      style={{
        ...alertStyles[variant][type],
        ...style
      }}
      type={type}
      {...props}
    />
  );
}

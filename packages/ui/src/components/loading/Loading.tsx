"use client";

import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "../../lib/cn";

export type LoadingSize = "sm" | "md" | "lg";
export type LoadingTone = "primary" | "neutral" | "inverse" | "danger";
export type LoadingVariant = "inline" | "block";

const loadingSizes: Record<LoadingSize, string> = {
  sm: "sb-loading__spinner--sm",
  md: "sb-loading__spinner--md",
  lg: "sb-loading__spinner--lg"
};

const loadingTones: Record<LoadingTone, string> = {
  primary: "sb-loading__spinner--primary",
  neutral: "sb-loading__spinner--neutral",
  inverse: "sb-loading__spinner--inverse",
  danger: "sb-loading__spinner--danger"
};

export interface LoadingProps extends HTMLAttributes<HTMLSpanElement | HTMLDivElement> {
  label?: ReactNode;
  size?: LoadingSize;
  tone?: LoadingTone;
  variant?: LoadingVariant;
}

export function Loading({
  className,
  label,
  size = "md",
  tone = "primary",
  variant = "inline",
  ...props
}: LoadingProps) {
  const accessibilityProps = label ? {} : { "aria-label": "Đang tải" };
  const spinner = (
    <span
      aria-hidden="true"
      className={cn("sb-loading__spinner", loadingSizes[size], loadingTones[tone])}
    />
  );

  if (variant === "block") {
    return (
      <div
        className={cn(
          "sb-loading sb-loading--block flex min-h-32 w-full flex-col items-center justify-center gap-3 text-sm font-medium text-[var(--sb-color-muted)]",
          className
        )}
        role="status"
        {...accessibilityProps}
        {...props}
      >
        {spinner}
        {label ? <span>{label}</span> : null}
      </div>
    );
  }

  return (
    <span
      className={cn("sb-loading sb-loading--inline inline-flex items-center justify-center gap-2", className)}
      role="status"
      {...accessibilityProps}
      {...props}
    >
      {spinner}
      {label ? <span>{label}</span> : null}
    </span>
  );
}

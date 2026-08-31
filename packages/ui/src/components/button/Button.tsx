"use client";

import { Slot } from "@radix-ui/react-slot";
import { Button as AntdButton, type ButtonProps as AntdButtonProps } from "antd";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, CSSProperties, MouseEvent, ReactNode } from "react";

import { Loading, type LoadingTone } from "../loading";
import { cn } from "../../lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "border border-transparent bg-[var(--sb-orange-gradient)] text-[var(--sb-brand-primary-foreground)] font-semibold shadow-sm hover:brightness-[0.98] focus-visible:outline-[var(--sb-orange-gradient-end)]",
        secondary:
          "border border-[var(--sb-color-border)] bg-[var(--sb-color-surface)] text-[var(--sb-color-foreground)] hover:bg-[var(--sb-color-background)]",
        outline:
          "border border-[var(--sb-orange-gradient-end)] bg-transparent text-[var(--sb-color-foreground)] hover:bg-[rgb(255_105_0_/_0.08)]",
        ghost: "border border-transparent bg-transparent text-[var(--sb-color-foreground)] hover:bg-[var(--sb-color-background)]",
        danger:
          "border border-transparent bg-[var(--sb-danger)] text-[var(--sb-danger-foreground)] font-semibold hover:bg-[var(--sb-danger-hover)] focus-visible:outline-[var(--sb-danger)]",
        success: "border border-transparent bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:outline-emerald-600",
        link: "border border-transparent bg-transparent px-0 text-[var(--sb-brand-blue)] hover:text-[var(--sb-orange-gradient-end)]"
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-5 text-base"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);

const antdButtonTypes = {
  primary: "default",
  secondary: "default",
  outline: "default",
  ghost: "text",
  danger: "default",
  success: "default",
  link: "link"
} as const;

const antdButtonSizes = {
  sm: "small",
  md: "middle",
  lg: "large"
} as const;

const loadingSizes = {
  sm: "sm",
  md: "sm",
  lg: "md"
} as const;

const loadingTones: Record<NonNullable<ButtonProps["variant"]>, LoadingTone> = {
  primary: "primary",
  secondary: "neutral",
  outline: "primary",
  ghost: "neutral",
  danger: "inverse",
  success: "inverse",
  link: "primary"
};

type NativeButtonType = ButtonHTMLAttributes<HTMLButtonElement>["type"];

export interface ButtonProps
  extends Omit<AntdButtonProps, "children" | "color" | "htmlType" | "icon" | "loading" | "size" | "type" | "variant">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  children?: ReactNode;
  leftIcon?: ReactNode;
  loading?: boolean;
  rightIcon?: ReactNode;
  type?: NativeButtonType;
}

export function Button({
  asChild,
  children,
  className,
  disabled,
  leftIcon,
  loading = false,
  onClick,
  rightIcon,
  size = "md",
  style,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const buttonStyle =
    variant === "primary"
      ? ({
          ...style,
          background: "var(--sb-orange-gradient)",
          borderColor: "transparent",
          color: "var(--sb-brand-primary-foreground)",
          fontWeight: 700
        } satisfies CSSProperties)
      : variant === "danger"
        ? ({
            ...style,
            background: "var(--sb-danger)",
            borderColor: "transparent",
            color: "var(--sb-danger-foreground)",
            fontWeight: 700
          } satisfies CSSProperties)
      : style;
  const content = (
    <>
      {loading ? (
        <Loading aria-hidden="true" size={loadingSizes[size ?? "md"]} tone={loadingTones[variant ?? "primary"]} />
      ) : leftIcon ? (
        <span aria-hidden="true">{leftIcon}</span>
      ) : null}
      {children}
      {!loading && rightIcon ? <span aria-hidden="true">{rightIcon}</span> : null}
    </>
  );

  const handleClick = (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (isDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    onClick?.(event);
  };

  if (asChild) {
    return (
      <Slot
        aria-busy={loading || undefined}
        aria-disabled={isDisabled || undefined}
        className={cn(buttonVariants({ className, size, variant }))}
        data-disabled={isDisabled}
        data-loading={loading}
        onClick={handleClick}
        style={buttonStyle}
        {...props}
      >
        {content}
      </Slot>
    );
  }

  return (
    <AntdButton
      aria-busy={loading || undefined}
      className={cn(buttonVariants({ className, size, variant }))}
      disabled={isDisabled}
      htmlType={type}
      onClick={handleClick}
      size={antdButtonSizes[size ?? "md"]}
      style={buttonStyle}
      type={antdButtonTypes[variant ?? "primary"]}
      {...props}
    >
      {content}
    </AntdButton>
  );
}


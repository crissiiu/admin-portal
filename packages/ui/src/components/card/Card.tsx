"use client";

import { Card as AntdCard, type CardProps as AntdCardProps } from "antd";
import type { HTMLAttributes, ReactNode } from "react";

import { Button, type ButtonProps } from "../button";
import { cn } from "../../lib/cn";

export type CardVariant = "default" | "outlined" | "elevated" | "accent" | "interactive";

const cardVariants: Record<CardVariant, string> = {
  default: "border border-[var(--sb-color-border)] bg-[var(--sb-color-surface)] shadow-none",
  outlined: "border border-[var(--sb-color-border)] bg-transparent shadow-none",
  elevated: "border border-transparent bg-[var(--sb-color-surface)] shadow-[var(--sb-shadow-md)]",
  accent:
    "border border-[rgb(255_105_0_/_0.28)] bg-[linear-gradient(180deg,rgb(252_185_0_/_0.14)_0%,rgb(255_105_0_/_0.08)_100%)] shadow-none",
  interactive:
    "border border-[var(--sb-color-border)] bg-[var(--sb-color-surface)] shadow-none transition hover:border-[var(--sb-orange-gradient-end)] hover:shadow-[var(--sb-shadow-sm)]"
};

export interface CardProps extends Omit<AntdCardProps, "variant"> {
  variant?: CardVariant;
}

export interface CardSectionProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface FeatureCardProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  action?: ReactNode;
  actionLabel?: ReactNode;
  actionProps?: Omit<ButtonProps, "children">;
  description: ReactNode;
  icon?: ReactNode;
  imageAlt: string;
  imageClassName?: string;
  imageSrc: string;
  title: ReactNode;
}

export function Card({ children, className, variant = "default", ...props }: CardProps) {
  return (
    <AntdCard
      className={cn("overflow-hidden rounded-[var(--sb-radius-md)]", cardVariants[variant], className)}
      {...props}
    >
      {children}
    </AntdCard>
  );
}

export function FeatureCard({
  action,
  actionLabel = "Tìm hiểu thêm",
  actionProps,
  className,
  description,
  icon,
  imageAlt,
  imageClassName,
  imageSrc,
  title,
  ...props
}: FeatureCardProps) {
  return (
    <section
      className={cn(
        "grid overflow-hidden rounded-[var(--sb-radius-md)] bg-[var(--sb-color-surface)] text-[var(--sb-color-foreground)] md:grid-cols-[minmax(0,0.48fr)_minmax(0,0.52fr)]",
        className
      )}
      {...props}
    >
      <div className="min-h-[280px] overflow-hidden bg-[var(--sb-color-background)] md:min-h-[420px]">
        <img alt={imageAlt} className={cn("h-full w-full object-cover", imageClassName)} src={imageSrc} />
      </div>
      <div className="flex min-h-[280px] flex-col items-start justify-center px-6 py-8 sm:px-10 md:px-12 lg:px-16">
        {icon ? (
          <div className="mb-8 flex h-[98px] w-[98px] items-center justify-center rounded-[var(--sb-radius-md)] bg-[var(--sb-orange-gradient)] text-[#060647] shadow-[var(--sb-shadow-sm)]">
            {icon}
          </div>
        ) : null}
        <h3 className="max-w-xl text-4xl font-bold leading-tight text-[#060647] sm:text-5xl">{title}</h3>
        <div className="mt-8 max-w-2xl text-xl leading-8 text-[#11144d]">{description}</div>
        <div className="mt-10">
          {action ?? (
            <Button
              size="lg"
              variant="secondary"
              {...actionProps}
              style={{
                background: "#060647",
                borderColor: "#060647",
                color: "#FCB900",
                fontWeight: 700,
                ...(actionProps?.style ?? {})
              }}
            >
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

export function CardHeader({ children, className, ...props }: CardSectionProps) {
  return (
    <div className={cn("grid gap-1 border-b border-[var(--sb-color-border)] px-5 py-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ children, className, ...props }: CardSectionProps) {
  return (
    <div className={cn("px-5 py-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }: CardSectionProps) {
  return (
    <div
      className={cn("flex items-center justify-end gap-2 border-t border-[var(--sb-color-border)] px-5 py-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}

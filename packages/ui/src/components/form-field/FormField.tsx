"use client";

import { useId, type ReactNode } from "react";

import { cn } from "../../lib/cn";

export interface FormFieldRenderProps {
  describedBy?: string;
  fieldProps: {
    "aria-describedby"?: string;
    "aria-invalid"?: true;
    "aria-required"?: true;
    id: string;
  };
  inputId: string;
  invalid: boolean;
  messageId?: string;
  required?: boolean;
}

export interface FormFieldProps {
  children: ReactNode | ((props: FormFieldRenderProps) => ReactNode);
  className?: string;
  error?: ReactNode;
  helperText?: ReactNode;
  id?: string;
  label?: ReactNode;
  labelClassName?: string;
  messageClassName?: string;
  optionalText?: ReactNode;
  required?: boolean;
}

export function FormField({
  children,
  className,
  error,
  helperText,
  id,
  label,
  labelClassName,
  messageClassName,
  optionalText,
  required
}: FormFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const message = error ?? helperText;
  const messageId = message ? `${inputId}-message` : undefined;
  const invalid = Boolean(error);
  const renderProps: FormFieldRenderProps = {
    describedBy: messageId,
    fieldProps: {
      "aria-describedby": messageId,
      "aria-invalid": invalid || undefined,
      "aria-required": required || undefined,
      id: inputId
    },
    inputId,
    invalid,
    messageId,
    required
  };

  return (
    <div className={cn("grid gap-1.5", className)}>
      {label ? (
        <label
          className={cn("flex items-center gap-1 text-sm font-medium text-[var(--sb-color-foreground)]", labelClassName)}
          htmlFor={inputId}
        >
          <span>{label}</span>
          {required ? <span className="text-[var(--sb-danger)]">*</span> : null}
          {!required && optionalText ? <span className="text-xs font-normal text-[var(--sb-color-muted)]">{optionalText}</span> : null}
        </label>
      ) : null}
      {typeof children === "function" ? children(renderProps) : children}
      {message ? (
        <p
          className={cn("text-xs", invalid ? "text-[var(--sb-danger)]" : "text-[var(--sb-color-muted)]", messageClassName)}
          id={messageId}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}

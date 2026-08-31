"use client";

import { Input as AntdInput, type InputProps as AntdInputProps } from "antd";
import { useId, type ComponentProps, type ReactNode } from "react";

import { cn } from "../../lib/cn";

type BaseInputSize = NonNullable<AntdInputProps["size"]>;
type AntdTextAreaProps = ComponentProps<typeof AntdInput.TextArea>;

export interface InputProps extends Omit<AntdInputProps, "size" | "status"> {
  error?: ReactNode;
  helperText?: ReactNode;
  label?: ReactNode;
  required?: boolean;
  size?: BaseInputSize;
  status?: AntdInputProps["status"];
}

export interface TextareaProps extends Omit<AntdTextAreaProps, "status"> {
  error?: ReactNode;
  helperText?: ReactNode;
  label?: ReactNode;
  required?: boolean;
  status?: AntdInputProps["status"];
}

function FieldShell({
  children,
  error,
  helperText,
  htmlFor,
  label,
  required
}: {
  children: ReactNode;
  error?: ReactNode;
  helperText?: ReactNode;
  htmlFor?: string;
  label?: ReactNode;
  required?: boolean;
}) {
  const message = error ?? helperText;

  return (
    <div className="grid gap-1.5">
      {label ? (
        <label className="text-sm font-medium text-[var(--sb-color-foreground)]" htmlFor={htmlFor}>
          {label}
          {required ? <span className="ml-1 text-[var(--sb-danger)]">*</span> : null}
        </label>
      ) : null}
      {children}
      {message ? (
        <p className={cn("text-xs", error ? "text-[var(--sb-danger)]" : "text-[var(--sb-color-muted)]")}>{message}</p>
      ) : null}
    </div>
  );
}

export function Input({
  className,
  error,
  helperText,
  id,
  label,
  required,
  status,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputStatus = error ? "error" : status;

  return (
    <FieldShell error={error} helperText={helperText} htmlFor={inputId} label={label} required={required}>
      <AntdInput
        aria-invalid={inputStatus === "error" || undefined}
        className={cn("font-medium", className)}
        id={inputId}
        status={inputStatus}
        {...props}
      />
    </FieldShell>
  );
}

export function PasswordInput(props: InputProps) {
  const { className, error, helperText, id, label, required, status, ...restProps } = props;
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputStatus = error ? "error" : status;

  return (
    <FieldShell error={error} helperText={helperText} htmlFor={inputId} label={label} required={required}>
      <AntdInput.Password
        aria-invalid={inputStatus === "error" || undefined}
        className={cn("font-medium", className)}
        id={inputId}
        status={inputStatus}
        {...restProps}
      />
    </FieldShell>
  );
}

export function Textarea({
  className,
  error,
  helperText,
  id,
  label,
  required,
  status,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputStatus = error ? "error" : status;

  return (
    <FieldShell error={error} helperText={helperText} htmlFor={inputId} label={label} required={required}>
      <AntdInput.TextArea
        aria-invalid={inputStatus === "error" || undefined}
        className={cn("font-medium", className)}
        id={inputId}
        status={inputStatus}
        {...props}
      />
    </FieldShell>
  );
}

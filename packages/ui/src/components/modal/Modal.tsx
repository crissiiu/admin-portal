"use client";

import { Modal as AntdModal, type ModalProps as AntdModalProps } from "antd";
import type { ReactNode } from "react";

import { Button } from "../button";
import { cn } from "../../lib/cn";

export type ModalVariant = "default" | "danger";

export interface ModalProps
  extends Omit<AntdModalProps, "children" | "footer" | "onCancel" | "onOk" | "open" | "title"> {
  cancelText?: ReactNode;
  children?: ReactNode;
  confirmLoading?: boolean;
  confirmText?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  onCancel?: () => void;
  onConfirm?: () => Promise<void> | void;
  onOpenChange?: (open: boolean) => void;
  open: boolean;
  showFooter?: boolean;
  title?: ReactNode;
  variant?: ModalVariant;
}

export function Modal({
  cancelText = "Hủy",
  children,
  className,
  confirmLoading,
  confirmText = "Xác nhận",
  description,
  footer,
  maskClosable = true,
  onCancel,
  onConfirm,
  onOpenChange,
  open,
  showFooter = false,
  title,
  variant = "default",
  width = 520,
  ...props
}: ModalProps) {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange?.(false);
  };

  const handleConfirm = () => {
    void onConfirm?.();
  };

  const modalFooter =
    footer ??
    (showFooter ? (
      <div className="flex items-center justify-end gap-2">
        <Button disabled={confirmLoading} variant="secondary" onClick={handleCancel}>
          {cancelText}
        </Button>
        <Button loading={confirmLoading} variant={variant === "danger" ? "danger" : "primary"} onClick={handleConfirm}>
          {confirmText}
        </Button>
      </div>
    ) : null);

  return (
    <AntdModal
      centered
      className={cn("sb-modal", className)}
      footer={modalFooter}
      maskClosable={maskClosable}
      onCancel={handleCancel}
      open={open}
      title={
        title ? (
          <div className="grid gap-2">
            <h2 className="m-0 text-xl font-semibold leading-tight text-[var(--sb-color-foreground)]">{title}</h2>
            {description ? <p className="m-0 text-sm leading-6 text-[var(--sb-color-muted)]">{description}</p> : null}
          </div>
        ) : null
      }
      width={width}
      {...props}
    >
      {children ? <div className="pt-2 text-sm leading-6 text-[var(--sb-color-foreground)]">{children}</div> : null}
    </AntdModal>
  );
}

export const Dialog = Modal;
export type DialogProps = ModalProps;

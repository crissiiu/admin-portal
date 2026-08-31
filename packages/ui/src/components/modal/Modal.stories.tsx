import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Alert } from "../alert";
import { Button } from "../button";
import { FormField } from "../form-field";
import { Input, Textarea } from "../input";
import { Modal } from "./Modal";

const meta = {
  title: "Components/Modal",
  component: Modal,
  args: {
    description: "Mô tả ngắn giúp người dùng hiểu nội dung trước khi thao tác.",
    open: false,
    title: "Tiêu đề modal"
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["default", "danger"]
    }
  },
  parameters: {
    layout: "centered"
  }
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Mở modal</Button>
        <Modal
          description="Modal dùng để hiển thị nội dung tập trung, yêu cầu người dùng xử lý hoặc đọc trước khi quay lại màn hình."
          onOpenChange={setOpen}
          open={open}
          title="Thông tin chi tiết"
        >
          Đây là nội dung modal cơ bản. Người dùng có thể đóng bằng nút close, phím Escape hoặc click ra ngoài mask.
        </Modal>
      </>
    );
  }
};

export const Confirmation: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Xác nhận thay đổi</Button>
        <Modal
          confirmText="Lưu thay đổi"
          description="Hành động này sẽ cập nhật dữ liệu cho hồ sơ hiện tại."
          onConfirm={() => setOpen(false)}
          onOpenChange={setOpen}
          open={open}
          showFooter
          title="Lưu thay đổi?"
        >
          Vui lòng kiểm tra lại thông tin trước khi xác nhận.
        </Modal>
      </>
    );
  }
};

export const DangerDialog: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button variant="danger" onClick={() => setOpen(true)}>
          Xóa dữ liệu
        </Button>
        <Modal
          confirmText="Xóa vĩnh viễn"
          description="Dữ liệu sau khi xóa sẽ không thể khôi phục."
          maskClosable={false}
          onConfirm={() => setOpen(false)}
          onOpenChange={setOpen}
          open={open}
          showFooter
          title="Xóa dữ liệu?"
          variant="danger"
        >
          Hãy chắc chắn bạn đã sao lưu các thông tin cần thiết trước khi tiếp tục.
        </Modal>
      </>
    );
  }
};

export const WithForm: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Tạo ghi chú</Button>
        <Modal
          confirmText="Lưu ghi chú"
          description="Thêm ghi chú nội bộ cho hồ sơ ứng viên."
          onConfirm={() => setOpen(false)}
          onOpenChange={setOpen}
          open={open}
          showFooter
          title="Ghi chú mới"
        >
          <div className="grid gap-4">
            <FormField label="Tiêu đề" required>
              {({ fieldProps }) => <Input {...fieldProps} placeholder="Nhập tiêu đề" />}
            </FormField>
            <FormField helperText="Tối đa 500 ký tự." label="Nội dung">
              {({ fieldProps }) => <Textarea {...fieldProps} placeholder="Nhập ghi chú" rows={4} />}
            </FormField>
          </div>
        </Modal>
      </>
    );
  }
};

export const CustomFooter: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Mở custom footer
        </Button>
        <Modal
          footer={
            <div className="flex items-center justify-between gap-3">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Để sau
              </Button>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={() => setOpen(false)}>Tiếp tục</Button>
              </div>
            </div>
          }
          onOpenChange={setOpen}
          open={open}
          title="Footer tùy chỉnh"
        >
          Custom footer phù hợp khi modal cần nhiều hơn hai hành động mặc định.
        </Modal>
      </>
    );
  }
};

export const WithAlert: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Mở modal cảnh báo</Button>
        <Modal onOpenChange={setOpen} open={open} title="Trạng thái hệ thống">
          <Alert title="Cần đồng bộ lại" type="warning" variant="outline">
            Một vài dữ liệu chưa được đồng bộ. Vui lòng thử lại sau ít phút.
          </Alert>
        </Modal>
      </>
    );
  }
};

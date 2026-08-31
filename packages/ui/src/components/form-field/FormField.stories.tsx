import type { Meta, StoryObj } from "@storybook/react-vite";
import { Mail, Search, User } from "lucide-react";

import { Button } from "../button";
import { Input, PasswordInput, Textarea } from "../input";
import { FormField } from "./FormField";

const meta = {
  title: "Components/FormField",
  component: FormField,
  args: {
    children: null,
    helperText: "Nội dung hỗ trợ ngắn cho field.",
    label: "Tên field",
    required: false
  },
  parameters: {
    layout: "centered"
  }
} satisfies Meta<typeof FormField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div style={{ width: 360 }}>
      <FormField {...args}>
        {({ fieldProps }) => <Input {...fieldProps} placeholder="Nhập nội dung" />}
      </FormField>
    </div>
  )
};

export const Required: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <FormField helperText="Email dùng để đăng nhập và nhận thông báo." label="Email" required>
        {({ fieldProps }) => <Input {...fieldProps} placeholder="name@example.com" prefix={<Mail size={16} />} type="email" />}
      </FormField>
    </div>
  )
};

export const ErrorState: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <FormField error="Email không hợp lệ." label="Email" required>
        {({ fieldProps, invalid }) => (
          <Input {...fieldProps} placeholder="name@example.com" prefix={<Mail size={16} />} status={invalid ? "error" : undefined} value="name@" />
        )}
      </FormField>
    </div>
  )
};

export const Optional: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <FormField helperText="Bạn có thể bổ sung sau." label="Tên công ty" optionalText="Tùy chọn">
        {({ fieldProps }) => <Input {...fieldProps} placeholder="Nhập tên công ty" />}
      </FormField>
    </div>
  )
};

export const Password: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <FormField helperText="Tối thiểu 8 ký tự." label="Mật khẩu" required>
        {({ fieldProps }) => <PasswordInput {...fieldProps} placeholder="Nhập mật khẩu" />}
      </FormField>
    </div>
  )
};

export const TextareaField: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <FormField helperText="Tối đa 500 ký tự." label="Ghi chú">
        {({ fieldProps }) => <Textarea {...fieldProps} placeholder="Nhập ghi chú" rows={4} />}
      </FormField>
    </div>
  )
};

export const SearchField: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <FormField label="Tìm kiếm ứng viên">
        {({ fieldProps }) => <Input {...fieldProps} placeholder="Tên, email hoặc số điện thoại" prefix={<Search size={16} />} />}
      </FormField>
    </div>
  )
};

export const FormExample: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, width: 420 }}>
      <FormField label="Họ và tên" required>
        {({ fieldProps }) => <Input {...fieldProps} placeholder="Nguyễn Văn A" prefix={<User size={16} />} />}
      </FormField>
      <FormField error="Email không hợp lệ." label="Email" required>
        {({ fieldProps, invalid }) => (
          <Input {...fieldProps} placeholder="name@example.com" prefix={<Mail size={16} />} status={invalid ? "error" : undefined} value="name@" />
        )}
      </FormField>
      <FormField helperText="Tối thiểu 8 ký tự." label="Mật khẩu" required>
        {({ fieldProps }) => <PasswordInput {...fieldProps} placeholder="Nhập mật khẩu" />}
      </FormField>
      <Button block size="lg">
        Lưu thông tin
      </Button>
    </div>
  )
};

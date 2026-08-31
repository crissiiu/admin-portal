import type { Meta, StoryObj } from "@storybook/react-vite";
import { Mail, Search, User } from "lucide-react";

import { Input, PasswordInput, Textarea } from "./Input";

const meta = {
  title: "Components/Input",
  component: Input,
  args: {
    label: "Họ và tên",
    placeholder: "Nhập họ và tên",
    size: "middle"
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["small", "middle", "large"]
    },
    status: {
      control: "inline-radio",
      options: [undefined, "error", "warning"]
    }
  },
  parameters: {
    layout: "centered"
  }
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithLabelAndHelper: Story = {
  args: {
    helperText: "Tên này sẽ hiển thị trong hồ sơ của bạn.",
    label: "Tên hiển thị",
    placeholder: "Ví dụ: Nguyễn Văn A"
  }
};

export const Required: Story = {
  args: {
    label: "Email",
    placeholder: "name@example.com",
    prefix: <Mail size={16} />,
    required: true,
    type: "email"
  }
};

export const ErrorState: Story = {
  args: {
    error: "Email không hợp lệ.",
    label: "Email",
    placeholder: "name@example.com",
    prefix: <Mail size={16} />,
    value: "name@"
  }
};

export const WarningState: Story = {
  args: {
    helperText: "Mật khẩu nên có ít nhất 8 ký tự.",
    label: "Mật khẩu",
    placeholder: "Nhập mật khẩu",
    status: "warning"
  }
};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: "Mã ứng viên",
    value: "CAND-0001"
  }
};

export const WithPrefixSuffix: Story = {
  args: {
    label: "Tìm kiếm",
    placeholder: "Tìm theo tên hoặc email",
    prefix: <Search size={16} />,
    suffix: <User size={16} />
  }
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, width: 360 }}>
      <Input label="Small" placeholder="Small input" size="small" />
      <Input label="Middle" placeholder="Middle input" size="middle" />
      <Input label="Large" placeholder="Large input" size="large" />
    </div>
  )
};

export const Password: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <PasswordInput helperText="Không chia sẻ mật khẩu với người khác." label="Mật khẩu" placeholder="Nhập mật khẩu" />
    </div>
  )
};

export const TextareaExample: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <Textarea
        helperText="Tối đa 500 ký tự."
        label="Ghi chú"
        placeholder="Nhập ghi chú nội bộ"
        rows={4}
      />
    </div>
  )
};

export const FormGroup: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, width: 420 }}>
      <Input label="Họ và tên" placeholder="Nguyễn Văn A" prefix={<User size={16} />} required />
      <Input label="Email" placeholder="name@example.com" prefix={<Mail size={16} />} required type="email" />
      <PasswordInput label="Mật khẩu" placeholder="Nhập mật khẩu" required />
      <Textarea label="Ghi chú" placeholder="Thông tin thêm" rows={3} />
    </div>
  )
};

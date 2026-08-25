import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight, Check, Download, ExternalLink, Plus, Save, Search, Trash2 } from "lucide-react";

import { Button } from "./Button";

const variants = ["primary", "secondary", "outline", "ghost", "danger", "success", "link"] as const;
const sizes = ["sm", "md", "lg"] as const;

const meta = {
  title: "Components/Button",
  component: Button,
  args: {
    children: "Button",
    size: "md",
    type: "button",
    variant: "primary"
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: sizes
    },
    variant: {
      control: "inline-radio",
      options: variants
    }
  },
  parameters: {
    layout: "centered"
  }
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    children: "Tạo mới",
    leftIcon: <Plus size={16} />,
    rightIcon: <ArrowRight size={16} />
  }
};

export const OrangePrimary: Story = {
  args: {
    children: "Bắt đầu",
    rightIcon: <ArrowRight size={16} />,
    variant: "primary"
  }
};

export const AppDownloadPrimary: Story = {
  render: () => (
    <Button
      size="lg"
      style={{
        height: 60,
        minWidth: 246
      }}
      variant="primary"
    >
      TẢI ỨNG DỤNG NGAY
    </Button>
  )
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: 12 }}>
      <Button leftIcon={<Plus size={16} />} variant="primary">
        Primary
      </Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button leftIcon={<Trash2 size={16} />} variant="danger">
        Xóa dữ liệu
      </Button>
      <Button leftIcon={<Check size={16} />} variant="success">
        Success
      </Button>
      <Button rightIcon={<ExternalLink size={16} />} variant="link">
        Link
      </Button>
    </div>
  )
};

export const Sizes: Story = {
  render: () => (
    <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: 12 }}>
      {sizes.map((size) => (
        <Button key={size} size={size}>
          {size.toUpperCase()}
        </Button>
      ))}
    </div>
  )
};

export const WithIcons: Story = {
  render: () => (
    <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: 12 }}>
      <Button leftIcon={<Search size={16} />} variant="secondary">
        Tìm kiếm
      </Button>
      <Button leftIcon={<Save size={16} />}>Lưu thay đổi</Button>
      <Button rightIcon={<Download size={16} />} variant="outline">
        Tải xuống
      </Button>
    </div>
  )
};

export const States: Story = {
  render: () => (
    <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: 12 }}>
      <Button loading>Đang lưu</Button>
      <Button disabled>Đã khóa</Button>
      <Button disabled variant="secondary">
        Secondary disabled
      </Button>
      <Button loading variant="outline">
        Đang xử lý
      </Button>
    </div>
  )
};

export const DangerWarning: Story = {
  render: () => (
    <Button leftIcon={<Trash2 size={16} />} variant="danger">
      XÓA VĨNH VIỄN
    </Button>
  )
};

export const FullWidth: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12, width: 360 }}>
      <Button block size="lg">
        Tiếp tục
      </Button>
      <Button block size="lg" variant="secondary">
        Quay lại
      </Button>
    </div>
  )
};

export const AsChild: Story = {
  render: () => (
    <Button asChild rightIcon={<ExternalLink size={16} />} variant="outline">
      <a href="https://example.com">Mở liên kết</a>
    </Button>
  )
};

export const OnOrangeSurface: Story = {
  render: () => (
    <div
      style={{
        alignItems: "center",
        background: "var(--sb-orange-gradient)",
        borderRadius: 8,
        color: "#111827",
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        padding: 24
      }}
    >
      <Button variant="secondary">Nút nền trắng</Button>
      <Button variant="outline">Nút viền</Button>
      <Button variant="ghost">Nút ghost</Button>
    </div>
  )
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell, Check, Download, Heart, MoreHorizontal, Pencil, Search, Settings, Trash2, X } from "lucide-react";

import { IconButton } from "./IconButton";

const variants = ["primary", "secondary", "outline", "ghost", "danger", "success", "link"] as const;
const sizes = ["sm", "md", "lg"] as const;

const meta = {
  title: "Components/IconButton",
  component: IconButton,
  args: {
    icon: <Search size={18} />,
    label: "Tìm kiếm",
    size: "md",
    type: "button",
    variant: "secondary"
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
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllVariants: Story = {
  render: () => (
    <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: 12 }}>
      <IconButton icon={<Search size={18} />} label="Tìm kiếm" variant="primary" />
      <IconButton icon={<Settings size={18} />} label="Cài đặt" variant="secondary" />
      <IconButton icon={<Pencil size={18} />} label="Chỉnh sửa" variant="outline" />
      <IconButton icon={<MoreHorizontal size={18} />} label="Xem thêm" variant="ghost" />
      <IconButton icon={<Trash2 size={18} />} label="Xóa dữ liệu" variant="danger" />
      <IconButton icon={<Check size={18} />} label="Xác nhận" variant="success" />
      <IconButton icon={<Download size={18} />} label="Tải xuống" variant="link" />
    </div>
  )
};

export const Sizes: Story = {
  render: () => (
    <div style={{ alignItems: "center", display: "flex", gap: 12 }}>
      <IconButton icon={<Bell size={16} />} label="Thông báo nhỏ" size="sm" />
      <IconButton icon={<Bell size={18} />} label="Thông báo vừa" size="md" />
      <IconButton icon={<Bell size={20} />} label="Thông báo lớn" size="lg" />
    </div>
  )
};

export const States: Story = {
  render: () => (
    <div style={{ alignItems: "center", display: "flex", gap: 12 }}>
      <IconButton icon={<Heart size={18} />} label="Yêu thích" />
      <IconButton disabled icon={<Pencil size={18} />} label="Không thể chỉnh sửa" />
      <IconButton icon={<Download size={18} />} label="Đang tải" loading />
      <IconButton icon={<Trash2 size={18} />} label="Xóa vĩnh viễn" variant="danger" />
    </div>
  )
};

export const WithoutTooltip: Story = {
  args: {
    icon: <X size={18} />,
    label: "Đóng",
    tooltip: null,
    variant: "ghost"
  }
};

export const Toolbar: Story = {
  render: () => (
    <div
      style={{
        alignItems: "center",
        border: "1px solid var(--sb-color-border)",
        borderRadius: 8,
        display: "flex",
        gap: 8,
        padding: 8
      }}
    >
      <IconButton icon={<Search size={18} />} label="Tìm kiếm" variant="ghost" />
      <IconButton icon={<Pencil size={18} />} label="Chỉnh sửa" variant="ghost" />
      <IconButton icon={<Download size={18} />} label="Tải xuống" variant="ghost" />
      <IconButton icon={<Trash2 size={18} />} label="Xóa" variant="danger" />
    </div>
  )
};

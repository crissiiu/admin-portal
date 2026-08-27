import type { Meta, StoryObj } from "@storybook/react-vite";
import { BriefcaseBusiness, CheckCircle2, Clock, FileText, Settings, Users } from "lucide-react";
import { useState } from "react";

import { Card, CardContent } from "../card";
import { Tabs, type TabItem } from "./Tabs";

const variants = ["line", "pills", "boxed"] as const;
const sizes = ["small", "middle", "large"] as const;

const demoItems: TabItem[] = [
  {
    children: "Danh sách khách hàng tiềm năng và các cơ hội cần chăm sóc.",
    key: "leads",
    label: "Leads"
  },
  {
    children: "Các deal đang trong quá trình thương lượng hoặc chờ xác nhận.",
    key: "deals",
    label: "Deals"
  },
  {
    children: "Báo cáo hiệu suất theo ngày, tuần và tháng.",
    key: "reports",
    label: "Reports"
  }
];

const iconItems: TabItem[] = [
  {
    children: "Tổng quan hồ sơ và trạng thái hiện tại.",
    icon: <FileText size={16} />,
    key: "overview",
    label: "Tổng quan"
  },
  {
    children: "Danh sách ứng viên đang theo dõi.",
    icon: <Users size={16} />,
    key: "candidates",
    label: "Ứng viên"
  },
  {
    children: "Cấu hình quy trình và quyền truy cập.",
    icon: <Settings size={16} />,
    key: "settings",
    label: "Cài đặt"
  }
];

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  args: {
    defaultValue: "leads",
    items: demoItems,
    variant: "line"
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
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div style={{ width: 560 }}>
      <Tabs {...args} />
    </div>
  )
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 28, width: 620 }}>
      <Tabs defaultValue="leads" items={demoItems} variant="line" />
      <Tabs defaultValue="leads" items={demoItems} variant="pills" />
      <Tabs defaultValue="leads" items={demoItems} variant="boxed" />
    </div>
  )
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 24, width: 560 }}>
      <Tabs defaultValue="leads" items={demoItems} size="small" variant="pills" />
      <Tabs defaultValue="leads" items={demoItems} size="middle" variant="pills" />
      <Tabs defaultValue="leads" items={demoItems} size="large" variant="pills" />
    </div>
  )
};

export const WithIcons: Story = {
  render: () => (
    <div style={{ width: 620 }}>
      <Tabs defaultValue="overview" items={iconItems} variant="line" />
    </div>
  )
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState("active");
    const items: TabItem[] = [
      {
        children: "Deal đang hoạt động và cần xử lý tiếp.",
        icon: <Clock size={16} />,
        key: "active",
        label: "Đang xử lý"
      },
      {
        children: "Deal đã hoàn thành trong tháng.",
        icon: <CheckCircle2 size={16} />,
        key: "done",
        label: "Hoàn tất"
      },
      {
        children: "Deal thuộc nhóm bán hàng doanh nghiệp.",
        icon: <BriefcaseBusiness size={16} />,
        key: "enterprise",
        label: "Enterprise"
      }
    ];

    return (
      <div style={{ display: "grid", gap: 16, width: 620 }}>
        <Card variant="accent">
          <CardContent>
            <p className="text-sm text-[var(--sb-color-muted)]">Tab hiện tại</p>
            <p className="mt-1 text-lg font-semibold text-[var(--sb-color-foreground)]">{value}</p>
          </CardContent>
        </Card>
        <Tabs items={items} value={value} variant="pills" onValueChange={setValue} />
      </div>
    );
  }
};

export const DisabledTab: Story = {
  render: () => (
    <div style={{ width: 560 }}>
      <Tabs
        defaultValue="draft"
        items={[
          {
            children: "Nội dung đang soạn.",
            key: "draft",
            label: "Bản nháp"
          },
          {
            children: "Chỉ mở sau khi hoàn tất cấu hình.",
            disabled: true,
            key: "published",
            label: "Đã đăng"
          },
          {
            children: "Nội dung đã lưu trữ.",
            key: "archived",
            label: "Lưu trữ"
          }
        ]}
        variant="boxed"
      />
    </div>
  )
};

export const Vertical: Story = {
  render: () => (
    <div style={{ width: 720 }}>
      <Tabs defaultValue="overview" items={iconItems} placement="left" variant="line" />
    </div>
  )
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight, BriefcaseBusiness, Car, DollarSign, MapPin, MoreHorizontal, Users } from "lucide-react";

import { Button } from "../button";
import { IconButton } from "../icon-button";
import { Card, CardContent, CardFooter, CardHeader, FeatureCard } from "./Card";

const variants = ["default", "outlined", "elevated", "accent", "interactive"] as const;

const meta = {
  title: "Components/Card",
  component: Card,
  args: {
    children: "Card content",
    variant: "default"
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: variants
    }
  },
  parameters: {
    layout: "centered"
  }
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Card {...args} style={{ width: 360 }}>
      <CardHeader>
        <h3 className="text-base font-semibold text-[var(--sb-color-foreground)]">Sales Pipeline</h3>
        <p className="text-sm text-[var(--sb-color-muted)]">Tổng quan cơ hội trong tháng.</p>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-[var(--sb-color-muted)]">
          Theo dõi số lượng lead, giá trị deal và trạng thái xử lý trong cùng một khu vực.
        </p>
      </CardContent>
    </Card>
  )
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, width: 420 }}>
      {variants.map((variant) => (
        <Card key={variant} variant={variant}>
          <CardContent className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-[var(--sb-color-foreground)]">{variant}</h3>
              <p className="text-sm text-[var(--sb-color-muted)]">Mẫu card variant {variant}.</p>
            </div>
            <ArrowRight size={18} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
};

export const FeatureMediaCard: Story = {
  parameters: {
    layout: "fullscreen"
  },
  render: () => (
    <div style={{ padding: 0 }}>
      <FeatureCard
        actionLabel="TÌM HIỂU THÊM"
        icon={<Car size={56} strokeWidth={3} />}
        imageAlt="Người dùng dịch vụ vận chuyển trên xe máy"
        imageSrc="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80"
        title="Vận chuyển"
        description={
          <>
            Di chuyển thật tiện lợi với <strong className="text-[#FCB900]">beBike, beCar, beTaxi</strong> - đã có mặt tại nhiều tỉnh, thành phố trên toàn quốc.
          </>
        }
      />
    </div>
  )
};

export const MetricCard: Story = {
  render: () => (
    <Card style={{ width: 320 }} variant="elevated">
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <div className="rounded-md bg-[rgb(255_105_0_/_0.1)] p-2 text-[var(--sb-orange-gradient-end)]">
            <DollarSign size={20} />
          </div>
          <span className="text-sm font-medium text-emerald-700">+12.4%</span>
        </div>
        <p className="text-sm text-[var(--sb-color-muted)]">Doanh thu dự kiến</p>
        <p className="mt-1 text-2xl font-semibold text-[var(--sb-color-foreground)]">1.24B</p>
      </CardContent>
    </Card>
  )
};

export const JobCard: Story = {
  render: () => (
    <Card style={{ width: 420 }} variant="interactive">
      <CardHeader className="flex-row items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-[var(--sb-color-foreground)]">Sales Executive</h3>
          <p className="text-sm text-[var(--sb-color-muted)]">Acme Growth Team</p>
        </div>
        <IconButton icon={<MoreHorizontal size={18} />} label="Mở menu" tooltip="Mở menu" variant="ghost" />
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="flex items-center gap-2 text-sm text-[var(--sb-color-muted)]">
          <MapPin size={16} />
          Hồ Chí Minh
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--sb-color-muted)]">
          <BriefcaseBusiness size={16} />
          Full-time
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--sb-color-muted)]">
          <Users size={16} />
          24 ứng viên
        </div>
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="secondary">
          Lưu
        </Button>
        <Button size="sm">Ứng tuyển</Button>
      </CardFooter>
    </Card>
  )
};

export const AccentCard: Story = {
  render: () => (
    <Card style={{ width: 380 }} variant="accent">
      <CardContent>
        <p className="text-sm font-semibold uppercase text-[var(--sb-orange-gradient-end)]">Gợi ý</p>
        <h3 className="mt-2 text-lg font-semibold text-[var(--sb-color-foreground)]">Ưu tiên lead có intent cao</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--sb-color-muted)]">
          Card accent dùng cho thông tin nổi bật nhưng không phải alert.
        </p>
      </CardContent>
    </Card>
  )
};

export const WithActions: Story = {
  render: () => (
    <Card style={{ width: 420 }}>
      <CardHeader>
        <h3 className="text-base font-semibold text-[var(--sb-color-foreground)]">Xác nhận thay đổi</h3>
        <p className="text-sm text-[var(--sb-color-muted)]">Các thay đổi sẽ được áp dụng cho hồ sơ hiện tại.</p>
      </CardHeader>
      <CardFooter>
        <Button variant="secondary">Hủy</Button>
        <Button>Lưu thay đổi</Button>
      </CardFooter>
    </Card>
  )
};

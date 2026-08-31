import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../button";
import { Alert } from "./Alert";

const types = ["info", "success", "warning", "error"] as const;
const variants = ["soft", "outline", "filled"] as const;

const meta = {
  title: "Components/Alert",
  component: Alert,
  args: {
    children: "Nội dung thông báo ngắn gọn cho người dùng.",
    title: "Thông báo",
    type: "info",
    variant: "soft"
  },
  argTypes: {
    type: {
      control: "inline-radio",
      options: types
    },
    variant: {
      control: "inline-radio",
      options: variants
    }
  },
  parameters: {
    layout: "centered"
  }
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div style={{ width: 520 }}>
      <Alert {...args} />
    </div>
  )
};

export const Types: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12, width: 560 }}>
      <Alert title="Thông tin" type="info">
        Hồ sơ của bạn đang được đồng bộ.
      </Alert>
      <Alert title="Thành công" type="success">
        Thay đổi đã được lưu.
      </Alert>
      <Alert title="Cần chú ý" type="warning">
        Một vài trường còn thiếu thông tin.
      </Alert>
      <Alert title="Có lỗi xảy ra" type="error">
        Không thể gửi yêu cầu. Vui lòng thử lại.
      </Alert>
    </div>
  )
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12, width: 560 }}>
      <Alert title="Soft" type="info" variant="soft">
        Nền nhẹ, dùng cho thông báo trong luồng thao tác.
      </Alert>
      <Alert title="Outline" type="warning" variant="outline">
        Viền rõ, dùng khi cần cảnh báo nhưng không muốn chiếm quá nhiều thị giác.
      </Alert>
      <Alert title="Filled" type="error" variant="filled">
        Nền đặc, dùng cho lỗi quan trọng hoặc trạng thái cần xử lý ngay.
      </Alert>
    </div>
  )
};

export const Closable: Story = {
  render: () => (
    <div style={{ width: 560 }}>
      <Alert closable title="Có cập nhật mới" type="info">
        Phiên bản giao diện mới đã sẵn sàng để kiểm tra.
      </Alert>
    </div>
  )
};

export const WithAction: Story = {
  render: () => (
    <div style={{ width: 620 }}>
      <Alert
        action={
          <Button size="sm" variant="secondary">
            Xem chi tiết
          </Button>
        }
        title="Thanh toán cần xác nhận"
        type="warning"
        variant="outline"
      >
        Giao dịch sẽ hết hạn sau 15 phút nếu chưa được xác nhận.
      </Alert>
    </div>
  )
};

export const FormError: Story = {
  render: () => (
    <div style={{ width: 560 }}>
      <Alert title="Không thể lưu form" type="error">
        Vui lòng kiểm tra lại các trường bắt buộc trước khi tiếp tục.
      </Alert>
    </div>
  )
};

export const FilledSet: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12, width: 560 }}>
      {types.map((type) => (
        <Alert key={type} title={type} type={type} variant="filled">
          Alert filled dùng cho trạng thái {type}.
        </Alert>
      ))}
    </div>
  )
};

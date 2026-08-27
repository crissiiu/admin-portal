import type { Meta, StoryObj } from "@storybook/react-vite";
import { MoreHorizontal, Search, UserRound } from "lucide-react";

import { Button } from "../button";
import { Card, CardContent } from "../card";
import { IconButton } from "../icon-button";
import { DataList, DataTable, type DataTableProps } from "./DataTable";

const meta = {
  title: "Components/Table Data List",
  parameters: {
    layout: "centered"
  }
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

type Candidate = {
  id: string;
  name: string;
  owner: string;
  role: string;
  status: "Mới" | "Đang phỏng vấn" | "Đã nhận";
  updatedAt: string;
};

const candidates: Candidate[] = [
  {
    id: "C-1042",
    name: "Nguyễn Minh Anh",
    owner: "Lan Phạm",
    role: "Frontend Developer",
    status: "Đang phỏng vấn",
    updatedAt: "27/08/2026"
  },
  {
    id: "C-1043",
    name: "Trần Quốc Huy",
    owner: "Minh Võ",
    role: "Sales Executive",
    status: "Mới",
    updatedAt: "26/08/2026"
  },
  {
    id: "C-1044",
    name: "Lê Hoàng Nam",
    owner: "Lan Phạm",
    role: "Account Manager",
    status: "Đã nhận",
    updatedAt: "25/08/2026"
  },
  {
    id: "C-1045",
    name: "Phạm Thanh Mai",
    owner: "Hà Nguyễn",
    role: "Customer Success",
    status: "Đang phỏng vấn",
    updatedAt: "24/08/2026"
  }
];

const statusClassName: Record<Candidate["status"], string> = {
  "Mới": "border-[#1068B4]/20 bg-[#1068B4]/10 text-[#1068B4]",
  "Đang phỏng vấn": "border-[#FF6900]/20 bg-[#FCB900]/20 text-[#9A4A00]",
  "Đã nhận": "border-emerald-600/20 bg-emerald-600/10 text-emerald-700"
};

const columns: DataTableProps<Candidate>["columns"] = [
  {
    dataIndex: "id",
    title: "Mã"
  },
  {
    dataIndex: "name",
    title: "Ứng viên",
    render: (value: Candidate["name"]) => <span className="font-semibold text-[var(--sb-color-foreground)]">{value}</span>
  },
  {
    dataIndex: "role",
    title: "Vị trí"
  },
  {
    dataIndex: "owner",
    title: "Phụ trách"
  },
  {
    dataIndex: "status",
    title: "Trạng thái",
    render: (value: Candidate["status"]) => (
      <span
        className={`inline-flex rounded-[var(--sb-radius-sm)] border px-2 py-1 text-xs font-semibold ${statusClassName[value]}`}
      >
        {value}
      </span>
    )
  },
  {
    dataIndex: "updatedAt",
    title: "Cập nhật"
  },
  {
    key: "actions",
    title: "",
    render: () => <IconButton icon={<MoreHorizontal size={16} />} label="Mở thao tác" variant="ghost" />
  }
];

export const Playground: Story = {
  render: () => (
    <div className="w-[920px] max-w-[calc(100vw-32px)]">
      <DataTable<Candidate> columns={columns} data={candidates} rowKey="id" />
    </div>
  )
};

export const Densities: Story = {
  render: () => (
    <div className="grid w-[920px] max-w-[calc(100vw-32px)] gap-6">
      <DataTable<Candidate> columns={columns.slice(0, 4)} data={candidates.slice(0, 2)} density="compact" rowKey="id" />
      <DataTable<Candidate>
        columns={columns.slice(0, 4)}
        data={candidates.slice(0, 2)}
        density="comfortable"
        rowKey="id"
      />
      <DataTable<Candidate> columns={columns.slice(0, 4)} data={candidates.slice(0, 2)} density="spacious" rowKey="id" />
    </div>
  )
};

export const WithPagination: Story = {
  render: () => (
    <div className="w-[920px] max-w-[calc(100vw-32px)]">
      <DataTable<Candidate> columns={columns} data={candidates} pagination={{ pageSize: 2 }} rowKey="id" />
    </div>
  )
};

export const EmptyState: Story = {
  render: () => (
    <div className="w-[720px] max-w-[calc(100vw-32px)]">
      <DataTable<Candidate> columns={columns.slice(0, 4)} data={[]} emptyText="Chưa có ứng viên phù hợp" rowKey="id" />
    </div>
  )
};

export const LoadingState: Story = {
  render: () => (
    <div className="w-[720px] max-w-[calc(100vw-32px)]">
      <DataTable<Candidate> columns={columns.slice(0, 4)} data={[]} loading rowKey="id" />
    </div>
  )
};

export const DataListCards: Story = {
  render: () => (
    <div className="w-[520px] max-w-[calc(100vw-32px)]">
      <DataList<Candidate>
        getKey={(item) => item.id}
        items={candidates.slice(0, 3)}
        renderItem={(item) => (
          <Card className="w-full" variant="outlined">
            <CardContent className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--sb-radius-md)] bg-[var(--sb-orange-gradient)] text-[#111827]">
                  <UserRound size={18} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[var(--sb-color-foreground)]">{item.name}</p>
                  <p className="text-sm text-[var(--sb-color-muted)]">{item.role}</p>
                  <p className="mt-2 text-xs text-[var(--sb-color-muted)]">Cập nhật {item.updatedAt}</p>
                </div>
              </div>
              <Button leftIcon={<Search size={16} />} size="sm" variant="secondary">
                Xem
              </Button>
            </CardContent>
          </Card>
        )}
      />
    </div>
  )
};

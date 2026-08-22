import type { Job } from "../model/job.types";

export function JobStatusBadge({ status }: { status: Job["status"] }) {
  const label = status === "open" ? "Đang tuyển" : "Đã đóng";
  const className =
    status === "open"
      ? "border-green-200 bg-green-50 text-green-700"
      : "border-slate-200 bg-slate-100 text-slate-600";

  return <span className={`rounded-md border px-2 py-1 text-xs font-medium ${className}`}>{label}</span>;
}


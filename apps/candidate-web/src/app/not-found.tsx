import Link from "next/link";

import { routes } from "@/config/routes";

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-start justify-center gap-4 px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">404</p>
      <h1 className="text-3xl font-semibold text-slate-950">Không tìm thấy trang</h1>
      <p className="text-slate-600">Đường dẫn này không tồn tại hoặc đã được di chuyển.</p>
      <Link className="text-sm font-medium text-blue-700 hover:text-blue-900" href={routes.jobs()}>
        Quay lại danh sách việc làm
      </Link>
    </main>
  );
}


"use client";

import { Button } from "@job-portal/ui";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="vi">
      <body>
        <main className="mx-auto flex min-h-screen max-w-xl flex-col items-start justify-center gap-4 px-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-red-600">System error</p>
          <h1 className="text-3xl font-semibold text-slate-950">Frontend gặp lỗi ngoài dự kiến</h1>
          <p className="text-slate-600">Vui lòng thử lại. Nếu lỗi tiếp diễn, request id sẽ được ghi nhận ở server log.</p>
          <Button onClick={reset}>Thử lại</Button>
        </main>
      </body>
    </html>
  );
}


"use client";

import { Button } from "@job-portal/ui";

export default function JobsError({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <h2 className="text-xl font-semibold text-slate-950">Không tải được danh sách việc làm</h2>
      <p className="mt-2 text-slate-600">Hãy thử lại sau ít phút.</p>
      <Button className="mt-4" onClick={reset}>
        Tải lại
      </Button>
    </main>
  );
}


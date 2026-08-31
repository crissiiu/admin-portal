"use client";

import { Button } from "@job-portal/ui";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="vi">
      <body>
        <main className="mx-auto flex min-h-screen max-w-xl flex-col items-start justify-center gap-4 px-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-red-600">System error</p>
          <h1 className="text-3xl font-semibold text-slate-950">Frontend g{"\u1eb7"}p l{"\u1ed7"}i ngo{"\u00e0"}i d{"\u1ef1"} ki{"\u1ebf"}n</h1>
          <p className="text-slate-600">Vui l{"\u00f2"}ng th{"\u1eed"} l{"\u1ea1"}i. N{"\u1ebf"}u l{"\u1ed7"}i ti{"\u1ebf"}p di{"\u1ec5"}n, request id s{"\u1ebd"} {"\u0111\u01b0\u1ee3"}c ghi nh{"\u1ead"}n {"\u1edf"} server log.</p>
          <Button onClick={reset}>Th{"\u1eed"} l{"\u1ea1"}i</Button>
        </main>
      </body>
    </html>
  );
}

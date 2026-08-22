import Link from "next/link";

import { Button } from "@job-portal/ui";

import { routes } from "@/config/routes";

export function AppHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link className="text-base font-semibold text-slate-950" href={routes.jobs()}>
          Job Portal
        </Link>
        <nav className="flex items-center gap-2 text-sm text-slate-700">
          <Link className="px-2 py-1 hover:text-blue-700" href={routes.jobs()}>
            Việc làm
          </Link>
          <Link className="px-2 py-1 hover:text-blue-700" href={routes.applications()}>
            Hồ sơ ứng tuyển
          </Link>
          <Button asChild size="sm" variant="secondary">
            <Link href={routes.signIn()}>Đăng nhập</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}


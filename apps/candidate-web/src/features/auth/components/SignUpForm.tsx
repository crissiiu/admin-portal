import Link from "next/link";

import { Button } from "@job-portal/ui";

import { routes } from "@/config/routes";

export function SignUpForm() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-950">Tạo tài khoản</h1>
      <div className="mt-6 grid gap-4">
        <input className="h-10 rounded-md border border-slate-300 px-3 text-sm" placeholder="Họ tên" />
        <input className="h-10 rounded-md border border-slate-300 px-3 text-sm" placeholder="Email" type="email" />
        <input className="h-10 rounded-md border border-slate-300 px-3 text-sm" placeholder="Mật khẩu" type="password" />
        <Button type="button">Đăng ký</Button>
      </div>
      <Link className="mt-4 block text-sm text-blue-700" href={routes.signIn()}>
        Đã có tài khoản
      </Link>
    </section>
  );
}


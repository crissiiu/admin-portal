import { Button } from "@job-portal/ui";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-start justify-center gap-4 px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-[#1068B4]">404</p>
      <h1 className="text-3xl font-semibold text-slate-950">Kh{"\u00f4"}ng t{"\u00ec"}m th{"\u1ea5"}y trang</h1>
      <p className="text-slate-600">
        {"\u0110\u01b0\u1edd"}ng d{"\u1eab"}n n{"\u00e0"}y kh{"\u00f4"}ng t{"\u1ed3"}n t{"\u1ea1"}i ho{"\u1eb7"}c {"\u0111\u00e3"} {"\u0111\u01b0\u1ee3"}c g{"\u1ee1"} kh{"\u1ecf"}i phi{"\u00ean"}n b{"\u1ea3"}n kh{"\u1edfi"}i t{"\u1ea1"}o l{"\u1ea1"}i.
      </p>
      <Button asChild variant="secondary">
        <Link href="/">Quay l{"\u1ea1"}i trang ch{"\u1ee7"}</Link>
      </Button>
    </main>
  );
}

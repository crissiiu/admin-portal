import Link from "next/link";

import { routes } from "@/config/routes";
import { AppHeader } from "@/widgets/app-header";

type DashboardItem = "profile" | "applications";

const navItems: Array<{ id: DashboardItem; href: string; label: string }> = [
  { id: "profile", href: routes.profile(), label: "Hồ sơ cá nhân" },
  { id: "applications", href: routes.applications(), label: "Ứng tuyển" }
];

export function CandidateDashboardShell({ activeItem }: { activeItem: DashboardItem }) {
  return (
    <>
      <AppHeader />
      <main className="mx-auto grid max-w-6xl gap-6 px-6 py-8 md:grid-cols-[220px_1fr]">
        <aside className="rounded-lg border border-slate-200 bg-white p-3">
          <nav className="grid gap-1">
            {navItems.map((item) => (
              <Link
                className={`rounded-md px-3 py-2 text-sm ${
                  item.id === activeItem ? "bg-blue-50 font-medium text-blue-700" : "text-slate-700 hover:bg-slate-50"
                }`}
                href={item.href}
                key={item.id}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-950">
            {activeItem === "profile" ? "Hồ sơ cá nhân" : "Hồ sơ ứng tuyển"}
          </h1>
          <p className="mt-2 text-slate-600">Khu vực dashboard đã sẵn boundary để nối API và feature tiếp theo.</p>
        </section>
      </main>
    </>
  );
}


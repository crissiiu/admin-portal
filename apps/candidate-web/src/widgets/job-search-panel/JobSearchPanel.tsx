import { JobCard } from "@/entities/job";
import { JobSearchForm, searchJobs } from "@/features/job-search";
import { AppHeader } from "@/widgets/app-header";

export async function JobSearchPanel() {
  const jobs = await searchJobs().catch(() => []);

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-slate-950">Tìm việc phù hợp</h1>
          <p className="mt-2 text-slate-600">Khám phá cơ hội mới từ các công ty đang tuyển dụng.</p>
        </div>
        <JobSearchForm />
        <section className="mt-6 grid gap-4">
          {jobs.length > 0 ? (
            jobs.map((job) => <JobCard job={job} key={job.id} />)
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
              Chưa có dữ liệu việc làm. Kết nối API gateway để hiển thị danh sách thật.
            </div>
          )}
        </section>
      </main>
    </>
  );
}


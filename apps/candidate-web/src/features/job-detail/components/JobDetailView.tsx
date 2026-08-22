import { Button } from "@job-portal/ui";

import { JobStatusBadge } from "@/entities/job";
import { ApplicationSubmitForm } from "@/features/application-submit";

import { getJobDetail } from "../api/get-job-detail.query";

export async function JobDetailView({ jobId }: { jobId: string }) {
  const job = await getJobDetail(jobId);

  return (
    <main className="mx-auto max-w-4xl px-6 py-8">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-slate-950">{job.title}</h1>
            <p className="mt-2 text-slate-600">{job.companyName}</p>
          </div>
          <JobStatusBadge status={job.status} />
        </div>
        <p className="mt-6 text-slate-700">Địa điểm: {job.location}</p>
        <div className="mt-6 flex gap-3">
          <ApplicationSubmitForm jobId={job.id} />
          <Button variant="secondary">Lưu việc</Button>
        </div>
      </div>
    </main>
  );
}


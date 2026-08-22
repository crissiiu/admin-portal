import Link from "next/link";

import { routes } from "@/config/routes";

import { formatSalary } from "../lib/format-salary";
import type { Job } from "../model/job.types";
import { JobStatusBadge } from "./JobStatusBadge";

export function JobCard({ job }: { job: Job }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link className="text-lg font-semibold text-slate-950 hover:text-blue-700" href={routes.jobDetail(job.id)}>
            {job.title}
          </Link>
          <p className="mt-1 text-sm text-slate-600">{job.companyName}</p>
        </div>
        <JobStatusBadge status={job.status} />
      </div>
      <dl className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
        <div>
          <dt className="font-medium text-slate-800">Địa điểm</dt>
          <dd>{job.location}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-800">Lương</dt>
          <dd>{formatSalary(job)}</dd>
        </div>
      </dl>
    </article>
  );
}


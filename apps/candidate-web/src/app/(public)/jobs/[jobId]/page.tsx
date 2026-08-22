import { JobDetailView } from "@/features/job-detail";

export default function JobDetailPage({ params }: { params: { jobId: string } }) {
  return <JobDetailView jobId={params.jobId} />;
}


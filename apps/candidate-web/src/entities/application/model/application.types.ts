export interface Application {
  id: string;
  jobId: string;
  status: "draft" | "submitted" | "reviewing" | "rejected" | "accepted";
}


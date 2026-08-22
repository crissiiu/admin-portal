export type JobStatus = "draft" | "published" | "closed";
export type JobType = "full_time" | "part_time" | "contract" | "internship" | "remote";

export class Job {
  constructor(
    public readonly id: string,
    public readonly employerId: string,
    public readonly companyId: string,
    public readonly title: string,
    public readonly description: string,
    public readonly location: string,
    public readonly jobType: JobType,
    public readonly status: JobStatus,
    public readonly createdAt: string,
    public readonly publishedAt: string | null
  ) {}

  static create(input: {
    employerId: string;
    companyId: string;
    title: string;
    description: string;
    location: string;
    jobType: JobType;
  }) {
    return new Job(
      crypto.randomUUID(),
      input.employerId,
      input.companyId,
      input.title,
      input.description,
      input.location,
      input.jobType,
      "draft",
      new Date().toISOString(),
      null
    );
  }

  publish() {
    return new Job(
      this.id,
      this.employerId,
      this.companyId,
      this.title,
      this.description,
      this.location,
      this.jobType,
      "published",
      this.createdAt,
      new Date().toISOString()
    );
  }
}

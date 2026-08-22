export interface Job {
  id: string;
  title: string;
  companyName: string;
  location: string;
  salaryRange?: {
    min: number;
    max: number;
  };
  status: "open" | "closed";
}


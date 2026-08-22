export interface JobDto {
  id: string;
  title: string;
  companyName: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  status: "open" | "closed";
}


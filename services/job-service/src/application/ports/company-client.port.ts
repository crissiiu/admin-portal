export interface CompanyClientPort {
  ensureCompanyCanPublishJob(companyId: string, employerId: string): Promise<void>;
}

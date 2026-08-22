export interface TokenVerifierPort {
  verify(token: string): Promise<{ subject: string; role: string }>;
}

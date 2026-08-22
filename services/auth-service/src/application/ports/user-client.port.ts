export interface UserClientPort {
  createProfile(input: { authUserId: string; name: string; email: string; role: string }): Promise<void>;
}

export type UserStatus = "active" | "blocked" | "deleted";

export class UserProfile {
  constructor(
    public readonly id: string,
    public readonly authUserId: string,
    public readonly name: string,
    public readonly email: string,
    public readonly phoneNumber: string,
    public readonly bio: string | null,
    public readonly status: UserStatus
  ) {}

  update(input: { name?: string; phoneNumber?: string; bio?: string }) {
    return new UserProfile(
      this.id,
      this.authUserId,
      input.name ?? this.name,
      this.email,
      input.phoneNumber ?? this.phoneNumber,
      input.bio ?? this.bio,
      this.status
    );
  }
}

export type AuthRole = "candidate" | "employer" | "admin";

export class AuthUser {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly phoneNumber: string,
    public readonly role: AuthRole,
    public readonly passwordHash: string,
    public readonly createdAt: string
  ) {}

  static create(input: {
    name: string;
    email: string;
    phoneNumber: string;
    role: AuthRole;
    passwordHash: string;
  }) {
    return new AuthUser(
      crypto.randomUUID(),
      input.name,
      input.email.toLowerCase(),
      input.phoneNumber,
      input.role,
      input.passwordHash,
      new Date().toISOString()
    );
  }
}

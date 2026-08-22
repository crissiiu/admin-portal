import bcrypt from "bcrypt";

export interface PasswordService {
  hash(password: string): Promise<string>;
  compare(password: string, passwordHash: string): Promise<boolean>;
}

export class BcryptPasswordService implements PasswordService {
  async hash(password: string) {
    return bcrypt.hash(password, 12);
  }

  async compare(password: string, passwordHash: string) {
    return bcrypt.compare(password, passwordHash);
  }
}

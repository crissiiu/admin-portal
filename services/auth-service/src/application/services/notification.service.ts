export interface OtpSender {
  sendPhoneOtp(input: { phoneNumber: string; code: string; purpose: "register" | "reset_password" }): Promise<void>;
}

export interface PasswordResetSender {
  sendPasswordReset(input: { email: string | null; phoneNumber: string; token: string }): Promise<void>;
}

export class LocalNotificationService implements OtpSender, PasswordResetSender {
  async sendPhoneOtp(): Promise<void> {
    return;
  }

  async sendPasswordReset(): Promise<void> {
    return;
  }
}

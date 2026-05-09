import { NotificationPort } from "@/Domain/Services/Ports";

export class ConsoleNotificationAdapter implements NotificationPort {
  async sendSMS(input: { to: string; message: string }): Promise<void> {
    console.log("SMS", { to: input.to, message: input.message });
  }
}

import { ClockPort } from "@/Domain/Services/Ports";

export class SystemClock implements ClockPort {
  now(): Date {
    return new Date();
  }
}

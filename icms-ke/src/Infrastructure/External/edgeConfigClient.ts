import { get } from "@vercel/edge-config";

export interface WelcomePayload {
  greeting: string;
}

export async function getWelcomeGreeting(): Promise<string> {
  // Keep a deterministic fallback so /welcome works in local dev and CI
  // even when Edge Config key is missing.
  const value = await get<string>("greeting");
  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }

  return "Welcome to the Immigration Case Management System";
}

import { NextResponse } from "next/server";
import { getWelcomeGreeting } from "@/Infrastructure/External/edgeConfigClient";

export async function GET(): Promise<NextResponse> {
  try {
    const greeting = await getWelcomeGreeting();
    return NextResponse.json({ greeting }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Unable to load greeting from configuration" },
      { status: 503 }
    );
  }
}

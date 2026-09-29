import { NextResponse } from "next/server";
import { getPromptStats } from "@/lib/db/prompts";

export async function GET() {
  const stats = await getPromptStats();
  return NextResponse.json(stats);
}

import { NextRequest, NextResponse } from "next/server";
import { getPromptStats } from "@/lib/db/prompts";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId") || undefined;
  const stats = await getPromptStats(userId);
  return NextResponse.json(stats);
}

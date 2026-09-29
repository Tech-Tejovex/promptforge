import { NextResponse } from "next/server";
import { generatePrompt } from "@/lib/groq";

export async function POST(req: Request) {
  const { prompt, instructions } = await req.json();

  try {
    // Reuse the existing generatePrompt structure but with specific "optimize" instructions
    // For now, using the Groq logic directly for minimal change
    const optimized = await generatePrompt(
      "expert prompt engineer",
      `Original Prompt: ${prompt}\n\nOptimizing Instructions: ${instructions}\n\nRewrite the prompt to be more structured, detailed, and robust, while maintaining the intended outcome.`
    );

    return NextResponse.json({ result: optimized });
  } catch (e: any) {
    return NextResponse.json({ result: "Optimization failed: " + (e.message || String(e)) }, { status: 500 });
  }
}

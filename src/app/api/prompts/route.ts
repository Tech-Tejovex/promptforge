import { NextResponse } from "next/server";
import { savePrompt, getPrompts, deletePrompt } from "@/lib/db/prompts";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options?: any) { cookieStore.set(name, value); },
        remove(name: string, options?: any) { cookieStore.delete(name); },
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");
  const prompts = await getPrompts(user.id, limit, offset);
  return NextResponse.json({ prompts });
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options?: any) { cookieStore.set(name, value); },
        remove(name: string, options?: any) { cookieStore.delete(name); },
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { input, output, profession, folder_id } = body;

  if (!input || !output || !profession) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const prompt = await savePrompt({ input, output, profession, folder_id }, user.id);
  if (!prompt) {
    return NextResponse.json({ error: "Failed to save prompt" }, { status: 500 });
  }
  return NextResponse.json({ prompt });
}

export async function DELETE(req: Request) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options?: any) { cookieStore.set(name, value); },
        remove(name: string, options?: any) { cookieStore.delete(name); },
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  const ok = await deletePrompt(id, user.id);
  return NextResponse.json({ success: ok });
}

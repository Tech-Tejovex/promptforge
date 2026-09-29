import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const results: Record<string, any> = {};

  // Try with service role key if available
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  results.has_service_key = !!serviceKey;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

  // Try creating a service client if we have the key
  const client = serviceKey
    ? createClient(supabaseUrl, serviceKey)
    : createClient(supabaseUrl, anonKey);

  // Try insert with null user_id
  const { data: d1, error: e1 } = await client
    .from("prompts")
    .insert({ input: "test", output: "test", profession: "test", user_id: null })
    .select()
    .single();
  results.null_user = e1 ? e1.message : d1;

  // Try insert with a UUID user_id
  const { data: d2, error: e2 } = await client
    .from("prompts")
    .insert({ input: "test", output: "test", profession: "test", user_id: "00000000-0000-0000-0000-000000000000" })
    .select()
    .single();
  results.uuid_user = e2 ? e2.message : d2;

  // Cleanup
  if (d1?.id) await client.from("prompts").delete().eq("id", d1.id);
  if (d2?.id) await client.from("prompts").delete().eq("id", d2.id);

  return NextResponse.json(results);
}

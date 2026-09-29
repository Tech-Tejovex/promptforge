import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const results: Record<string, any> = {};

  // Test connection
  const { data: testData, error: testError } = await supabase.from("prompts").select("*").limit(1);
  results.prompts_table = testError ? { error: testError.message, code: testError.code } : { exists: true, sample: testData };

  const { data: foldersData, error: foldersError } = await supabase.from("folders").select("*").limit(1);
  results.folders_table = foldersError ? { error: foldersError.message, code: foldersError.code } : { exists: true, sample: foldersData };

  const { data: usersData, error: usersError } = await supabase.from("users").select("*").limit(1);
  results.users_table = usersError ? { error: usersError.message, code: usersError.code } : { exists: true, sample: usersData };

  return NextResponse.json(results);
}

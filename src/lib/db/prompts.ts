import { getServiceSupabase } from "@/lib/supabase";

export interface Prompt {
  id: string;
  input: string;
  output: string;
  profession: string;
  user_id: string | null;
  folder_id: string | null;
  is_optimized: boolean;
  created_at: string;
}

export async function savePrompt(data: {
  input: string;
  output: string;
  profession: string;
  folder_id?: string | null;
}, userId: string): Promise<Prompt | null> {
  const db = getServiceSupabase();
  const { data: row, error } = await db
    .from("prompts")
    .insert({
      input: data.input,
      output: data.output,
      profession: data.profession,
      user_id: userId,
      folder_id: data.folder_id || null,
      is_optimized: false,
    })
    .select()
    .single();

  if (error) {
    console.error("savePrompt error:", error.message);
    return null;
  }
  return row as Prompt;
}

export async function getPrompts(userId: string, limit = 50, offset = 0): Promise<Prompt[]> {
  const db = getServiceSupabase();
  const { data, error } = await db
    .from("prompts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("getPrompts error:", error.message);
    return [];
  }
  return (data || []) as Prompt[];
}

export async function getPromptsByFolder(folderId: string, userId: string): Promise<Prompt[]> {
  const db = getServiceSupabase();
  const { data, error } = await db
    .from("prompts")
    .select("*")
    .eq("folder_id", folderId)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getPromptsByFolder error:", error.message);
    return [];
  }
  return (data || []) as Prompt[];
}

export async function updatePromptOutput(id: string, output: string, userId: string): Promise<boolean> {
  const db = getServiceSupabase();
  const { error } = await db
    .from("prompts")
    .update({ output, is_optimized: true })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    console.error("updatePromptOutput error:", error.message);
    return false;
  }
  return true;
}

export async function deletePrompt(id: string, userId: string): Promise<boolean> {
  const db = getServiceSupabase();
  const { error } = await db
    .from("prompts")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    console.error("deletePrompt error:", error.message);
    return false;
  }
  return true;
}

export async function getPromptStats(): Promise<{
  total: number;
  optimizedPercent: number;
  byProfession: { name: string; count: number }[];
  recentActivity: { date: string; count: number }[];
}> {
  const db = getServiceSupabase();

  // Total count
  const { count: total } = await db
    .from("prompts")
    .select("*", { count: "exact", head: true });

  // All prompts for aggregation
  const { data: all } = await db
    .from("prompts")
    .select("profession, is_optimized, created_at");

  const prompts = all || [];

  // Optimized percentage
  const optimized = prompts.filter((p: any) => p.is_optimized).length;
  const optimizedPercent = total ? Math.round((optimized / total) * 100) : 0;

  // Group by profession
  const profMap: Record<string, number> = {};
  prompts.forEach((p: any) => {
    profMap[p.profession] = (profMap[p.profession] || 0) + 1;
  });
  const byProfession = Object.entries(profMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Recent activity (last 7 days)
  const recentActivity: { date: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const dayCount = prompts.filter((p: any) => p.created_at?.startsWith(dateStr)).length;
    recentActivity.push({ date: dateStr, count: dayCount });
  }

  return {
    total: total || 0,
    optimizedPercent,
    byProfession,
    recentActivity,
  };
}

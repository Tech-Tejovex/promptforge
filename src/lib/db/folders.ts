import { getServiceSupabase } from "@/lib/supabase";

export interface Folder {
  id: string;
  name: string;
  color: string;
  user_id: string;
  created_at: string;
  profession: string | null;
}

const DEFAULT_USER = "anonymous";

export async function getFolders(userId: string): Promise<Folder[]> {
  const db = getServiceSupabase();
  const { data, error } = await db
    .from("folders")
    .select("*")
    .eq("user_id", userId)
    .order("name", { ascending: true });

  if (error) {
    console.error("getFolders error:", error.message);
    return [];
  }
  return (data || []) as Folder[];
}

export async function createFolder(name: string, color = "#ffffff", profession: string | null = null, userId: string): Promise<Folder | null> {
  const db = getServiceSupabase();
  const { data, error } = await db
    .from("folders")
    .insert({ name, color, profession, user_id: userId })
    .select()
    .single();

  if (error) {
    console.error("createFolder error:", error.message);
    return null;
  }
  return data as Folder;
}

export async function deleteFolder(id: string, userId: string): Promise<boolean> {
  const db = getServiceSupabase();
  // Ensure we only delete if it belongs to the user
  await db.from("prompts").update({ folder_id: null }).eq("folder_id", id).eq("user_id", userId);

  const { error } = await db.from("folders").delete().eq("id", id).eq("user_id", userId);
  if (error) {
    console.error("deleteFolder error:", error.message);
    return false;
  }
  return true;
}

export async function renameFolder(id: string, name: string, userId: string): Promise<boolean> {
  const db = getServiceSupabase();
  const { error } = await db.from("folders").update({ name }).eq("id", id).eq("user_id", userId);
  if (error) {
    console.error("renameFolder error:", error.message);
    return false;
  }
  return true;
}

import { supabase } from "@/lib/supabase";

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  profession: string | null;
  preferred_language: string | null;
  created_at: string;
  updated_at: string;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) return null;
  return data as UserProfile;
}

export async function createUserProfile(userId: string, email: string, name?: string) {
  const { data, error } = await supabase
    .from("users")
    .insert({
      id: userId,
      email,
      name: name || null,
      profession: null,
      preferred_language: "English",
    })
    .select()
    .single();
  return { data: data as UserProfile | null, error: error?.message || null };
}

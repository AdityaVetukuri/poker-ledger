import { supabase } from "./supabaseClient";

export async function listHands() {
  const { data, error } = await supabase
    .from("hands")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function createHand(userId, fields) {
  const { data, error } = await supabase
    .from("hands")
    .insert({ ...fields, user_id: userId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateHand(id, fields) {
  const { data, error } = await supabase
    .from("hands")
    .update(fields)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteHand(id) {
  const { error } = await supabase.from("hands").delete().eq("id", id);
  if (error) throw error;
}

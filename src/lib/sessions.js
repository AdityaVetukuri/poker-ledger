import { supabase } from "./supabaseClient";

// Columns that come from the reflection wizard / session form, in the shape
// the `sessions` table expects. Anything not provided is left null.
export async function listSessions() {
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .order("played_on", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function createSession(userId, fields) {
  const { data, error } = await supabase
    .from("sessions")
    .insert({ ...fields, user_id: userId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateSession(id, fields) {
  const { data, error } = await supabase
    .from("sessions")
    .update(fields)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteSession(id) {
  const { error } = await supabase.from("sessions").delete().eq("id", id);
  if (error) throw error;
}

export async function bulkInsertSessions(userId, rows) {
  const { data, error } = await supabase
    .from("sessions")
    .insert(rows.map((r) => ({ ...r, user_id: userId })))
    .select();
  if (error) throw error;
  return data;
}

import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(
  url && anonKey && !url.includes("your-project-ref")
);

// When env vars aren't set yet (e.g. first run before .env.local exists),
// export null instead of throwing, so the app can render a clear setup
// screen instead of a blank crash.
export const supabase = supabaseConfigured
  ? createClient(url, anonKey)
  : null;

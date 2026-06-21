import { createClient } from "@supabase/supabase-js";

let supabaseClient = null;

export function isCloudSaveConfigured() {
  return Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
}

export function getSupabaseClient() {
  if (!isCloudSaveConfigured()) return null;

  if (!supabaseClient) {
    supabaseClient = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
        },
      },
    );
  }

  return supabaseClient;
}


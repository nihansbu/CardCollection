import { LOCAL_SAVE_SCHEMA_VERSION } from "./storageKeys.js";
import { getSupabaseClient, isCloudSaveConfigured } from "./supabaseClient.js";

const GAME_SAVE_ID = "primary";

export function getCloudSaveStatus() {
  return {
    configured: isCloudSaveConfigured(),
  };
}

export async function getCurrentCloudUser() {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;

  return data.user;
}

export async function loadCloudGameSave() {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const user = await getCurrentCloudUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("game_saves")
    .select("save_data, save_version, updated_at")
    .eq("user_id", user.id)
    .eq("save_id", GAME_SAVE_ID)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    ...data.save_data,
    cloudUpdatedAt: data.updated_at,
    cloudVersion: data.save_version,
  };
}

export async function saveCloudGameSave(save) {
  const supabase = getSupabaseClient();
  if (!supabase) return { skipped: true, reason: "not-configured" };

  const user = await getCurrentCloudUser();
  if (!user) return { skipped: true, reason: "not-authenticated" };

  const payload = {
    schemaVersion: LOCAL_SAVE_SCHEMA_VERSION,
    ...save,
    syncedAt: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("game_saves")
    .upsert({
      save_data: payload,
      save_id: GAME_SAVE_ID,
      save_version: Number(save.cloudVersion || 0) + 1,
      user_id: user.id,
    }, {
      onConflict: "user_id,save_id",
    });

  if (error) throw error;

  return { skipped: false };
}


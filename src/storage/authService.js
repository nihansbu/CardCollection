function isCloudSaveConfigured() {
  return Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
}

async function getConfiguredSupabaseClient() {
  const { getSupabaseClient } = await import("./supabaseClient.js");
  return getSupabaseClient();
}

export async function getCloudAuthUser() {
  const supabase = await getConfiguredSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;

  return data.user;
}

export async function signInCloudAccount(email, password) {
  const supabase = await getConfiguredSupabaseClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  return data.user;
}

export async function signUpCloudAccount(email, password) {
  const supabase = await getConfiguredSupabaseClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: email.split("@")[0],
      },
    },
  });
  if (error) throw error;

  return data.user;
}

export async function signOutCloudAccount() {
  const supabase = await getConfiguredSupabaseClient();
  if (!supabase) return;

  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export function getAuthConfigStatus() {
  return {
    cloudConfigured: isCloudSaveConfigured(),
  };
}

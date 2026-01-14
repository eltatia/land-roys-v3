import { supabase } from "./Supabase";

export const fetchSettings = async () => {
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return data || null;
};

export const upsertSettings = async (payload) => {
  return await supabase.from("settings").upsert({
    ...payload,
    updated_at: new Date().toISOString(),
  });
};

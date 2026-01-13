import { supabase } from "./Supabase";

export async function fetchRepuestos() {
  return await supabase
    .from("repuestos")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });
}

export async function fetchRepuestoBySlug(slug) {
  return await supabase
    .from("repuestos")
    .select("*")
    .eq("slug", slug)
    .single();
}

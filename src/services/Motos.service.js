import { supabase } from "../api/Supabase.provider";

export const getMotos = async () => {
  const { data, error } = await supabase
    .from("motos")
    .select("*")
    .order("creado_en", { ascending: false });

  if (error) throw error;
  return data || [];
};

export const addMoto = async (moto) => {
  const { data, error } = await supabase
    .from("motos")
    .insert([moto])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateMoto = async (id, moto) => {
  const payload = {
    ...moto,
    actualizado_en: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("motos")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteMoto = async (id) => {
  const { error } = await supabase.from("motos").delete().eq("id", id);
  if (error) throw error;
};

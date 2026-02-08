import { supabase } from "../api/Supabase.provider";

const normalizeCategoria = (categoria = {}) => ({
  id: categoria.id,
  nombre: categoria.nombre ?? "",
  estado: categoria.estado ?? true,
  parent_id: categoria.parent_id ?? null,
});

export const getCategoriasMotos = async () => {
  const { data, error } = await supabase
    .from("categorias_motos")
    .select("*")
    .order("nombre", { ascending: true });

  if (error) throw error;
  return (data || []).map((item) => normalizeCategoria(item));
};

export const addCategoriaMoto = async (categoria) => {
  const payload = {
    nombre: categoria.nombre?.trim() || "",
    estado: categoria.estado ?? true,
    parent_id: categoria.parent_id || null,
  };
  const { data, error } = await supabase
    .from("categorias_motos")
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return normalizeCategoria(data);
};

export const updateCategoriaMoto = async (id, categoria) => {
  const payload = {
    nombre: categoria.nombre?.trim() || "",
    estado: categoria.estado ?? true,
    parent_id: categoria.parent_id || null,
  };
  const { data, error } = await supabase
    .from("categorias_motos")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return normalizeCategoria(data);
};

export const deleteCategoriaMoto = async (id) => {
  const { error } = await supabase.from("categorias_motos").delete().eq("id", id);
  if (error) throw error;
};

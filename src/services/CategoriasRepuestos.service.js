import { supabase } from "../api/Supabase.provider";

const normalizeCategoria = (categoria = {}) => ({
  id: categoria.id,
  nombre: categoria.nombre ?? "",
  estado: categoria.estado ?? true,
});

export const getCategoriasRepuestos = async () => {
  const { data, error } = await supabase
    .from("categorias_repuestos")
    .select("*")
    .order("nombre", { ascending: true });

  if (error) throw error;
  return (data || []).map((item) => normalizeCategoria(item));
};

export const addCategoriaRepuesto = async (categoria) => {
  const payload = {
    nombre: categoria.nombre?.trim() || "",
    estado: categoria.estado ?? true,
  };
  const { data, error } = await supabase
    .from("categorias_repuestos")
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return normalizeCategoria(data);
};

export const updateCategoriaRepuesto = async (id, categoria) => {
  const payload = {
    nombre: categoria.nombre?.trim() || "",
    estado: categoria.estado ?? true,
  };
  const { data, error } = await supabase
    .from("categorias_repuestos")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return normalizeCategoria(data);
};

export const deleteCategoriaRepuesto = async (id) => {
  const { error } = await supabase.from("categorias_repuestos").delete().eq("id", id);
  if (error) throw error;
};

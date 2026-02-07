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

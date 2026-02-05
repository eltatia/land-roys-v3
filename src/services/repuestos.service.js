import { supabase } from "../api/Supabase.provider";

export const getRepuestos = async () => {
  const { data, error } = await supabase
    .from("repuesto_pieza")
    .select(
      `
      id_repuesto,
      nombre,
      categoria,
      precio,
      estado,
      descripcion,
      imagen_repuesto(
        imagen(
          url_imagen
        )
      )
    `
    )
    .order("nombre", { ascending: true });

  if (error) throw error;
  return data;
};

export const getRepuestoById = async (id) => {
  const { data, error } = await supabase
    .from("repuesto_pieza")
    .select(
      `
      id_repuesto,
      nombre,
      categoria,
      precio,
      estado,
      descripcion,
      imagen_repuesto(
        imagen(
          url_imagen
        )
      )
    `
    )
    .eq("id_repuesto", id)
    .single();

  if (error) throw error;
  return data;
};

export const getTotalRepuestos = async () => {
  const { data, error } = await supabase
    .from("repuesto_pieza")
    .select("id_repuesto");

  if (error) throw error;
  return data.length;
};

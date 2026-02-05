import { supabase } from "../api/Supabase.provider";

// GET ALL MOTOS
export const getMotos = async () => {
    const { data, error } = await supabase
        .from("motos")
        .select(`
      *,
      imagen_moto (
        imagen (
          id_imagen,
          url_imagen,
          orden
        )
      )
    `)
        .order("fecha_publicacion", { ascending: false });

    if (error) throw error;
    return data;
};

// GET MOTO BY ID
export const getMotoById = async (id) => {
    const { data, error } = await supabase
        .from("motos")
        .select(`
      *,
      imagen_moto (
        imagen (
          id_imagen,
          url_imagen,
          orden
        )
      )
    `)
        .eq("id_moto", id)
        .single();

    if (error) throw error;
    return data;
};

// CREATE MOTO
export const createMoto = async (motoData) => {
    const { data, error } = await supabase
        .from("motos")
        .insert([motoData])
        .select()
        .single();

    if (error) throw error;
    return data;
};

// UPDATE MOTO
export const updateMoto = async (id, motoData) => {
    const { data, error } = await supabase
        .from("motos")
        .update(motoData)
        .eq("id_moto", id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// DELETE MOTO
export const deleteMoto = async (id) => {
    const { error } = await supabase
        .from("motos")
        .delete()
        .eq("id_moto", id);

    if (error) throw error;
};

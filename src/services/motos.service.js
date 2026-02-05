import { supabase } from "../api/Supabase.provider";

export const getMotos = async () => {
  const { data, error } = await supabase
    .from("moto")
    .select(
      `
      id_moto,
      modelo,
      anio,
      precio,
      estado,
      descripcion,
      imagen_moto(
        imagen(
          url_imagen
        )
      )
    `
    )
    .order("modelo", { ascending: true });

  if (error) throw error;
  return data;
};

export const getMotoById = async (id) => {
  const { data, error } = await supabase
    .from("moto")
    .select(
      `
      id_moto,
      modelo,
      anio,
      precio,
      estado,
      descripcion,
      capacidad_tanque_l,
      cilindrada_cc,
      maxima_velocidad_kmh,
      velocidades,
      motor_especificacion,
      torque_max_nm,
      torque_max_rpm,
      potencia_max_hp,
      potencia_max_rpm,
      use_diferencial,
      diferencial_titulo,
      diferencial_subtitulo,
      diferencial_texto,
      imagen_moto(
        imagen(
          url_imagen
        )
      )
    `
    )
    .eq("id_moto", id)
    .single();

  if (error) throw error;
  return data;
};

export const getTotalUnidadesMotos = async () => {
  const { data, error } = await supabase
    .from("moto")
    .select("id_moto");

  if (error) throw error;

  return data.length;
};

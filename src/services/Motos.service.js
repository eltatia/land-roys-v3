import { supabase } from "../api/Supabase.provider";

const normalizeMoto = (moto = {}) => ({
  ...moto,
  anio: moto.anio ?? null,
  cilindrada_cc: moto.cilindrada_cc ?? null,
  estado: moto.estado || "disponible",
  marca: moto.marca || null,
  modelo_codigo: moto.modelo_codigo || null,
});

const getMotoBucket = () => import.meta.env.VITE_SUPABASE_MOTOS_BUCKET || "motos";

export const uploadMotoImage = async (file) => {
  const bucket = getMotoBucket();
  const ext = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${ext}`;
  const filePath = `motos/${fileName}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, { cacheControl: "3600", upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
};

export const getMotos = async () => {
  const { data, error } = await supabase
    .from("motos")
    .select("*")
    .order("creado_en", { ascending: false });

  if (error) throw error;
  return (data || []).map(normalizeMoto);
};

export const addMoto = async (moto) => {
  const { data, error } = await supabase
    .from("motos")
    .insert([normalizeMoto(moto)])
    .select()
    .single();

  if (error) throw error;
  return normalizeMoto(data);
};

export const updateMoto = async (id, moto) => {
  const payload = {
    ...normalizeMoto(moto),
    actualizado_en: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("motos")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return normalizeMoto(data);
};

export const deleteMoto = async (id) => {
  const { error } = await supabase.from("motos").delete().eq("id", id);
  if (error) throw error;
};

import { supabase } from "../api/Supabase.provider";

const normalizeRepuesto = (repuesto = {}) => ({
  id: repuesto.id,
  nombre: repuesto.nombre ?? "",
  descripcion: repuesto.descripcion ?? null,
  categoria: repuesto.categoria ?? null,
  precio: repuesto.precio ?? 0,
  estado: repuesto.estado || "disponible",
  imagen_url: repuesto.imagen_url ?? null,
  stock: repuesto.stock ?? 0,
});

const pickRepuestoPayload = (repuesto = {}) => ({
  nombre: repuesto.nombre?.trim() || "",
  descripcion: repuesto.descripcion?.trim() || null,
  categoria: repuesto.categoria?.trim() || "",
  precio: repuesto.precio ?? 0,
  estado: repuesto.estado || "disponible",
  imagen_url: repuesto.imagen_url ?? null,
  stock: repuesto.stock ?? 0,
});

const getRepuestosBucket = () => import.meta.env.VITE_SUPABASE_REPUESTOS_BUCKET || "repuestos";

export const uploadRepuestoImage = async (file) => {
  const bucket = getRepuestosBucket();
  const ext = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${ext}`;
  const filePath = `repuestos/${fileName}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, { cacheControl: "3600", upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
};

export const getRepuestos = async () => {
  const { data, error } = await supabase
    .from("repuestos")
    .select("*")
    .order("creado_en", { ascending: false });

  if (error) throw error;
  return (data || []).map((item) => normalizeRepuesto(item));
};

export const addRepuesto = async (repuesto) => {
  const payload = pickRepuestoPayload(repuesto);
  const { data, error } = await supabase
    .from("repuestos")
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return normalizeRepuesto(data);
};

export const updateRepuesto = async (id, repuesto) => {
  const payload = {
    ...pickRepuestoPayload(repuesto),
    actualizado_en: new Date().toISOString(),
  };
  const { data, error } = await supabase
    .from("repuestos")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return normalizeRepuesto(data);
};

export const deleteRepuesto = async (id) => {
  const { error } = await supabase.from("repuestos").delete().eq("id", id);
  if (error) throw error;
};

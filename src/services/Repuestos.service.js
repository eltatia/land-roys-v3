import { supabase } from "../api/Supabase.provider";

const normalizeGallery = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch {
      return [];
    }
  }
  return [];
};

const normalizeRepuesto = (repuesto = {}) => ({
  id: repuesto.id,
  nombre: repuesto.nombre ?? "",
  descripcion: repuesto.descripcion ?? null,
  categoria: repuesto.categoria ?? repuesto.categorias_repuestos?.nombre ?? null,
  categoria_id: repuesto.categoria_id ?? repuesto.categorias_repuestos?.id ?? null,
  categoria_nombre: repuesto.categorias_repuestos?.nombre ?? repuesto.categoria ?? null,
  categoria_parent_id: repuesto.categorias_repuestos?.parent_id ?? null,
  precio: repuesto.precio ?? 0,
  estado: repuesto.estado || "disponible",
  imagen_url: repuesto.imagen_url ?? null,
  stock: repuesto.stock ?? 0,
  unidad_medida: repuesto.unidad_medida ?? null,
  modelo: repuesto.modelo ?? null,
  cantidad_por_paquete: repuesto.cantidad_por_paquete ?? null,
  marca_logo_url: repuesto.marca_logo_url ?? null,
  galeria_imagenes: normalizeGallery(repuesto.galeria_imagenes),
});

const pickRepuestoPayload = (repuesto = {}) => ({
  nombre: repuesto.nombre?.trim() || "",
  descripcion: repuesto.descripcion?.trim() || null,
  categoria: repuesto.categoria?.trim() || repuesto.categoria_nombre?.trim() || "",
  categoria_id: repuesto.categoria_id || null,
  precio: repuesto.precio ?? 0,
  estado: repuesto.estado || "disponible",
  imagen_url: repuesto.imagen_url ?? null,
  stock: repuesto.stock ?? 0,
  unidad_medida: repuesto.unidad_medida?.trim() || null,
  modelo: repuesto.modelo?.trim() || null,
  cantidad_por_paquete: repuesto.cantidad_por_paquete ? Number(repuesto.cantidad_por_paquete) : null,
  marca_logo_url: repuesto.marca_logo_url?.trim() || null,
  galeria_imagenes: Array.isArray(repuesto.galeria_imagenes)
    ? repuesto.galeria_imagenes.filter((item) => typeof item === "string" && item.trim()).map((item) => item.trim())
    : [],
});

const getRepuestosBucket = () => import.meta.env.VITE_SUPABASE_INVENTARIO_BUCKET || "Inventario";

const buildRepuestoMediaPath = ({ ext }) => `Repuestos/${Date.now()}-${crypto.randomUUID()}.${ext}`;

export const uploadRepuestoImage = async (file) => {
  const bucket = getRepuestosBucket();
  const ext = file.name.split(".").pop();
  const filePath = buildRepuestoMediaPath({
    ext,
  });

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
    .select("*, categorias_repuestos ( id, nombre, parent_id )")
    .order("creado_en", { ascending: false });

  if (error) throw error;
  return (data || []).map((item) => normalizeRepuesto(item));
};

export const addRepuesto = async (repuesto) => {
  const payload = pickRepuestoPayload(repuesto);
  const { data, error } = await supabase
    .from("repuestos")
    .insert([payload])
    .select("*, categorias_repuestos ( id, nombre, parent_id )")
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
    .select("*, categorias_repuestos ( id, nombre, parent_id )")
    .single();

  if (error) throw error;
  return normalizeRepuesto(data);
};

export const deleteRepuesto = async (id) => {
  const { error } = await supabase.from("repuestos").delete().eq("id", id);
  if (error) throw error;
};


export const getTotalUnidadesRepuestos = async () => {
  const { data, error } = await supabase
    .from("repuestos")
    .select("stock");

  if (error) throw error;

  return (data || []).reduce((acc, item) => acc + Number(item.stock || 0), 0);
};


export const getRepuestoById = async (id) => {
  const { data, error } = await supabase
    .from("repuestos")
    .select("*, categorias_repuestos ( id, nombre, parent_id )")
    .eq("id", id)
    .single();

  if (error) throw error;
  return normalizeRepuesto(data);
};

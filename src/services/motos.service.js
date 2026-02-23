import { supabase } from "../api/Supabase.provider";

const normalizeGaleria = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const normalizeMoto = (moto = {}) => ({
  id: moto.id,
  nombre: moto.nombre ?? "",
  descripcion: moto.descripcion ?? null,
  categoria: moto.categoria ?? null,
  precio: moto.precio ?? 0,
  stock: moto.stock ?? 0,
  imagen_url: moto.imagen_url ?? null,
  video_url: moto.video_url ?? null,
  logo_url: moto.logo_url ?? null,
  brand_logo_url: moto.brand_logo_url ?? null,
  marca: moto.marca ?? null,
  modelo_codigo: moto.modelo_codigo ?? null,
  estado: moto.estado || "disponible",
  galeria_destacada: normalizeGaleria(moto.galeria_destacada).map((item) => ({
    imagen_url: item?.imagen_url ?? item?.imagenUrl ?? "",
    titulo: item?.titulo ?? "",
    descripcion: item?.descripcion ?? "",
  })),
});

const normalizeSpecs = (specs = {}) => ({
  anio: specs.anio ?? null,
  cilindrada_cc: specs.cilindrada_cc ?? null,
  capacidad_tanque_l: specs.capacidad_tanque_l ?? null,
  maxima_velocidad_kmh: specs.maxima_velocidad_kmh ?? null,
  velocidades: specs.velocidades ?? null,
  motor_especificacion: specs.motor_especificacion ?? null,
  torque_max_nm: specs.torque_max_nm ?? null,
  torque_max_rpm: specs.torque_max_rpm ?? null,
  potencia_max_hp: specs.potencia_max_hp ?? null,
  potencia_max_rpm: specs.potencia_max_rpm ?? null,
  use_diferencial: specs.use_diferencial ?? null,
  diferencial_titulo: specs.diferencial_titulo ?? null,
  diferencial_subtitulo: specs.diferencial_subtitulo ?? null,
  diferencial_texto: specs.diferencial_texto ?? null,
});

const pickMotoPayload = (moto = {}) => ({
  nombre: moto.nombre?.trim() || "",
  descripcion: moto.descripcion?.trim() || null,
  categoria: moto.categoria?.trim() || null,
  precio: moto.precio ?? 0,
  stock: moto.stock ?? 0,
  imagen_url: moto.imagen_url ?? null,
  video_url: moto.video_url ?? null,
  logo_url: moto.logo_url ?? null,
  brand_logo_url: moto.brand_logo_url ?? null,
  marca: moto.marca || null,
  modelo_codigo: moto.modelo_codigo || null,
  estado: moto.estado || "disponible",
  galeria_destacada: Array.isArray(moto.galeria_destacada) ? moto.galeria_destacada : [],
});

const pickSpecs = (moto = {}) => normalizeSpecs(moto);

const getMotoBucket = () => import.meta.env.VITE_SUPABASE_INVENTARIO_BUCKET || "Inventario";

const buildMotoMediaPath = ({ ext }) => `Modelos/${Date.now()}-${crypto.randomUUID()}.${ext}`;

export const uploadMotoVideo = async (file) => {
  const bucket = getMotoBucket();
  const ext = file.name.split(".").pop();
  const filePath = buildMotoMediaPath({
    ext,
  });

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, { cacheControl: "3600", upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
};

const missingColumnMatch = (error) => {
  const message = error?.message || "";
  const match = message.match(/Could not find the '(.+?)' column of 'motos'/);
  return match ? match[1] : null;
};

const removeColumn = (payload, column) => {
  if (!column) return payload;
  const { [column]: _removed, ...rest } = payload;
  return rest;
};

const executeWithFallback = async (requestFactory) => {
  let payload = null;
  let data = null;
  let error = null;
  let attempts = 0;

  while (attempts < 5) {
    ({ data, error, payload } = await requestFactory(payload));
    if (!error) return { data, error: null, payload };

    const missingColumn = missingColumnMatch(error);
    if (!missingColumn || !payload) break;
    payload = removeColumn(payload, missingColumn);
    attempts += 1;
  }

  return { data, error, payload };
};

export const uploadMotoImage = async (file) => {
  const bucket = getMotoBucket();
  const ext = file.name.split(".").pop();
  const filePath = buildMotoMediaPath({
    ext,
  });

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
    .select("*, motos_specs(*)")
    .order("creado_en", { ascending: false });

  if (error) throw error;

  return (data || []).map((moto) => {
    const specs = Array.isArray(moto.motos_specs) ? moto.motos_specs[0] : moto.motos_specs;
    return {
      ...normalizeMoto(moto),
      ...normalizeSpecs(specs || {}),
    };
  });
};

export const getMotoById = async (id) => {
  const { data, error } = await supabase
    .from("motos")
    .select("*, motos_specs(*)")
    .eq("id", id)
    .single();

  if (error) throw error;

  const specs = Array.isArray(data.motos_specs) ? data.motos_specs[0] : data.motos_specs;
  return {
    ...normalizeMoto(data),
    ...normalizeSpecs(specs || {}),
  };
};

export const addMoto = async (moto) => {
  const basePayload = pickMotoPayload(moto);

  const { data, error } = await executeWithFallback(async (payloadOverride) => {
    const payload = payloadOverride || basePayload;
    const response = await supabase
      .from("motos")
      .insert([payload])
      .select()
      .single();
    return { ...response, payload };
  });

  if (error) throw error;

  const specsPayload = pickSpecs(moto);
  const hasSpecs = Object.values(specsPayload).some((value) => value !== null && value !== "");
  if (hasSpecs) {
    const { error: specsError } = await supabase
      .from("motos_specs")
      .upsert({ id: data.id, ...specsPayload });
    if (specsError) throw specsError;
  }

  return { ...normalizeMoto(data), ...specsPayload };
};

export const updateMoto = async (id, moto) => {
  const basePayload = {
    ...pickMotoPayload(moto),
    actualizado_en: new Date().toISOString(),
  };

  const { data, error } = await executeWithFallback(async (payloadOverride) => {
    const payload = payloadOverride || basePayload;
    const response = await supabase
      .from("motos")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    return { ...response, payload };
  });

  if (error) throw error;

  const specsPayload = pickSpecs(moto);
  const hasSpecs = Object.values(specsPayload).some((value) => value !== null && value !== "");
  if (hasSpecs) {
    const { error: specsError } = await supabase
      .from("motos_specs")
      .upsert({ id, ...specsPayload });
    if (specsError) throw specsError;
  }

  return { ...normalizeMoto(data), ...specsPayload };
};

export const deleteMoto = async (id) => {
  const { error: specsError } = await supabase.from("motos_specs").delete().eq("id", id);
  if (specsError) throw specsError;

  const { error } = await supabase.from("motos").delete().eq("id", id);
  if (error) throw error;
};

export const updateMotoStock = async (id, newStock) => {
  const { error } = await supabase
    .from("motos")
    .update({ stock: newStock })
    .eq("id", id);

  if (error) {
    console.error("Error updating stock:", error);
    throw error;
  }
  return true;
};

export const getTotalUnidadesMotos = async () => {
  const { data, error } = await supabase
    .from("motos")
    .select("stock");

  if (error) throw error;

  const total = data.reduce((acc, moto) => acc + moto.stock, 0);
  return total;
};

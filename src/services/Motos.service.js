import { supabase } from "../api/Supabase.provider";

const normalizeMoto = (moto = {}) => ({
  ...moto,
  anio: moto.anio ?? null,
  cilindrada_cc: moto.cilindrada_cc ?? null,
  estado: moto.estado || "disponible",
  marca: moto.marca || null,
  modelo_codigo: moto.modelo_codigo || null,
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

const pickSpecs = (moto = {}) => normalizeSpecs(moto);

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
    .select("*, motos_specs(*)")
    .order("creado_en", { ascending: false });

  if (error) throw error;

  return (data || []).map((moto) => {
    const specs = Array.isArray(moto.motos_specs) ? moto.motos_specs[0] : moto.motos_specs;
    return normalizeMoto({
      ...moto,
      ...normalizeSpecs(specs || {}),
    });
  });
};

export const addMoto = async (moto) => {
  const { data, error } = await supabase
    .from("motos")
    .insert([normalizeMoto(moto)])
    .select()
    .single();

  if (error) throw error;

  const specsPayload = pickSpecs(moto);
  const hasSpecs = Object.values(specsPayload).some((value) => value !== null && value !== "");
  if (hasSpecs) {
    const { error: specsError } = await supabase
      .from("motos_specs")
      .upsert({ id: data.id, ...specsPayload });
    if (specsError) throw specsError;
  }

  return normalizeMoto({ ...data, ...specsPayload });
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

  const specsPayload = pickSpecs(moto);
  const hasSpecs = Object.values(specsPayload).some((value) => value !== null && value !== "");
  if (hasSpecs) {
    const { error: specsError } = await supabase
      .from("motos_specs")
      .upsert({ id, ...specsPayload });
    if (specsError) throw specsError;
  }

  return normalizeMoto({ ...data, ...specsPayload });
};

export const deleteMoto = async (id) => {
  const { error: specsError } = await supabase.from("motos_specs").delete().eq("id", id);
  if (specsError) throw specsError;

  const { error } = await supabase.from("motos").delete().eq("id", id);
  if (error) throw error;
};

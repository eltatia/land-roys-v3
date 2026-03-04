import { supabase } from "../api/Supabase.provider";

const BUCKET = "Slides_home_img";
const TABLE = "slider_home";
const MAX_SLIDES = 5;

/* =========================
   Obtener Slides
========================= */
export const getSlides = async () => {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("orden", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
};

/* =========================
   Subir imagen a Storage
========================= */
const uploadImage = async (file) => {
  if (!file) throw new Error("Archivo requerido");

  const fileName = `${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, file);

  if (error) throw new Error(error.message);

  return fileName; // Guardamos solo el path
};


/* =========================
   Eliminar imagen del Storage
========================= */
const removeImage = async (path) => {
  if (!path) return;

  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([path]);

  if (error) throw new Error(error.message);
};

/* =========================
   Obtener URL pública
========================= */
export const getPublicImageUrl = (path) => {
  if (!path) return "";

  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(path);

  return data?.publicUrl ?? "";
};

/* =========================
   Crear Slide
========================= */
export const addSlide = async ({ file, estado }) => {
  if (!file) throw new Error("Imagen requerida");

  const { data: existing, error: fetchError } = await supabase
    .from(TABLE)
    .select("id");

  if (fetchError) throw new Error(fetchError.message);

  if (existing.length >= MAX_SLIDES) {
    throw new Error(`Máximo ${MAX_SLIDES} slides permitidos`);
  }

  const fileName = await uploadImage(file);

  const { data, error } = await supabase
    .from(TABLE)
    .insert([
      {
        url_image: fileName,
        estado,
        orden: existing.length,
      },
    ])
    .select()
    .single();

  if (error) {
    await removeImage(fileName); // rollback imagen si falla insert
    throw new Error(error.message);
  }

  // ✅ Devuelvo la URL pública completa
  return {
    ...data,
    url_image: getPublicImageUrl(data.url_image),
  };
};

/* =========================
   Actualizar Slide
========================= */
export const updateSlide = async (id, payload) => {
  if (!id) throw new Error("ID requerido");

  const { data: current, error: fetchError } = await supabase
    .from(TABLE)
    .select("url_image")
    .eq("id", id)
    .single();
  if (fetchError) throw new Error(fetchError.message);

  const { file, ...rest } = payload;
  let updateData = { ...rest };

  if (file) {
    const newFileName = await uploadImage(file);
    updateData.url_image = newFileName;
    if (current?.url_image) await removeImage(current.url_image);
  }

  const { data, error } = await supabase
    .from(TABLE)
    .update(updateData)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);

  // ✅ Devuelvo la URL pública completa
  return {
    ...data,
    url_image: getPublicImageUrl(data.url_image),
  };
};

/* =========================
   Eliminar Slide (BD + Storage)
========================= */
export const deleteSlide = async (id) => {
  if (!id) throw new Error("ID requerido");

  //  Obtener datos del slide
  const { data: slide, error: fetchError } = await supabase
    .from(TABLE)
    .select("url_image")
    .eq("id", id)
    .single();

  if (fetchError) throw new Error(fetchError.message);

  // Eliminar registro de la base de datos
  const { error: deleteError } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", id);

  if (deleteError) throw new Error(deleteError.message);

  //  Eliminar imagen del storage (no bloquea si falla)
  if (slide?.url_image) {
    const { error: storageError } = await supabase.storage
      .from(BUCKET)
      .remove([slide.url_image]);

    if (storageError) {
      console.warn("La imagen no se pudo eliminar del storage:", storageError.message);
    }
  }

  return true;
};

/* =========================
   Reordenar Slides
========================= */
export const reorderSlides = async (slides) => {
  if (!Array.isArray(slides) || slides.length === 0) return;

  if (slides.length > MAX_SLIDES) {
    throw new Error(`Máximo ${MAX_SLIDES} slides permitidos`);
  }

  const updates = slides.map((slide, index) => ({
    id: slide.id,
    orden: index,
  }));

  const { error } = await supabase
    .from(TABLE)
    .upsert(updates, { onConflict: "id" });

  if (error) throw new Error(error.message);
};

export const uploadFileAndGetUrl = async (file) => {
  const fileName = `${Date.now()}_${file.name}`;
  const { error } = await supabase.storage
    .from("Slides_home_img")
    .upload(fileName, file);

  if (error) throw error;

  // Obtener URL pública
  const { publicUrl, error: urlError } = supabase
    .storage
    .from("Slides_home_img")
    .getPublicUrl(fileName);

  if (urlError) throw urlError;

  return publicUrl;
};

import { supabase } from "./Supabase";

/* SUBIR IMAGEN */
export async function uploadImage(file) {
  const uuid = crypto.randomUUID();
  const ext = file.name.split(".").pop();
  const fileName = `${uuid}.${ext}`;

  const { error: uploadErr } = await supabase.storage
    .from("slides_home")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadErr) return { error: uploadErr, data: null };

  const { data } = supabase.storage
    .from("slides_home")
    .getPublicUrl(fileName);

  return {
    data: {
      path: fileName,
      url: data.publicUrl,
    },
    error: null,
  };
}

/* OBTENER SLIDES */
export async function getSlides() {
  return await supabase
    .from("slides_home")
    .select("*")
    .order("order_index", { ascending: true });
}

/* CREAR SLIDE */
export async function createSlide(payload) {
  return await supabase.from("slides_home").insert(payload);
}

/* ACTUALIZAR SLIDE */
export async function updateSlide(id, payload) {
  return await supabase
    .from("slides_home")
    .update(payload)
    .eq("id", id);
}

/* ELIMINAR SLIDE */
export async function deleteSlide(id, path) {
  if (path) {
    await supabase.storage
      .from("slides_home")
      .remove([path]);
  }

  return await supabase
    .from("slides_home")
    .delete()
    .eq("id", id);
}


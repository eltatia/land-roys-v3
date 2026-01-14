import { supabase } from "./Supabase";

export async function fetchRepuestos() {
  return await supabase
    .from("repuestos")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });
}

export async function fetchRepuestoBySlug(slug) {
  return await supabase
    .from("repuestos")
    .select("*")
    .eq("slug", slug)
    .single();
}

export async function uploadRepuestoImage(file) {
  const uuid = crypto.randomUUID();
  const ext = file.name.split(".").pop();
  const fileName = `${uuid}.${ext}`;

  const { error: uploadErr } = await supabase.storage
    .from("repuestos")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadErr) return { error: uploadErr, data: null };

  const { data } = supabase.storage
    .from("repuestos")
    .getPublicUrl(fileName);

  return {
    data: {
      path: fileName,
      url: data.publicUrl,
    },
    error: null,
  };
}

export async function uploadRepuestoImages(files) {
  const uploads = await Promise.all(files.map((file) => uploadRepuestoImage(file)));
  const errors = uploads.filter((result) => result.error);
  if (errors.length) {
    return { error: errors[0].error, data: null };
  }

  return {
    data: uploads.map((result) => result.data),
    error: null,
  };
}

import { supabase } from "./Supabase";

/* OBTENER MOTOS */
export async function fetchMotos() {
    return await supabase
        .from("motos")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false });
}

export async function fetchMotoBySlug(slug) {
    return await supabase
        .from("motos")
        .select("*")
        .eq("slug", slug)
        .single();
}

/* SUBIR IMAGEN */
export async function uploadMotoImage(file) {
    const uuid = crypto.randomUUID();
    const ext = file.name.split(".").pop();
    const fileName = `${uuid}.${ext}`;

    const { error: uploadErr } = await supabase.storage
        .from("motos") // Bucket name
        .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
        });

    if (uploadErr) return { error: uploadErr, data: null };

    const { data } = supabase.storage
        .from("motos")
        .getPublicUrl(fileName);

    return {
        data: {
            path: fileName,
            url: data.publicUrl,
        },
        error: null,
    };
}

/* SUBIR MULTIPLES IMAGENES */
export async function uploadMotoImages(files) {
    const uploads = await Promise.all(files.map((file) => uploadMotoImage(file)));
    const errors = uploads.filter((result) => result.error);
    if (errors.length) {
        return { error: errors[0].error, data: null };
    }

    return {
        data: uploads.map((result) => result.data),
        error: null,
    };
}

/* ELIMINAR IMAGEN */
export async function deleteMotoImage(path) {
    if (!path) return;

    // Si la imagen es una URL completa, intentamos extraer el path si es de nuestro bucket
    // Pero si guardamos el path relativo en la BD es más fácil.
    // Asumiremos que guardamos la URL completa en 'imagen' por ahora, 
    // pero para borrar necesitamos el path. 
    // Si no guardamos el path, no podemos borrar fácilmente del bucket sin parsear la URL.
    // Por simplicidad, este método espera el path relativo (filename).

    return await supabase.storage
        .from("motos")
        .remove([path]);
}

import { supabase } from "../api/Supabase.provider";

const getRankingBucket = () => import.meta.env.VITE_SUPABASE_RANKING_BUCKET || "ranking_3";

export const subirImagen = async (file) => {
  if (!file) return null;

  try {
    const bucket = getRankingBucket();
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `ranking/${fileName}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (error) {
      console.error("Error al subir la imagen:", error.message);
      return null;
    }

    const { data: publicData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicData.publicUrl;
  } catch (err) {
    console.error("Error inesperado al subir la imagen:", err);
    return null;
  }
};

export const getRankingBucketName = () => getRankingBucket();

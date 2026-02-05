// Convierte URLs de Drive o Supabase a URLs accesibles
export const getPublicImageUrl = (url) => {
  if (!url) return ""; // fallback si no hay URL

  // Google Drive
  if (url.includes("drive.google.com")) {
    const idMatch = url.match(/\/d\/(.*?)\//); // extrae el ID del link
    if (idMatch) return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
  }

  // Supabase Storage pública
  return url;
};

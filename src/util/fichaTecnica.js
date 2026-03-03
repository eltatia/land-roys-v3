const isValidHttpUrl = (value) => {
  if (!value) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

export const resolveFichaTecnicaUrl = (moto = {}) => {
  if (isValidHttpUrl(moto.ficha_tecnica_url)) return moto.ficha_tecnica_url;
  return "";
};

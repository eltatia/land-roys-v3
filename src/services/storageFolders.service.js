import { supabase } from "../api/Supabase.provider";

const getInventoryBucket = () => import.meta.env.VITE_SUPABASE_INVENTARIO_BUCKET || "Inventario";
const getMotoBucket = () => getInventoryBucket();
const getRepuestosBucket = () => getInventoryBucket();
const canManageCategoryFolders = () => import.meta.env.VITE_SUPABASE_MANAGE_CATEGORY_FOLDERS === "true";

const sanitizeSegment = (value, fallback = "sin-valor") => {
  if (!value) return fallback;
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "") || fallback;
};

const ensureFolderMarker = async (bucket, folderPath) => {
  const filePath = `${folderPath.replace(/\/+$/, "")}/.folder`;
  const { error } = await supabase.storage.from(bucket).upload(filePath, new Uint8Array(), {
    upsert: true,
    contentType: "text/plain",
  });
  if (error) throw error;
};

const collectFilesRecursive = async (bucket, prefix) => {
  const files = [];

  const walk = async (path) => {
    const { data, error } = await supabase.storage.from(bucket).list(path, {
      limit: 100,
      offset: 0,
      sortBy: { column: "name", order: "asc" },
    });

    if (error) throw error;

    for (const item of data || []) {
      const itemPath = path ? `${path}/${item.name}` : item.name;
      if (item.id === null) {
        await walk(itemPath);
      } else {
        files.push(itemPath);
      }
    }
  };

  await walk(prefix);
  return files;
};

const removeFolderRecursive = async (bucket, prefix) => {
  const files = await collectFilesRecursive(bucket, prefix);
  if (files.length === 0) return [];

  const { error } = await supabase.storage.from(bucket).remove(files);
  if (error) throw error;
  return files;
};

export const ensureMotoCategoryFolder = async ({ parentId, categoryId }) => {
  if (!canManageCategoryFolders()) return { skipped: true, reason: "disabled" };
  const bucket = getMotoBucket();
  const safeCategory = sanitizeSegment(categoryId, "sin-categoria");

  if (!parentId) {
    await ensureFolderMarker(bucket, `Modelos/${safeCategory}`);
    return { skipped: false };
  }

  const safeParent = sanitizeSegment(parentId, "sin-categoria");
  await ensureFolderMarker(bucket, `Modelos/${safeParent}/${safeCategory}`);
  return { skipped: false };
};

export const ensureRepuestoCategoryFolder = async ({ parentId, categoryId }) => {
  if (!canManageCategoryFolders()) return { skipped: true, reason: "disabled" };
  const bucket = getRepuestosBucket();
  const safeCategory = sanitizeSegment(categoryId, "sin-categoria");

  if (!parentId) {
    await ensureFolderMarker(bucket, `Repuestos/${safeCategory}`);
    return { skipped: false };
  }

  const safeParent = sanitizeSegment(parentId, "sin-categoria");
  await ensureFolderMarker(bucket, `Repuestos/${safeParent}/${safeCategory}`);
  return { skipped: false };
};

export const getMotoCategoryFolderPrefixes = ({ id, parentId }) => {
  const safeId = sanitizeSegment(id, "sin-categoria");
  if (!parentId) return [`Modelos/${safeId}`];
  const safeParent = sanitizeSegment(parentId, "sin-categoria");
  return [`Modelos/${safeParent}/${safeId}`];
};

export const getRepuestoCategoryFolderPrefixes = ({ id, parentId }) => {
  const safeId = sanitizeSegment(id, "sin-categoria");
  if (!parentId) return [`Repuestos/${safeId}`];
  const safeParent = sanitizeSegment(parentId, "sin-categoria");
  return [`Repuestos/${safeParent}/${safeId}`];
};

export const listFolderFiles = async (bucketType, prefix) => {
  const bucket = bucketType === "motos" ? getMotoBucket() : getRepuestosBucket();
  return collectFilesRecursive(bucket, prefix);
};

export const deleteFolder = async (bucketType, prefix) => {
  const bucket = bucketType === "motos" ? getMotoBucket() : getRepuestosBucket();
  return removeFolderRecursive(bucket, prefix);
};

export const isRealFile = (path) => !path.endsWith("/.folder");

export const getConfiguredBucketName = (bucketType) =>
  bucketType === "motos" ? getMotoBucket() : getRepuestosBucket();

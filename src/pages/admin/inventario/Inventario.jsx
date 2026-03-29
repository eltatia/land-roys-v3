import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { Pencil, Trash2, Plus, PackageSearch, Bike, Wrench, X, UploadCloud, Link2 } from "lucide-react";
import {
  addMoto,
  deleteMoto,
  getMotos,
  updateMoto,
  uploadMotoImage,
  uploadMotoVideo,
} from "../../../services/motos.service";
import {
  addCategoriaMoto,
  deleteCategoriaMoto,
  getCategoriasMotos,
  updateCategoriaMoto,
} from "../../../services/CategoriasMotos.service";
import {
  addRepuesto,
  deleteRepuesto,
  getRepuestos,
  updateRepuesto,
  uploadRepuestoImage,
} from "../../../services/Repuestos.service";
import {
  addCategoriaRepuesto,
  deleteCategoriaRepuesto,
  getCategoriasRepuestos,
  updateCategoriaRepuesto,
} from "../../../services/CategoriasRepuestos.service";
import {
  deleteFolder,
  ensureMotoCategoryFolder,
  ensureRepuestoCategoryFolder,
  getMotoCategoryFolderPrefixes,
  getRepuestoCategoryFolderPrefixes,
  getConfiguredBucketName,
  isRealFile,
  listFolderFiles,
} from "../../../services/storageFolders.service";

const TableHeader = () => (
  <div className="grid grid-cols-[100px_1.1fr_0.9fr_0.9fr_0.9fr_120px] items-center bg-[#f5f6f8] text-[#556786] font-semibold text-[15px] rounded-t-2xl px-5 py-3 border border-gray-100">
    <span>Imagen</span>
    <span>Moto</span>
    <span>Año / CC</span>
    <span>Precio</span>
    <span>Estado</span>
    <span className="text-right">Acciones</span>
  </div>
);

const MotoRow = ({ moto, onEdit, onDelete, estadoClass }) => (
  <div className="grid grid-cols-[100px_1.1fr_0.9fr_0.9fr_0.9fr_120px] items-center bg-white px-5 py-3 border-x border-b border-gray-100">
    <img
      src={moto.imagen_url || "https://images.unsplash.com/photo-1511994298241-608e28f14fde?q=80&w=600&auto=format&fit=crop"}
      alt={moto.nombre}
      className="w-[70px] h-[48px] object-cover rounded-xl bg-gray-100"
    />
    <div>
      <p className="font-bold text-lg leading-tight text-[#1d2b44]">{moto.nombre}</p>
      <p className="text-xs text-gray-400">ID: {moto.id}</p>
    </div>
    <p className="text-[#334b68] text-sm">{moto.anio || "-"} / {moto.cilindrada_cc || "-"}</p>
    <p className="text-green-600 text-lg font-bold">S/. {Number(moto.precio || 0).toLocaleString()}</p>
    <span className={`inline-flex w-fit px-3 py-1 rounded-full font-bold text-[11px] uppercase ${estadoClass[(moto.estado || "disponible").toLowerCase()] || "bg-gray-100 text-gray-600"}`}>
      {(moto.estado || "disponible").toUpperCase()}
    </span>
    <div className="flex justify-end gap-3">
      <button onClick={() => onEdit(moto)} className="p-2 rounded-lg border border-blue-200 text-blue-600">
        <Pencil size={16} />
      </button>
      <button onClick={() => onDelete(moto.id)} className="p-2 rounded-lg border border-red-200 text-red-500">
        <Trash2 size={16} />
      </button>
    </div>
  </div>
);

const initialForm = {
  nombre: "",
  marca: "",
  modelo_codigo: "",
  descripcion: "",
  categoria: "",
  anio: "",
  cilindrada_cc: "",
  capacidad_tanque_l: "",
  maxima_velocidad_kmh: "",
  velocidades: "",
  torque_max_nm: "",
  motor_especificacion: "",
  precio: "",
  stock: "",
  estado: "disponible",
  imagen_url: "",
  logo_url: "",
  brand_logo_url: "",
  ficha_tecnica_url: "",
  video_url: "",
  video_activo: false,
  video_file: null,
  galeria_activa: false,
  galeria_destacada: [],
};

const initialRepuestoForm = {
  nombre: "",
  categoria_id: "",
  descripcion: "",
  precio: "",
  stock: "",
  estado: "disponible",
  imagen_url: "",
  unidad_medida: "",
  modelo: "",
  cantidad_por_paquete: "",
  marca_logo_url: "",
  galeria_imagenes: [],
};

const initialCategoriaForm = {
  nombre: "",
  estado: true,
  parent_id: "",
};

const initialCategoriaMotoForm = {
  nombre: "",
  estado: true,
  parent_id: "",
};

const tabs = [
  { key: "motos", label: "Motos", icon: Bike },
  { key: "repuestos", label: "Repuestos", icon: Wrench },
];

const buildRepuestoCategoryLabel = (categorias, categoriaId, fallback = "Otros") => {
  const byId = categorias.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});
  let current = byId[categoriaId];
  if (!current) return fallback;
  const trail = [];
  while (current) {
    trail.unshift(current.nombre);
    current = current.parent_id ? byId[current.parent_id] : null;
  }
  return trail.join(" / ");
};

const buildRepuestoCategoryDepthMap = (categorias = []) => {
  const byId = categorias.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});

  const depthCache = {};
  const getDepth = (id) => {
    if (!id || !byId[id]) return 0;
    if (depthCache[id] !== undefined) return depthCache[id];
    const parentId = byId[id].parent_id;
    depthCache[id] = parentId && byId[parentId] ? getDepth(parentId) + 1 : 0;
    return depthCache[id];
  };

  categorias.forEach((categoria) => {
    depthCache[categoria.id] = getDepth(categoria.id);
  });

  return depthCache;
};

const findMotoCategoriaByName = (categorias, nombre) =>
  categorias.find((categoria) => categoria.nombre?.toLowerCase() === nombre.toLowerCase()) || null;

const estadoClass = {
  disponible: "bg-green-100 text-green-700",
  agotado: "bg-red-100 text-red-600",
  preventa: "bg-blue-100 text-blue-700",
};

const isValidUrl = (value) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const isSignedUrlWithoutToken = (value) => {
  if (!value || !isValidUrl(value)) return false;
  try {
    const parsed = new URL(value);
    return parsed.pathname.includes("/storage/v1/object/sign/") && !parsed.searchParams.has("token");
  } catch {
    return false;
  }
};

const normalizeStorageUrl = (value) => {
  if (!value) return value;
  const trimmed = value.trim();
  if (!isValidUrl(trimmed)) return trimmed;
  try {
    const parsed = new URL(trimmed);
    if (parsed.pathname.includes("/storage/v1/object/sign/")) {
      if (parsed.searchParams.has("token")) {
        return trimmed;
      }
      parsed.pathname = parsed.pathname.replace("/storage/v1/object/sign/", "/storage/v1/object/public/");
      parsed.search = "";
      return parsed.toString();
    }
    return trimmed;
  } catch {
    return trimmed;
  }
};

const normalizeGaleria = (value) => {
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

const slugifySegment = (value, fallback = "sin-valor") => {
  if (!value) return fallback;
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "") || fallback;
};

const isDuplicateNameError = (error) =>
  error?.code === "23505" || (error?.message || "").toLowerCase().includes("duplicate key value");

const isBucketMissingError = (error) => {
  const message = (error?.message || "").toLowerCase();
  return message.includes("bucket not found") || error?.statusCode === "404";
};

const isStoragePermissionError = (error) => {
  const message = (error?.message || "").toLowerCase();
  return message.includes("row-level security") || error?.statusCode === "403";
};

const isMotoStockConstraintError = (error) => {
  const message = (error?.message || "").toLowerCase();
  return error?.code === "23514" && message.includes("motos_stock_check");
};

const getMotoSaveErrorMessage = (error) => {
  if (isMotoStockConstraintError(error)) {
    return "No se pudo guardar el modelo: el stock debe ser mayor a 0 según la configuración de la base de datos.";
  }

  const details = [error?.message, error?.details, error?.hint]
    .filter(Boolean)
    .map((item) => String(item).trim())
    .join(" | ");

  if (!details) return "No se pudo guardar el modelo. Revisa los campos obligatorios e intenta nuevamente.";

  const normalized = details.toLowerCase();

  if (error?.code === "42703" && normalized.includes("updated_at")) {
    return "No se pudo guardar porque la base de datos espera el campo updated_at. Aplica la migración de compatibilidad (updated_at) y vuelve a intentar.";
  }

  if (normalized.includes("400")) {
    return `No se pudo guardar el modelo por un dato inválido. Detalle: ${details}`;
  }

  return `No se pudo guardar el modelo. Detalle: ${details}`;
};

const getMotoDeleteErrorMessage = (error) => {
  const details = [error?.message, error?.details, error?.hint]
    .filter(Boolean)
    .map((item) => String(item).trim())
    .join(" | ");

  if (!details) {
    return "No se pudo eliminar el modelo. Verifica permisos o relaciones activas.";
  }

  const lower = details.toLowerCase();
  if (error?.code === "23503" || lower.includes("foreign key") || lower.includes("violates")) {
    return "No se pudo eliminar porque el modelo está relacionado con otros registros (por ejemplo ofertas o media). Se intentó liberar dependencias, pero aún hay una relación pendiente.";
  }

  if (error?.status === 409 || lower.includes("409")) {
    return `Conflicto al eliminar (409). Detalle: ${details}`;
  }

  return `No se pudo eliminar el modelo. Detalle: ${details}`;
};

const emptyGaleriaItem = { imagen_url: "", titulo: "", descripcion: "" };

const Inventario = () => {
  const [activeTab, setActiveTab] = useState("motos");
  const [motos, setMotos] = useState([]);
  const [repuestos, setRepuestos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRepuestos, setLoadingRepuestos] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filtroCategoria, setFiltroCategoria] = useState("all");
  const [form, setForm] = useState(initialForm);
  const [motoTipoId, setMotoTipoId] = useState("");
  const [motoSubcategoriaId, setMotoSubcategoriaId] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageUrlError, setImageUrlError] = useState("");
  const [logoUrlError, setLogoUrlError] = useState("");
  const [brandLogoUrlError, setBrandLogoUrlError] = useState("");
  const [fichaTecnicaUrlError, setFichaTecnicaUrlError] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [brandLogoFile, setBrandLogoFile] = useState(null);
  const [brandLogoPreview, setBrandLogoPreview] = useState("");
  const [repuestoEditingId, setRepuestoEditingId] = useState(null);
  const [repuestoFiltroCategoria, setRepuestoFiltroCategoria] = useState("all");
  const [repuestoForm, setRepuestoForm] = useState(initialRepuestoForm);
  const [repuestoModalOpen, setRepuestoModalOpen] = useState(false);
  const [repuestoImageFile, setRepuestoImageFile] = useState(null);
  const [repuestoImagePreview, setRepuestoImagePreview] = useState("");
  const [repuestoImageUrlError, setRepuestoImageUrlError] = useState("");
  const [categoriasRepuestos, setCategoriasRepuestos] = useState([]);
  const [categoriaForm, setCategoriaForm] = useState(initialCategoriaForm);
  const [categoriaEditingId, setCategoriaEditingId] = useState(null);
  const [isCreatingRepuestoType, setIsCreatingRepuestoType] = useState(false);
  const [repuestoTipoId, setRepuestoTipoId] = useState("");
  const [repuestoSubcategoriaId, setRepuestoSubcategoriaId] = useState("");
  const [repuestoSubsubcategoriaId, setRepuestoSubsubcategoriaId] = useState("");
  const [repuestoGaleriaUrlInput, setRepuestoGaleriaUrlInput] = useState("");
  const [categoriasMotos, setCategoriasMotos] = useState([]);
  const [_categoriasMotosLoaded, setCategoriasMotosLoaded] = useState(false);
  const [categoriasRepuestosLoaded, setCategoriasRepuestosLoaded] = useState(false);
  const [_motosLoaded, setMotosLoaded] = useState(false);
  const [repuestosLoaded, setRepuestosLoaded] = useState(false);
  const [categoriaMotoForm, setCategoriaMotoForm] = useState(initialCategoriaMotoForm);
  const [categoriaMotoEditingId, setCategoriaMotoEditingId] = useState(null);
  const [isCreatingMotoType, setIsCreatingMotoType] = useState(false);
  const [galeriaItem, setGaleriaItem] = useState(emptyGaleriaItem);

  const fetchMotos = async () => {
    setLoading(true);
    try {
      const data = await getMotos();
      setMotos(data);
      setMotosLoaded(true);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo cargar el inventario", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchRepuestos = async () => {
    setLoadingRepuestos(true);
    try {
      const data = await getRepuestos();
      setRepuestos(data);
      setRepuestosLoaded(true);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo cargar los repuestos", "error");
    } finally {
      setLoadingRepuestos(false);
    }
  };

  const fetchCategoriasRepuestos = async () => {
    try {
      const data = await getCategoriasRepuestos();
      setCategoriasRepuestos(data);
      setCategoriasRepuestosLoaded(true);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo cargar las categorías de repuestos", "error");
    }
  };

  const fetchCategoriasMotos = async () => {
    try {
      const data = await getCategoriasMotos();
      setCategoriasMotos(data);
      setCategoriasMotosLoaded(true);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo cargar las categorías de motos", "error");
    }
  };

  useEffect(() => {
    fetchMotos();
    fetchCategoriasMotos();
  }, []);

  useEffect(() => {
    if (activeTab !== "repuestos") return;

    if (!repuestosLoaded) {
      fetchRepuestos();
    }

    if (!categoriasRepuestosLoaded) {
      fetchCategoriasRepuestos();
    }
  }, [activeTab, repuestosLoaded, categoriasRepuestosLoaded]);

  const motoTipos = useMemo(
    () => categoriasMotos.filter((categoria) => !categoria.parent_id),
    [categoriasMotos]
  );

  const motoCategoriasOpciones = useMemo(() => {
    const children = categoriasMotos.filter((categoria) => categoria.parent_id);
    if (children.length > 0) return children;
    return motoTipos;
  }, [categoriasMotos, motoTipos]);

  const motoSubcategoriasPorTipo = useMemo(() => {
    return motoCategoriasOpciones
      .filter((categoria) => categoria.parent_id)
      .reduce((acc, categoria) => {
        const key = categoria.parent_id;
        if (!acc[key]) acc[key] = [];
        acc[key].push(categoria);
        return acc;
      }, {});
  }, [motoCategoriasOpciones]);

  const motoSubcategoriasVisibles = useMemo(() => {
    if (!motoTipoId) return [];
    return motoSubcategoriasPorTipo[motoTipoId] || [];
  }, [motoTipoId, motoSubcategoriasPorTipo]);

  const subcategoriasPorTipo = useMemo(() => {
    return categoriasMotos
      .filter((categoria) => categoria.parent_id)
      .reduce((acc, categoria) => {
        const key = categoria.parent_id;
        if (!acc[key]) acc[key] = [];
        acc[key].push(categoria);
        return acc;
      }, {});
  }, [categoriasMotos]);

  const subcategoriasOrfanas = useMemo(() => {
    const tiposIds = new Set(motoTipos.map((tipo) => tipo.id));
    return categoriasMotos.filter((categoria) => categoria.parent_id && !tiposIds.has(categoria.parent_id));
  }, [categoriasMotos, motoTipos]);

  const categorias = useMemo(() => {
    const byDb = motoTipos.map((categoria) => categoria.nombre).filter(Boolean);
    if (byDb.length > 0) return ["all", ...byDb];
    const unique = [...new Set(motos.map((m) => m.categoria).filter(Boolean))];
    return ["all", ...unique];
  }, [motoTipos, motos]);

  const motosFiltradas = useMemo(() => {
    if (filtroCategoria === "all") return motos;
    const tipoId = motoTipos.find((tipo) => tipo.nombre === filtroCategoria)?.id;
    if (tipoId) {
      const children = subcategoriasPorTipo[tipoId] || [];
      if (children.length > 0) {
        const childNames = children.map((child) => child.nombre.toLowerCase());
        return motos.filter((m) => childNames.includes((m.categoria || "").toLowerCase()));
      }
    }
    return motos.filter((m) => (m.categoria || "").toLowerCase() === filtroCategoria.toLowerCase());
  }, [motos, filtroCategoria, motoTipos, subcategoriasPorTipo]);

  const repuestoTipos = useMemo(() => categoriasRepuestos.filter((categoria) => !categoria.parent_id), [categoriasRepuestos]);

  const repuestoSubcategoriasPorTipo = useMemo(() => {
    return categoriasRepuestos
      .filter((categoria) => categoria.parent_id)
      .reduce((acc, categoria) => {
        const key = categoria.parent_id;
        if (!acc[key]) acc[key] = [];
        acc[key].push(categoria);
        return acc;
      }, {});
  }, [categoriasRepuestos]);

  const repuestoSubcategoriasVisibles = useMemo(() => {
    if (!repuestoTipoId) return [];
    return repuestoSubcategoriasPorTipo[repuestoTipoId] || [];
  }, [repuestoTipoId, repuestoSubcategoriasPorTipo]);

  const repuestoSubsubcategoriasVisibles = useMemo(() => {
    if (!repuestoSubcategoriaId) return [];
    return categoriasRepuestos.filter((categoria) => categoria.parent_id === repuestoSubcategoriaId);
  }, [categoriasRepuestos, repuestoSubcategoriaId]);

  const repuestoCategorias = useMemo(() => ["all", ...repuestoTipos.map((cat) => cat.id)], [repuestoTipos]);
  const repuestoCategoryDepthById = useMemo(
    () => buildRepuestoCategoryDepthMap(categoriasRepuestos),
    [categoriasRepuestos]
  );
  const repuestoParentCandidates = useMemo(
    () =>
      categoriasRepuestos.filter(
        (categoria) =>
          categoria.id !== categoriaEditingId &&
          (repuestoCategoryDepthById[categoria.id] ?? 0) < 2
      ),
    [categoriasRepuestos, categoriaEditingId, repuestoCategoryDepthById]
  );

  const getRepuestoDescendantIds = (rootId) => {
    const descendants = [];
    const walk = (parentId) => {
      const children = categoriasRepuestos.filter((categoria) => categoria.parent_id === parentId);
      children.forEach((child) => {
        descendants.push(child.id);
        walk(child.id);
      });
    };
    walk(rootId);
    return descendants;
  };

  const repuestosFiltrados = useMemo(() => {
    if (repuestoFiltroCategoria === "all") return repuestos;

    const validIds = new Set([repuestoFiltroCategoria, ...getRepuestoDescendantIds(repuestoFiltroCategoria)]);
    return repuestos.filter((r) => validIds.has(r.categoria_id) || validIds.has(r.categoria_parent_id));
  }, [repuestos, repuestoFiltroCategoria, categoriasRepuestos]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "imagen_url") {
      const trimmed = value.trim();
      if (!trimmed) {
        setImageUrlError("");
        if (!imageFile) setImagePreview("");
        return;
      }

      if (isValidUrl(trimmed)) {
        setImageUrlError("");
        if (!imageFile) setImagePreview(trimmed);
      } else {
        setImageUrlError("La URL debe empezar con http:// o https://");
        if (!imageFile) setImagePreview("");
      }
    }

    if (name === "logo_url") {
      const trimmed = value.trim();
      if (!trimmed) {
        setLogoUrlError("");
        return;
      }

      if (!isValidUrl(trimmed)) {
        setLogoUrlError("La URL debe empezar con http:// o https://");
        return;
      }

      if (isSignedUrlWithoutToken(trimmed)) {
        setLogoUrlError("La URL firmada no tiene token. Usa un enlace público o la URL firmada completa.");
        return;
      }

      setLogoUrlError("");
    }

    if (name === "brand_logo_url") {
      const trimmed = value.trim();
      if (!trimmed) {
        setBrandLogoUrlError("");
        return;
      }

      if (!isValidUrl(trimmed)) {
        setBrandLogoUrlError("La URL debe empezar con http:// o https://");
        return;
      }

      if (isSignedUrlWithoutToken(trimmed)) {
        setBrandLogoUrlError("La URL firmada no tiene token. Usa un enlace público o la URL firmada completa.");
        return;
      }

      setBrandLogoUrlError("");
    }

    if (name === "ficha_tecnica_url") {
      const trimmed = value.trim();
      if (!trimmed) {
        setFichaTecnicaUrlError("");
        return;
      }

      if (!isValidUrl(trimmed)) {
        setFichaTecnicaUrlError("La URL debe empezar con http:// o https://");
        return;
      }

      setFichaTecnicaUrlError("");
    }
  };

  const handleRepuestoChange = (e) => {
    const { name, value } = e.target;
    setRepuestoForm((prev) => ({ ...prev, [name]: value }));

    if (name === "imagen_url") {
      const trimmed = value.trim();
      if (!trimmed) {
        setRepuestoImageUrlError("");
        if (!repuestoImageFile) setRepuestoImagePreview("");
        return;
      }

      if (isValidUrl(trimmed)) {
        setRepuestoImageUrlError("");
        if (!repuestoImageFile) setRepuestoImagePreview(trimmed);
      } else {
        setRepuestoImageUrlError("La URL debe empezar con http:// o https://");
        if (!repuestoImageFile) setRepuestoImagePreview("");
      }
    }
  };

  const handleCategoriaChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCategoriaForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleRepuestoTipoChange = (tipoId) => {
    setRepuestoTipoId(tipoId);
    setRepuestoSubcategoriaId("");
    setRepuestoSubsubcategoriaId("");
    setRepuestoForm((prev) => ({ ...prev, categoria_id: tipoId || "" }));
  };

  const handleRepuestoSubcategoriaChange = (subcategoriaId) => {
    setRepuestoSubcategoriaId(subcategoriaId);
    setRepuestoSubsubcategoriaId("");
    const selected = subcategoriaId || repuestoTipoId || "";
    setRepuestoForm((prev) => ({ ...prev, categoria_id: selected }));
  };

  const handleRepuestoSubsubcategoriaChange = (subsubcategoriaId) => {
    setRepuestoSubsubcategoriaId(subsubcategoriaId);
    const selected = subsubcategoriaId || repuestoSubcategoriaId || repuestoTipoId || "";
    setRepuestoForm((prev) => ({ ...prev, categoria_id: selected }));
  };

  const handleCategoriaCreateChild = (tipo) => {
    const depth = repuestoCategoryDepthById[tipo.id] ?? 0;
    if (depth >= 2) {
      Swal.fire("Límite alcanzado", "Solo se permiten 3 niveles: categoría, subcategoría y subsubcategoría.", "info");
      return;
    }
    setCategoriaEditingId(null);
    setCategoriaForm({
      ...initialCategoriaForm,
      parent_id: tipo.id,
    });
    setIsCreatingRepuestoType(false);
  };

  const handleCategoriaMotoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCategoriaMotoForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const resetCategoriaForm = () => {
    setCategoriaForm(initialCategoriaForm);
    setCategoriaEditingId(null);
    setIsCreatingRepuestoType(false);
  };

  const resetCategoriaMotoForm = () => {
    setCategoriaMotoForm(initialCategoriaMotoForm);
    setCategoriaMotoEditingId(null);
    setIsCreatingMotoType(false);
  };

  const handleCategoriaMotoCreateChild = (tipo) => {
    setCategoriaMotoEditingId(null);
    setCategoriaMotoForm({
      ...initialCategoriaMotoForm,
      parent_id: tipo.id,
    });
    setIsCreatingMotoType(false);
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setModalOpen(false);
    setMotoTipoId("");
    setMotoSubcategoriaId("");
    setImageFile(null);
    setImagePreview("");
    setImageUrlError("");
    setLogoFile(null);
    setLogoPreview("");
    setBrandLogoFile(null);
    setBrandLogoPreview("");
    setFichaTecnicaUrlError("");
    setGaleriaItem(emptyGaleriaItem);
  };

  const resetRepuestoForm = () => {
    setRepuestoForm(initialRepuestoForm);
    setRepuestoEditingId(null);
    setRepuestoModalOpen(false);
    setRepuestoTipoId("");
    setRepuestoSubcategoriaId("");
    setRepuestoSubsubcategoriaId("");
    setRepuestoImageFile(null);
    setRepuestoImagePreview("");
    setRepuestoImageUrlError("");
    setRepuestoGaleriaUrlInput("");
  };

  const handleOpenCreateModal = () => {
    const defaultCategory =
      categoriasMotos.find((categoria) => categoria.parent_id)?.nombre ||
      categoriasMotos[0]?.nombre ||
      "";
    const defaultSubcategoria = categoriasMotos.find((categoria) => categoria.parent_id) || null;
    const defaultTipo = defaultSubcategoria?.parent_id || categoriasMotos.find((categoria) => !categoria.parent_id)?.id || "";
    setEditingId(null);
    setForm({
      ...initialForm,
      categoria: defaultCategory,
    });
    setMotoTipoId(defaultTipo);
    setMotoSubcategoriaId(defaultSubcategoria?.id || "");
    setModalOpen(true);
    setImageFile(null);
    setImagePreview("");
    setImageUrlError("");
    setLogoFile(null);
    setLogoPreview("");
    setBrandLogoFile(null);
    setBrandLogoPreview("");
    setFichaTecnicaUrlError("");
    setGaleriaItem(emptyGaleriaItem);
  };

  const handleOpenRepuestoModal = () => {
    const defaultSubcategoria = categoriasRepuestos.find((categoria) => categoria.parent_id) || null;
    const defaultTipo = defaultSubcategoria?.parent_id || repuestoTipos[0]?.id || "";
    setRepuestoEditingId(null);
    setRepuestoForm({
      ...initialRepuestoForm,
      categoria_id: defaultSubcategoria?.id || defaultTipo || "",
    });
    setRepuestoTipoId(defaultTipo);
    setRepuestoSubcategoriaId(defaultSubcategoria?.id || "");
    setRepuestoSubsubcategoriaId("");
    setRepuestoModalOpen(true);
    setRepuestoImageFile(null);
    setRepuestoImagePreview("");
    setRepuestoImageUrlError("");
    setRepuestoGaleriaUrlInput("");
  };

  const handleCategoriaEdit = (categoria) => {
    setCategoriaEditingId(categoria.id);
    setCategoriaForm({
      nombre: categoria.nombre || "",
      estado: categoria.estado ?? true,
      parent_id: categoria.parent_id || "",
    });
    setIsCreatingRepuestoType(!categoria.parent_id);
  };

  const handleCategoriaMotoEdit = (categoria) => {
    setCategoriaMotoEditingId(categoria.id);
    setCategoriaMotoForm({
      nombre: categoria.nombre || "",
      estado: categoria.estado ?? true,
      parent_id: categoria.parent_id || "",
    });
    setIsCreatingMotoType(!categoria.parent_id);
  };

  const handleEdit = (moto) => {
    const categoriaMatch = categoriasMotos.find(
      (categoria) => categoria.nombre?.toLowerCase() === (moto.categoria || "").toLowerCase()
    );
    const tipoId = categoriaMatch?.parent_id || (categoriaMatch ? categoriaMatch.id : "");
    setEditingId(moto.id);
    setForm({
      nombre: moto.nombre || "",
      marca: moto.marca || "",
      modelo_codigo: moto.modelo_codigo || "",
      descripcion: moto.descripcion || "",
      categoria: moto.categoria || "",
      anio: String(moto.anio ?? ""),
      cilindrada_cc: String(moto.cilindrada_cc ?? ""),
      capacidad_tanque_l: String(moto.capacidad_tanque_l ?? ""),
      maxima_velocidad_kmh: String(moto.maxima_velocidad_kmh ?? ""),
      velocidades: String(moto.velocidades ?? ""),
      torque_max_nm: String(moto.torque_max_nm ?? ""),
      motor_especificacion: moto.motor_especificacion || "",
      precio: String(moto.precio ?? ""),
      stock: String(moto.stock ?? ""),
      estado: moto.estado || "disponible",
      imagen_url: moto.imagen_url || "",
      logo_url: moto.logo_url || "",
      brand_logo_url: moto.brand_logo_url || "",
      ficha_tecnica_url: moto.ficha_tecnica_url || "",
      video_url: moto.video_url || "",
      video_activo: Boolean(moto.video_url),
      galeria_activa: normalizeGaleria(moto.galeria_destacada).length > 0,
      galeria_destacada: normalizeGaleria(moto.galeria_destacada),
    });
    setMotoTipoId(tipoId || "");
    setMotoSubcategoriaId(categoriaMatch?.parent_id ? categoriaMatch.id : "");
    setImagePreview(moto.imagen_url || "");
    setImageFile(null);
    setImageUrlError("");
    setLogoFile(null);
    setLogoPreview("");
    setBrandLogoFile(null);
    setBrandLogoPreview("");
    setFichaTecnicaUrlError("");
    setGaleriaItem(emptyGaleriaItem);
    setModalOpen(true);
  };

  const handleRepuestoEdit = (repuesto) => {
    const categoriaId =
      repuesto.categoria_id ||
      categoriasRepuestos.find((categoria) => categoria.nombre === repuesto.categoria)?.id ||
      "";
    const categoriaMatch = categoriasRepuestos.find((categoria) => categoria.id === categoriaId);
    const parentCategoria = categoriaMatch?.parent_id
      ? categoriasRepuestos.find((categoria) => categoria.id === categoriaMatch.parent_id)
      : null;
    const tipoId = parentCategoria?.parent_id || categoriaMatch?.parent_id || (categoriaMatch ? categoriaMatch.id : "");
    setRepuestoEditingId(repuesto.id);
    setRepuestoForm({
      nombre: repuesto.nombre || "",
      categoria_id: categoriaId,
      descripcion: repuesto.descripcion || "",
      precio: String(repuesto.precio ?? ""),
      stock: String(repuesto.stock ?? ""),
      estado: repuesto.estado || "disponible",
      imagen_url: repuesto.imagen_url || "",
      unidad_medida: repuesto.unidad_medida || "",
      modelo: repuesto.modelo || "",
      cantidad_por_paquete: String(repuesto.cantidad_por_paquete ?? ""),
      marca_logo_url: repuesto.marca_logo_url || "",
      galeria_imagenes: Array.isArray(repuesto.galeria_imagenes) ? repuesto.galeria_imagenes : [],
    });
    setRepuestoTipoId(tipoId || "");
    setRepuestoSubcategoriaId(parentCategoria?.parent_id ? parentCategoria.id : categoriaMatch?.parent_id ? categoriaMatch.id : "");
    setRepuestoSubsubcategoriaId(parentCategoria?.parent_id ? categoriaMatch?.id || "" : "");
    setRepuestoImagePreview(repuesto.imagen_url || "");
    setRepuestoImageFile(null);
    setRepuestoImageUrlError("");
    setRepuestoGaleriaUrlInput("");
    setRepuestoModalOpen(true);
  };

  const handleAddRepuestoGaleriaUrl = () => {
    const trimmed = repuestoGaleriaUrlInput.trim();
    if (!trimmed || !isValidUrl(trimmed)) {
      Swal.fire("Validación", "Ingresa una URL válida (http/https) para la imagen del carrusel.", "warning");
      return;
    }

    if ((repuestoForm.galeria_imagenes || []).length >= 5) {
      Swal.fire("Límite alcanzado", "Solo puedes agregar hasta 5 imágenes en el carrusel.", "info");
      return;
    }

    if ((repuestoForm.galeria_imagenes || []).includes(trimmed)) {
      Swal.fire("Validación", "Esa imagen ya fue agregada al carrusel.", "info");
      return;
    }

    setRepuestoForm((prev) => ({
      ...prev,
      galeria_imagenes: [...(prev.galeria_imagenes || []), trimmed],
    }));
    setRepuestoGaleriaUrlInput("");
  };

  const handleRemoveRepuestoGaleriaUrl = (index) => {
    setRepuestoForm((prev) => ({
      ...prev,
      galeria_imagenes: (prev.galeria_imagenes || []).filter((_, idx) => idx !== index),
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setImageUrlError("");
  };

  const handleRepuestoImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setRepuestoImageFile(file);
    setRepuestoImagePreview(URL.createObjectURL(file));
    setRepuestoImageUrlError("");
  };

  const handleClearImage = () => {
    setImageFile(null);
    setImagePreview("");
    setImageUrlError("");
    setForm((prev) => ({ ...prev, imagen_url: "" }));
  };

  const handleVideoToggle = () => {
    setForm((prev) => ({
      ...prev,
      video_activo: !prev.video_activo,
      video_url: prev.video_activo ? "" : prev.video_url,
      video_file: prev.video_activo ? null : prev.video_file,
    }));
  };

  const handleVideoFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, video_file: file }));
  };

  const handleLogoFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
    setLogoUrlError("");
  };

  const handleBrandLogoFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setBrandLogoFile(file);
    setBrandLogoPreview(URL.createObjectURL(file));
    setBrandLogoUrlError("");
  };

  const handleClearLogoImage = () => {
    setLogoFile(null);
    setLogoPreview("");
    setLogoUrlError("");
    setForm((prev) => ({ ...prev, logo_url: "" }));
  };

  const handleClearBrandLogoImage = () => {
    setBrandLogoFile(null);
    setBrandLogoPreview("");
    setBrandLogoUrlError("");
    setForm((prev) => ({ ...prev, brand_logo_url: "" }));
  };

  const handleGaleriaToggle = () => {
    setForm((prev) => ({
      ...prev,
      galeria_activa: !prev.galeria_activa,
      galeria_destacada: prev.galeria_activa ? [] : prev.galeria_destacada,
    }));
    setGaleriaItem(emptyGaleriaItem);
  };

  const handleClearRepuestoImage = () => {
    setRepuestoImageFile(null);
    setRepuestoImagePreview("");
    setRepuestoImageUrlError("");
    setRepuestoForm((prev) => ({ ...prev, imagen_url: "" }));
  };

  const handleGaleriaItemChange = (event) => {
    const { name, value } = event.target;
    setGaleriaItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleGaleriaAdd = () => {
    const trimmedUrl = galeriaItem.imagen_url.trim();
    if (!trimmedUrl || !isValidUrl(trimmedUrl)) {
      Swal.fire("Validación", "Agrega una URL válida para la imagen de la galería", "warning");
      return;
    }
    setForm((prev) => ({
      ...prev,
      galeria_destacada: [
        ...prev.galeria_destacada,
        {
          imagen_url: normalizeStorageUrl(trimmedUrl),
          titulo: galeriaItem.titulo.trim(),
          descripcion: galeriaItem.descripcion.trim(),
        },
      ],
    }));
    setGaleriaItem(emptyGaleriaItem);
  };

  const handleGaleriaUpdate = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      galeria_destacada: prev.galeria_destacada.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleGaleriaRemove = (index) => {
    setForm((prev) => ({
      ...prev,
      galeria_destacada: prev.galeria_destacada.filter((_, idx) => idx !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre.trim()) {
      Swal.fire("Validación", "El nombre del modelo es obligatorio", "warning");
      return;
    }

    if (motoTipos.length > 0 && !motoTipoId) {
      Swal.fire("Validación", "Selecciona un tipo para el modelo", "warning");
      return;
    }

    const selectedSubcategoria = motoSubcategoriaId
      ? categoriasMotos.find((categoria) => categoria.id === motoSubcategoriaId)
      : null;
    const selectedTipo = motoTipoId
      ? categoriasMotos.find((categoria) => categoria.id === motoTipoId)
      : null;
    const categoriaValue = selectedSubcategoria?.nombre || selectedTipo?.nombre || form.categoria.trim();

    if (!categoriaValue) {
      Swal.fire("Validación", "Selecciona una categoría válida", "warning");
      return;
    }

    if (!imageFile && imageUrlError) {
      Swal.fire("Validación", "Ingresa una URL válida o sube una imagen local", "warning");
      return;
    }

    if (!imageFile && !form.imagen_url.trim()) {
      Swal.fire("Imagen faltante", "Falta la imagen principal de la moto. Sube una imagen o pega una URL válida antes de guardar.", "warning");
      return;
    }

    if (logoUrlError || brandLogoUrlError || fichaTecnicaUrlError) {
      Swal.fire("Validación", "Revisa las URLs de logos y de ficha técnica antes de guardar", "warning");
      return;
    }

    if (form.video_activo && !form.video_url.trim() && !form.video_file) {
      Swal.fire("Validación", "Agrega una URL de video o sube un archivo", "warning");
      return;
    }

    const selectedCategoriaId = selectedSubcategoria?.id || selectedTipo?.id || null;
    const tipoNombre = selectedTipo?.nombre || form.categoria || "sin-tipo";
    const subcategoriaNombre = selectedSubcategoria?.nombre || selectedTipo?.nombre || "sin-subcategoria";
    const motoSlug = slugifySegment(`${form.nombre}-${form.modelo_codigo || "modelo"}`, slugifySegment(form.nombre, "modelo"));

    const parsedPrice = Number(form.precio);
    const parsedStock = Number(form.stock);

    const payload = {
      nombre: form.nombre.trim(),
      marca: form.marca.trim() || null,
      modelo_codigo: form.modelo_codigo.trim() || null,
      descripcion: form.descripcion.trim() || null,
      categoria: categoriaValue,
      anio: form.anio ? Number(form.anio) : null,
      cilindrada_cc: form.cilindrada_cc ? Number(form.cilindrada_cc) : null,
      capacidad_tanque_l: form.capacidad_tanque_l ? Number(form.capacidad_tanque_l) : null,
      maxima_velocidad_kmh: form.maxima_velocidad_kmh ? Number(form.maxima_velocidad_kmh) : null,
      velocidades: form.velocidades ? Number(form.velocidades) : null,
      torque_max_nm: form.torque_max_nm ? Number(form.torque_max_nm) : null,
      motor_especificacion: form.motor_especificacion.trim() || null,
      precio: parsedPrice,
      stock: parsedStock,
      estado: form.estado,
      imagen_url: normalizeStorageUrl(form.imagen_url) || null,
      video_url: form.video_activo ? form.video_url.trim() || null : null,
      logo_url: normalizeStorageUrl(form.logo_url) || null,
      brand_logo_url: normalizeStorageUrl(form.brand_logo_url) || null,
      ficha_tecnica_url: normalizeStorageUrl(form.ficha_tecnica_url) || null,
      galeria_destacada: form.galeria_activa
        ? form.galeria_destacada
          .filter((item) => item.imagen_url && isValidUrl(item.imagen_url))
          .map((item) => ({
            imagen_url: normalizeStorageUrl(item.imagen_url.trim()),
            titulo: item.titulo?.trim() || "",
            descripcion: item.descripcion?.trim() || "",
          }))
        : [],
    };

    if (Number.isNaN(payload.precio)) {
      Swal.fire("Validación", "El precio debe ser un número válido", "warning");
      return;
    }

    if (!Number.isInteger(payload.stock) || payload.stock < 1) {
      Swal.fire("Validación", "El stock debe ser un número entero mayor o igual a 1", "warning");
      return;
    }

    setSaving(true);
    try {
      const motoIdForMedia = editingId || crypto.randomUUID();

      if (imageFile) {
        setUploading(true);
        const publicUrl = await uploadMotoImage(imageFile, {
          categoriaId: motoTipoId,
          categoriaNombre: tipoNombre,
          subcategoriaId: selectedCategoriaId,
          subcategoriaNombre,
          motoId: motoIdForMedia,
          motoSlug,
          mediaType: "hero",
        });
        payload.imagen_url = publicUrl;
      }

      if (logoFile) {
        setUploading(true);
        const publicUrl = await uploadMotoImage(logoFile, {
          categoriaId: motoTipoId,
          categoriaNombre: tipoNombre,
          subcategoriaId: selectedCategoriaId,
          subcategoriaNombre,
          motoId: motoIdForMedia,
          motoSlug,
          mediaType: "logo_modelo",
        });
        payload.logo_url = publicUrl;
      }

      if (brandLogoFile) {
        setUploading(true);
        const publicUrl = await uploadMotoImage(brandLogoFile, {
          categoriaId: motoTipoId,
          categoriaNombre: tipoNombre,
          subcategoriaId: selectedCategoriaId,
          subcategoriaNombre,
          motoId: motoIdForMedia,
          motoSlug,
          mediaType: "logo_marca",
        });
        payload.brand_logo_url = publicUrl;
      }

      if (form.video_activo && form.video_file) {
        setUploadingVideo(true);
        const publicUrl = await uploadMotoVideo(form.video_file, {
          categoriaId: motoTipoId,
          categoriaNombre: tipoNombre,
          subcategoriaId: selectedCategoriaId,
          subcategoriaNombre,
          motoId: motoIdForMedia,
          motoSlug,
          mediaType: "video_principal",
        });
        payload.video_url = publicUrl;
        setForm((prev) => ({ ...prev, video_file: null, video_url: publicUrl }));
      }

      if (editingId) {
        const updated = await updateMoto(editingId, payload);
        setMotos((prev) => prev.map((m) => (m.id === editingId ? updated : m)));
        Swal.fire("Actualizado", "Modelo actualizado correctamente", "success");
      } else {
        const created = await addMoto(payload);
        setMotos((prev) => [created, ...prev]);
        Swal.fire("Creado", "Modelo agregado al inventario", "success");
      }
      resetForm();
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        getMotoSaveErrorMessage(error),
        "error"
      );
    } finally {
      setSaving(false);
      setUploading(false);
      setUploadingVideo(false);
    }
  };

  const handleRepuestoSubmit = async (e) => {
    e.preventDefault();

    const selectedCategoriaId = repuestoSubsubcategoriaId || repuestoSubcategoriaId || repuestoTipoId || repuestoForm.categoria_id;

    if (!repuestoForm.nombre.trim() || !selectedCategoriaId) {
      Swal.fire("Validación", "Nombre y categoría son obligatorios", "warning");
      return;
    }

    if (!repuestoImageFile && repuestoImageUrlError) {
      Swal.fire("Validación", "Ingresa una URL válida o sube una imagen local", "warning");
      return;
    }

    const selectedSubsubcategoria = repuestoSubsubcategoriaId
      ? categoriasRepuestos.find((categoria) => categoria.id === repuestoSubsubcategoriaId)
      : null;
    const selectedSubcategoria = repuestoSubcategoriaId
      ? categoriasRepuestos.find((categoria) => categoria.id === repuestoSubcategoriaId)
      : null;
    const selectedTipo = repuestoTipoId
      ? categoriasRepuestos.find((categoria) => categoria.id === repuestoTipoId)
      : null;
    const selectedCategoria = selectedSubsubcategoria || selectedSubcategoria || selectedTipo;
    const tipoNombre = selectedTipo?.nombre || selectedCategoria?.nombre || "sin-tipo";
    const subcategoriaNombre = selectedSubsubcategoria?.nombre || selectedSubcategoria?.nombre || selectedTipo?.nombre || "sin-subcategoria";
    const repuestoSlug = slugifySegment(repuestoForm.nombre, "repuesto");

    if (!selectedCategoria) {
      Swal.fire("Validación", "Selecciona una categoría válida", "warning");
      return;
    }

    const payload = {
      nombre: repuestoForm.nombre.trim(),
      categoria: selectedCategoria.nombre || "",
      categoria_id: selectedCategoria.id,
      descripcion: repuestoForm.descripcion.trim() || null,
      precio: Number(repuestoForm.precio),
      stock: Number(repuestoForm.stock),
      estado: repuestoForm.estado,
      imagen_url: repuestoForm.imagen_url.trim() || null,
      unidad_medida: repuestoForm.unidad_medida.trim() || null,
      modelo: repuestoForm.modelo.trim() || null,
      cantidad_por_paquete: repuestoForm.cantidad_por_paquete ? Number(repuestoForm.cantidad_por_paquete) : null,
      marca_logo_url: repuestoForm.marca_logo_url.trim() || null,
      galeria_imagenes: (repuestoForm.galeria_imagenes || []).filter(Boolean).slice(0, 5),
    };

    if (Number.isNaN(payload.precio) || Number.isNaN(payload.stock)) {
      Swal.fire("Validación", "Precio y stock deben ser números válidos", "warning");
      return;
    }

    if (payload.cantidad_por_paquete !== null && Number.isNaN(payload.cantidad_por_paquete)) {
      Swal.fire("Validación", "La cantidad por paquete debe ser un número válido", "warning");
      return;
    }

    setSaving(true);
    try {
      if (repuestoImageFile) {
        setUploading(true);
        const publicUrl = await uploadRepuestoImage(repuestoImageFile, {
          categoriaPadreId: selectedTipo?.id || selectedCategoria?.id,
          categoriaPadreNombre: tipoNombre,
          subcategoriaId: selectedSubsubcategoria?.id || selectedSubcategoria?.id || selectedTipo?.id,
          subcategoriaNombre,
          repuestoId: repuestoEditingId,
          repuestoSlug,
          mediaType: "principal",
        });
        payload.imagen_url = publicUrl;
      }

      if (repuestoEditingId) {
        const updated = await updateRepuesto(repuestoEditingId, payload);
        setRepuestos((prev) => prev.map((r) => (r.id === repuestoEditingId ? updated : r)));
        Swal.fire("Actualizado", "Repuesto actualizado correctamente", "success");
      } else {
        const created = await addRepuesto(payload);
        setRepuestos((prev) => [created, ...prev]);
        Swal.fire("Creado", "Repuesto agregado al inventario", "success");
      }
      resetRepuestoForm();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo guardar el repuesto", "error");
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar modelo?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteMoto(id);
      setMotos((prev) => prev.filter((m) => m.id !== id));
      Swal.fire("Eliminado", "Modelo eliminado", "success");
      if (editingId === id) resetForm();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", getMotoDeleteErrorMessage(error), "error");
    }
  };

  const handleDeleteRepuesto = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar repuesto?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteRepuesto(id);
      setRepuestos((prev) => prev.filter((r) => r.id !== id));
      Swal.fire("Eliminado", "Repuesto eliminado", "success");
      if (repuestoEditingId === id) resetRepuestoForm();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo eliminar el repuesto", "error");
    }
  };

  const handleCategoriaSubmit = async (e) => {
    e.preventDefault();

    if (!categoriaForm.nombre.trim()) {
      Swal.fire("Validación", "El nombre de la categoría es obligatorio", "warning");
      return;
    }

    if (!isCreatingRepuestoType && repuestoTipos.length > 0 && !categoriaForm.parent_id) {
      Swal.fire("Validación", "Selecciona un tipo para la subcategoría", "warning");
      return;
    }

    if (!isCreatingRepuestoType && categoriaForm.parent_id) {
      const parentDepth = repuestoCategoryDepthById[categoriaForm.parent_id] ?? 0;
      if (parentDepth >= 2) {
        Swal.fire("Validación", "No se puede crear un cuarto nivel. Máximo permitido: categoría / subcategoría / subsubcategoría.", "warning");
        return;
      }
    }

    setSaving(true);
    try {
      const payload = {
        ...categoriaForm,
        parent_id: isCreatingRepuestoType ? null : categoriaForm.parent_id || null,
      };

      if (categoriaEditingId) {
        const updated = await updateCategoriaRepuesto(categoriaEditingId, payload);
        setCategoriasRepuestos((prev) => prev.map((cat) => (cat.id === categoriaEditingId ? updated : cat)));
        Swal.fire("Actualizado", "Categoría actualizada correctamente", "success");
      } else {
        const created = await addCategoriaRepuesto(payload);
        setCategoriasRepuestos((prev) => [...prev, created].sort((a, b) => a.nombre.localeCompare(b.nombre)));

        try {
          const folderResult = await ensureRepuestoCategoryFolder({
            parentId: created.parent_id,
            categoryId: created.id,
          });
          if (folderResult?.skipped) {
            Swal.fire("Creado", "Categoría creada correctamente", "success");
          } else {
            Swal.fire("Creado", "Categoría creada correctamente y carpeta inicial generada", "success");
          }
        } catch (folderError) {
          console.warn("No se pudo crear la carpeta de Storage para repuestos", folderError);
          const bucketName = getConfiguredBucketName("repuestos");
          Swal.fire(
            "Creado con aviso",
            isBucketMissingError(folderError)
              ? `La categoría se creó, pero no se encontró el bucket "${bucketName}". Verifica VITE_SUPABASE_INVENTARIO_BUCKET.`
              : isStoragePermissionError(folderError)
                ? "La categoría se creó, pero tu política de Storage (RLS) no permite crear carpetas desde el cliente."
                : "La categoría se creó, pero no se pudo crear su carpeta en Storage.",
            "warning"
          );
        }
      }
      resetCategoriaForm();
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        isDuplicateNameError(error)
          ? "Ya existe una categoría con ese nombre. Usa otro nombre para continuar."
          : "No se pudo guardar la categoría",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCategoriaMotoSubmit = async (e) => {
    e.preventDefault();

    if (!categoriaMotoForm.nombre.trim()) {
      Swal.fire("Validación", "El nombre de la categoría es obligatorio", "warning");
      return;
    }

    if (!isCreatingMotoType && motoTipos.length > 0 && !categoriaMotoForm.parent_id) {
      Swal.fire("Validación", "Selecciona un tipo para la subcategoría", "warning");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...categoriaMotoForm,
        parent_id: isCreatingMotoType ? null : categoriaMotoForm.parent_id || null,
      };
      if (categoriaMotoEditingId) {
        const updated = await updateCategoriaMoto(categoriaMotoEditingId, payload);
        setCategoriasMotos((prev) => prev.map((cat) => (cat.id === categoriaMotoEditingId ? updated : cat)));
        Swal.fire("Actualizado", "Categoría actualizada correctamente", "success");
      } else {
        const created = await addCategoriaMoto(payload);
        setCategoriasMotos((prev) => [...prev, created].sort((a, b) => a.nombre.localeCompare(b.nombre)));

        try {
          const folderResult = await ensureMotoCategoryFolder({
            parentId: created.parent_id,
            categoryId: created.id,
          });
          if (folderResult?.skipped) {
            Swal.fire("Creado", "Categoría creada correctamente", "success");
          } else {
            Swal.fire("Creado", "Categoría creada correctamente y carpeta inicial generada", "success");
          }
        } catch (folderError) {
          console.warn("No se pudo crear la carpeta de Storage para motos", folderError);
          const bucketName = getConfiguredBucketName("motos");
          Swal.fire(
            "Creado con aviso",
            isBucketMissingError(folderError)
              ? `La categoría se creó, pero no se encontró el bucket "${bucketName}". Verifica VITE_SUPABASE_INVENTARIO_BUCKET.`
              : isStoragePermissionError(folderError)
                ? "La categoría se creó, pero tu política de Storage (RLS) no permite crear carpetas desde el cliente."
                : "La categoría se creó, pero no se pudo crear su carpeta en Storage.",
            "warning"
          );
        }
      }
      resetCategoriaMotoForm();
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        isDuplicateNameError(error)
          ? "Ya existe una categoría con ese nombre. Usa otro nombre para continuar."
          : "No se pudo guardar la categoría",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategoriaMoto = async (id) => {
    const childCategorias = categoriasMotos.filter((categoria) => categoria.parent_id === id);
    const currentCategoria = categoriasMotos.find((categoria) => categoria.id === id);
    const categoriasObjetivo = [
      ...(currentCategoria ? [currentCategoria] : []),
      ...childCategorias,
    ];
    const prefixes = categoriasObjetivo.flatMap((categoria) =>
      getMotoCategoryFolderPrefixes({ id: categoria.id, parentId: categoria.parent_id })
    );

    const linkedFiles = [];
    for (const prefix of prefixes) {
      const files = await listFolderFiles("motos", prefix);
      linkedFiles.push(...files.filter(isRealFile));
    }

    if (linkedFiles.length > 0) {
      const resumen = linkedFiles.slice(0, 8).map((file) => `• ${file}`).join("\n");
      Swal.fire(
        "No se puede eliminar",
        `Hay ${linkedFiles.length} archivo(s) en la carpeta de esta categoría/subcategorías. Elimina primero esos archivos:\n\n${resumen}${linkedFiles.length > 8 ? "\n• ..." : ""}`,
        "warning"
      );
      return;
    }

    const result = await Swal.fire({
      title: "¿Eliminar categoría?",
      text: childCategorias.length
        ? `Esta categoría tiene ${childCategorias.length} subcategoría(s). Se eliminarán también.`
        : "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      for (const prefix of prefixes) {
        await deleteFolder("motos", prefix);
      }

      if (childCategorias.length > 0) {
        await Promise.all(childCategorias.map((child) => deleteCategoriaMoto(child.id)));
      }
      await deleteCategoriaMoto(id);
      setCategoriasMotos((prev) =>
        prev.filter((cat) => cat.id !== id && cat.parent_id !== id)
      );
      if (categoriaMotoEditingId === id) resetCategoriaMotoForm();
      Swal.fire("Eliminado", "Categoría eliminada", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo eliminar la categoría", "error");
    }
  };



  const collectRepuestoDescendantIds = (rootId) => {
    const descendants = [];

    const walk = (parentId) => {
      const children = categoriasRepuestos.filter((categoria) => categoria.parent_id === parentId);
      children.forEach((child) => {
        walk(child.id);
        descendants.push(child.id);
      });
    };

    walk(rootId);
    return descendants;
  };

  const handleDeleteCategoria = async (id) => {
    const descendantIds = collectRepuestoDescendantIds(id);
    const categoryIdsToDelete = [id, ...descendantIds];

    const categoriasRelacionadas = categoriasRepuestos.filter((categoria) =>
      categoryIdsToDelete.includes(categoria.id)
    );
    const categoryNames = categoriasRelacionadas
      .map((categoria) => (categoria.nombre || "").toLowerCase())
      .filter(Boolean);

    const linkedByForeignKey = repuestos.filter((repuesto) =>
      repuesto.categoria_id && categoryIdsToDelete.includes(repuesto.categoria_id)
    );

    const linkedByLegacyText = repuestos.filter(
      (repuesto) => !repuesto.categoria_id && categoryNames.includes((repuesto.categoria || "").toLowerCase())
    );

    const linkedRepuestos = [...new Map([...linkedByForeignKey, ...linkedByLegacyText].map((item) => [item.id, item])).values()];

    if (linkedRepuestos.length > 0) {
      Swal.fire(
        "No se puede eliminar",
        `Hay ${linkedRepuestos.length} repuesto(s) asociados a esta categoría o sus subcategorías. Reasígnalos antes de eliminar.`,
        "warning"
      );
      return;
    }

    const categoriasObjetivo = categoriasRepuestos.filter((categoria) => categoryIdsToDelete.includes(categoria.id));
    const prefixes = categoriasObjetivo.flatMap((categoria) =>
      getRepuestoCategoryFolderPrefixes({ id: categoria.id, parentId: categoria.parent_id })
    );

    const linkedFiles = [];
    for (const prefix of prefixes) {
      const files = await listFolderFiles("repuestos", prefix);
      linkedFiles.push(...files.filter(isRealFile));
    }

    if (linkedFiles.length > 0) {
      const resumen = linkedFiles.slice(0, 8).map((file) => `• ${file}`).join("\n");
      Swal.fire(
        "No se puede eliminar",
        `Hay ${linkedFiles.length} archivo(s) en la carpeta de esta categoría/subcategorías. Elimina primero esos archivos:\n\n${resumen}${linkedFiles.length > 8 ? "\n• ..." : ""}`,
        "warning"
      );
      return;
    }

    const result = await Swal.fire({
      title: "¿Eliminar categoría?",
      text: descendantIds.length
        ? `Esta categoría tiene ${descendantIds.length} subcategoría(s). Se eliminarán también.`
        : "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      for (const prefix of prefixes) {
        await deleteFolder("repuestos", prefix);
      }

      if (descendantIds.length > 0) {
        await Promise.all(descendantIds.map((categoriaId) => deleteCategoriaRepuesto(categoriaId)));
      }
      await deleteCategoriaRepuesto(id);
      setCategoriasRepuestos((prev) => prev.filter((cat) => !categoryIdsToDelete.includes(cat.id)));
      if (categoryIdsToDelete.includes(repuestoForm.categoria_id)) {
        setRepuestoForm((prev) => ({ ...prev, categoria_id: "" }));
        setRepuestoSubcategoriaId("");
        setRepuestoTipoId("");
      }
      if (categoriaEditingId && categoryIdsToDelete.includes(categoriaEditingId)) resetCategoriaForm();
      Swal.fire("Eliminado", "Categoría eliminada", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo eliminar la categoría", "error");
    }
  };

  const renderRepuestoCategoryNode = (categoria, level = 0) => {
    const children = categoriasRepuestos.filter((item) => item.parent_id === categoria.id);

    return (
      <div key={categoria.id} className={`rounded-xl border border-gray-100 ${level === 0 ? "bg-gray-50 p-4 space-y-3" : "bg-white px-3 py-2"}`} style={level > 0 ? { marginLeft: `${Math.min(level, 3) * 12}px` } : undefined}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-slate-800">{categoria.nombre}</p>
            <p className="text-[11px] text-gray-400">{buildRepuestoCategoryLabel(categoriasRepuestos, categoria.id, categoria.nombre)}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${categoria.estado ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}>
              {categoria.estado ? "Activa" : "Inactiva"}
            </span>
            {level < 2 && (
              <button type="button" onClick={() => handleCategoriaCreateChild(categoria)} className="px-3 py-1.5 text-xs font-bold rounded-full bg-yellow-400 text-black">
                + Hija
              </button>
            )}
            <button type="button" onClick={() => handleCategoriaEdit(categoria)} className="p-1.5 rounded-lg border border-blue-200 text-blue-600">
              <Pencil size={12} />
            </button>
            <button type="button" onClick={() => handleDeleteCategoria(categoria.id)} className="p-1.5 rounded-lg border border-red-200 text-red-500">
              <Trash2 size={12} />
            </button>
          </div>
        </div>
        {children.length > 0 && (
          <div className="space-y-2 pl-2 border-l-2 border-yellow-200">
            {children.map((child) => renderRepuestoCategoryNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const RepuestoHeader = () => (
    <div className="grid grid-cols-[100px_1.1fr_0.9fr_0.7fr_0.7fr_120px] items-center bg-[#f5f6f8] text-[#556786] font-semibold text-[15px] rounded-t-2xl px-5 py-3 border border-gray-100">
      <span>Imagen</span>
      <span>Repuesto</span>
      <span>Categoría</span>
      <span>Precio</span>
      <span>Estado</span>
      <span className="text-right">Acciones</span>
    </div>
  );

  const RepuestoRow = ({ repuesto }) => (
    <div className="grid grid-cols-[100px_1.1fr_0.9fr_0.7fr_0.7fr_120px] items-center bg-white px-5 py-3 border-x border-b border-gray-100">
      <img
        src={repuesto.imagen_url || "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=600&auto=format&fit=crop"}
        alt={repuesto.nombre}
        className="w-[70px] h-[48px] object-cover rounded-xl bg-gray-100"
      />
      <div>
        <p className="font-bold text-lg leading-tight text-[#1d2b44]">{repuesto.nombre}</p>
        <p className="text-xs text-gray-400">ID: {repuesto.id}</p>
      </div>
      <p className="text-[#334b68] text-sm">
        {buildRepuestoCategoryLabel(categoriasRepuestos, repuesto.categoria_id, repuesto.categoria || "-")}
      </p>
      <p className="text-green-600 text-lg font-bold">S/ {Number(repuesto.precio || 0).toLocaleString()}</p>
      <span className={`inline-flex w-fit px-3 py-1 rounded-full font-bold text-[11px] uppercase ${estadoClass[(repuesto.estado || "disponible").toLowerCase()] || "bg-gray-100 text-gray-600"}`}>
        {(repuesto.estado || "disponible").toUpperCase()}
      </span>
      <div className="flex justify-end gap-3">
        <button onClick={() => handleRepuestoEdit(repuesto)} className="p-2 rounded-lg border border-blue-200 text-blue-600">
          <Pencil size={16} />
        </button>
        <button onClick={() => handleDeleteRepuesto(repuesto.id)} className="p-2 rounded-lg border border-red-200 text-red-500">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Inventario</h1>
          <p className="text-sm text-gray-500">Gestiona productos por secciones: motos y repuestos.</p>
        </div>
      </header>

      <div className="bg-white border border-gray-100 rounded-2xl p-2 inline-flex gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 ${active ? "bg-yellow-400 text-black" : "bg-gray-100 text-gray-600"
                }`}
            >
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
          <div className="flex flex-wrap gap-2">
            {(activeTab === "motos" ? categorias : repuestoCategorias).map((cat) => {
              const active = activeTab === "motos" ? filtroCategoria === cat : repuestoFiltroCategoria === cat;
              const motoCategoria = activeTab === "motos" && cat !== "all"
                ? findMotoCategoriaByName(categoriasMotos, cat)
                : null;
              return (
                <div
                  key={cat}
                  role="button"
                  tabIndex={0}
                  onClick={() => (activeTab === "motos" ? setFiltroCategoria(cat) : setRepuestoFiltroCategoria(cat))}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      if (activeTab === "motos") {
                        setFiltroCategoria(cat);
                      } else {
                        setRepuestoFiltroCategoria(cat);
                      }
                    }
                  }}
                  className={`group relative px-4 py-2 rounded-full text-xs font-bold inline-flex items-center gap-2 cursor-pointer ${active ? "bg-yellow-400 text-black" : "bg-gray-100 text-gray-600"
                    }`}
                >
                  <span>
                    {cat === "all"
                      ? "Todas"
                      : activeTab === "motos"
                        ? cat
                        : buildRepuestoCategoryLabel(categoriasRepuestos, cat)}
                  </span>
                  {activeTab === "motos" && cat !== "all" && motoCategoria && (
                    <span className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleCategoriaMotoEdit(motoCategoria);
                        }}
                        className="p-1 rounded-full bg-white/70 text-slate-700 hover:bg-white"
                        title="Editar categoría"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDeleteCategoriaMoto(motoCategoria.id);
                        }}
                        className="p-1 rounded-full bg-white/70 text-red-600 hover:bg-white"
                        title="Eliminar categoría"
                      >
                        <Trash2 size={12} />
                      </button>
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {activeTab === "motos" ? (
            <button
              onClick={handleOpenCreateModal}
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2"
            >
              <Plus size={16} /> Nuevo
            </button>
          ) : (
            <button
              onClick={handleOpenRepuestoModal}
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2"
            >
              <Plus size={16} /> Nuevo
            </button>
          )}
        </div>

        {activeTab === "motos" ? (
          <>
            <div className="mb-6 grid grid-cols-1 lg:grid-cols-[1.1fr_1.4fr] gap-5">
              <form onSubmit={handleCategoriaMotoSubmit} className="bg-[#f5f6f8] rounded-2xl p-5 space-y-4 border border-gray-100">
                <h3 className="text-lg font-bold text-slate-800">Categorías de motos</h3>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Nombre</label>
                  <input
                    name="nombre"
                    value={categoriaMotoForm.nombre}
                    onChange={handleCategoriaMotoChange}
                    placeholder={isCreatingMotoType ? "Ej. Cargueros" : "Ej. Carguero liviano"}
                    className="mt-2 w-full border rounded-xl px-3 py-2 bg-white"
                  />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-500">
                    <span>Modo de creación</span>
                    <button
                      type="button"
                      onClick={() => setIsCreatingMotoType(false)}
                      className={`px-3 py-1.5 rounded-full ${!isCreatingMotoType ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-500"
                        }`}
                    >
                      Subcategoría
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCreatingMotoType(true)}
                      className={`px-3 py-1.5 rounded-full ${isCreatingMotoType ? "bg-yellow-400 text-black" : "bg-gray-100 text-gray-500"
                        }`}
                    >
                      Tipo principal
                    </button>
                  </div>
                  <label className="text-sm font-semibold text-gray-700 block mt-3">
                    {isCreatingMotoType ? "Tipo" : "Asignar tipo"}
                  </label>
                  <select
                    name="parent_id"
                    value={categoriaMotoForm.parent_id}
                    onChange={handleCategoriaMotoChange}
                    disabled={isCreatingMotoType}
                    className="mt-2 w-full border rounded-xl px-3 py-2 bg-white disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    <option value="">
                      {isCreatingMotoType ? "Se creará como tipo principal" : "Selecciona un tipo"}
                    </option>
                    {motoTipos.map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.nombre}
                      </option>
                    ))}
                  </select>
                  {!isCreatingMotoType && motoTipos.length === 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                      Crea un tipo principal primero para asignar subcategorías.
                    </p>
                  )}
                </div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    name="estado"
                    checked={categoriaMotoForm.estado}
                    onChange={handleCategoriaMotoChange}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  Activa
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-yellow-400 hover:bg-yellow-500 rounded-xl px-4 py-2 text-sm font-bold text-black"
                  >
                    {categoriaMotoEditingId ? "Actualizar" : "Agregar"}
                  </button>
                  {categoriaMotoEditingId && (
                    <button
                      type="button"
                      onClick={resetCategoriaMotoForm}
                      className="text-sm font-semibold text-gray-500 hover:text-gray-700"
                    >
                      Cancelar edición
                    </button>
                  )}
                </div>
              </form>

              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Listado</h4>
                <div className="mt-4 space-y-3 max-h-72 overflow-auto pr-1">
                  {categoriasMotos.length === 0 ? (
                    <p className="text-sm text-gray-500">No hay categorías registradas.</p>
                  ) : (
                    <>
                      {motoTipos.map((tipo) => (
                        <div key={tipo.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-bold text-slate-800">{tipo.nombre}</p>
                              <p className="text-xs text-gray-400">ID: {tipo.id}</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`text-xs font-bold px-2 py-1 rounded-full ${tipo.estado ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}>
                                {tipo.estado ? "Activa" : "Inactiva"}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCategoriaMotoCreateChild(tipo)}
                                className="px-3 py-1.5 text-xs font-bold rounded-full bg-yellow-400 text-black"
                              >
                                + Subcategoría
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCategoriaMotoEdit(tipo)}
                                className="p-2 rounded-lg border border-blue-200 text-blue-600"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCategoriaMoto(tipo.id)}
                                className="p-2 rounded-lg border border-red-200 text-red-500"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                          <div className="space-y-2 pl-2 border-l-2 border-yellow-200">
                            {(subcategoriasPorTipo[tipo.id] || []).length === 0 ? (
                              <p className="text-xs text-gray-400">Sin subcategorías.</p>
                            ) : (
                              (subcategoriasPorTipo[tipo.id] || []).map((categoria) => (
                                <div key={categoria.id} className="flex items-center justify-between gap-3 bg-white rounded-lg px-3 py-2">
                                  <div>
                                    <p className="text-xs font-semibold text-slate-700">{categoria.nombre}</p>
                                    <p className="text-[11px] text-gray-400">ID: {categoria.id}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${categoria.estado ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}>
                                      {categoria.estado ? "Activa" : "Inactiva"}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleCategoriaMotoEdit(categoria)}
                                      className="p-1.5 rounded-lg border border-blue-200 text-blue-600"
                                    >
                                      <Pencil size={12} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteCategoriaMoto(categoria.id)}
                                      className="p-1.5 rounded-lg border border-red-200 text-red-500"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      ))}
                      {subcategoriasOrfanas.length > 0 && (
                        <div className="rounded-xl border border-dashed border-gray-200 bg-white p-4 space-y-2">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Subcategorías sin tipo</p>
                          {subcategoriasOrfanas.map((categoria) => (
                            <div key={categoria.id} className="flex items-center justify-between gap-3 bg-gray-50 rounded-lg px-3 py-2">
                              <div>
                                <p className="text-xs font-semibold text-slate-700">{categoria.nombre}</p>
                                <p className="text-[11px] text-gray-400">ID: {categoria.id}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleCategoriaMotoEdit(categoria)}
                                  className="p-1.5 rounded-lg border border-blue-200 text-blue-600"
                                >
                                  <Pencil size={12} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteCategoriaMoto(categoria.id)}
                                  className="p-1.5 rounded-lg border border-red-200 text-red-500"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            <TableHeader />
            {loading ? (
              <div className="border-x border-b border-gray-100 rounded-b-2xl bg-white text-gray-500 text-center py-16">Cargando inventario...</div>
            ) : motosFiltradas.length === 0 ? (
              <div className="border-x border-b border-gray-100 rounded-b-2xl bg-white text-gray-500 text-center py-16">
                <PackageSearch className="mx-auto mb-2" />
                No hay modelos en esta categoría
              </div>
            ) : (
              <div className="rounded-b-2xl overflow-hidden">
                {motosFiltradas.map((moto) => (
                  <MotoRow key={moto.id} moto={moto} onEdit={handleEdit} onDelete={handleDelete} estadoClass={estadoClass} />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mb-6 grid grid-cols-1 lg:grid-cols-[1.1fr_1.4fr] gap-5">
              <form onSubmit={handleCategoriaSubmit} className="bg-[#f5f6f8] rounded-2xl p-5 space-y-4 border border-gray-100">
                <h3 className="text-lg font-bold text-slate-800">Categorías de repuestos</h3>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Nombre</label>
                  <input
                    name="nombre"
                    value={categoriaForm.nombre}
                    onChange={handleCategoriaChange}
                    placeholder={isCreatingRepuestoType ? "Ej. Motor" : "Ej. Filtros / Suspensión / Delantera"}
                    className="mt-2 w-full border rounded-xl px-3 py-2 bg-white"
                  />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-500">
                    <span>Modo de creación</span>
                    <button
                      type="button"
                      onClick={() => setIsCreatingRepuestoType(false)}
                      className={`px-3 py-1.5 rounded-full ${!isCreatingRepuestoType ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-500"
                        }`}
                    >
                      Subcategoría
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCreatingRepuestoType(true)}
                      className={`px-3 py-1.5 rounded-full ${isCreatingRepuestoType ? "bg-yellow-400 text-black" : "bg-gray-100 text-gray-500"
                        }`}
                    >
                      Tipo principal
                    </button>
                  </div>
                  <label className="text-sm font-semibold text-gray-700 block mt-3">
                    {isCreatingRepuestoType ? "Categoría principal" : "Asignar categoría padre"}
                  </label>
                  <select
                    name="parent_id"
                    value={categoriaForm.parent_id}
                    onChange={handleCategoriaChange}
                    disabled={isCreatingRepuestoType}
                    className="mt-2 w-full border rounded-xl px-3 py-2 bg-white disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    <option value="">
                      {isCreatingRepuestoType ? "Se creará como categoría principal" : "Selecciona la categoría padre"}
                    </option>
                    {repuestoParentCandidates.map((categoria) => (
                        <option key={categoria.id} value={categoria.id}>
                          {buildRepuestoCategoryLabel(categoriasRepuestos, categoria.id, categoria.nombre)}
                        </option>
                      ))}
                  </select>
                  {!isCreatingRepuestoType && repuestoParentCandidates.length === 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                      No hay categorías disponibles para crear hijas. Recuerda: máximo 3 niveles.
                    </p>
                  )}
                </div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    name="estado"
                    checked={categoriaForm.estado}
                    onChange={handleCategoriaChange}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  Activa
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-yellow-400 hover:bg-yellow-500 rounded-xl px-4 py-2 text-sm font-bold text-black"
                  >
                    {categoriaEditingId ? "Actualizar" : "Agregar"}
                  </button>
                  {categoriaEditingId && (
                    <button
                      type="button"
                      onClick={resetCategoriaForm}
                      className="text-sm font-semibold text-gray-500 hover:text-gray-700"
                    >
                      Cancelar edición
                    </button>
                  )}
                </div>
              </form>

              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Listado</h4>
                <div className="mt-4 space-y-3 max-h-72 overflow-auto pr-1">
                  {categoriasRepuestos.length === 0 ? (
                    <p className="text-sm text-gray-500">No hay categorías registradas.</p>
                  ) : (
                    repuestoTipos.map((tipo) => renderRepuestoCategoryNode(tipo))
                  )}
                </div>
              </div>
            </div>
            <RepuestoHeader />
            {loadingRepuestos ? (
              <div className="border-x border-b border-gray-100 rounded-b-2xl bg-white text-gray-500 text-center py-16">
                Cargando repuestos...
              </div>
            ) : repuestosFiltrados.length === 0 ? (
              <div className="border-x border-b border-gray-100 rounded-b-2xl bg-white text-gray-500 text-center py-16">
                <PackageSearch className="mx-auto mb-2" />
                No hay repuestos en esta categoría
              </div>
            ) : (
              <div className="rounded-b-2xl overflow-hidden">
                {repuestosFiltrados.map((repuesto) => (
                  <RepuestoRow key={repuesto.id} repuesto={repuesto} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 space-y-6 relative shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-2xl font-black text-yellow-400">{editingId ? "Editar Motocicleta" : "Nueva Motocicleta"}</h2>
              <button
                type="button"
                onClick={resetForm}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <label className="relative border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 flex flex-col items-center justify-center text-center gap-2 py-8 cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="h-40 object-contain" />
              ) : (
                <>
                  <UploadCloud className="text-gray-400" size={32} />
                  <p className="text-gray-500 font-medium">Click para subir imagen</p>
                </>
              )}
              {uploading && <span className="text-xs text-gray-400">Subiendo imagen...</span>}
            </label>

            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex-1">
                <label className="text-sm font-semibold text-gray-700">URL de imagen (opcional)</label>
                <div className={`mt-2 flex items-center gap-2 bg-gray-50 border rounded-xl px-3 py-2 ${imageUrlError ? "border-red-300" : "border-gray-200"}`}>
                  <Link2 size={16} className="text-gray-400" />
                  <input
                    name="imagen_url"
                    value={form.imagen_url}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full bg-transparent outline-none"
                  />
                </div>
                {imageUrlError && <p className="text-xs text-red-500 mt-1">{imageUrlError}</p>}
              </div>
              {(imageFile || form.imagen_url) && (
                <button
                  type="button"
                  onClick={handleClearImage}
                  className="text-sm font-semibold text-gray-500 hover:text-gray-700"
                >
                  Limpiar imagen
                </button>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">Ficha técnica (PDF)</label>
              <div className="mt-2 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                <Link2 size={16} className="text-gray-400" />
                <input
                  name="ficha_tecnica_url"
                  value={form.ficha_tecnica_url}
                  onChange={handleChange}
                  placeholder="https://.../ficha-tecnica"
                  className="w-full bg-transparent outline-none"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Opcional: URL pública de la ficha técnica (idealmente PDF).</p>
              {fichaTecnicaUrlError && <p className="text-xs text-red-500 mt-1">{fichaTecnicaUrlError}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">Logo del modelo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoFileChange}
                  className="mt-2 w-full text-sm text-gray-600"
                />
                <input
                  name="logo_url"
                  value={form.logo_url}
                  onChange={handleChange}
                  placeholder="o pega una URL https://..."
                  className="mt-2 w-full border rounded-xl px-3 py-2 bg-gray-50"
                />
                {logoUrlError && <p className="text-xs text-red-500 mt-1">{logoUrlError}</p>}
                {(logoFile || form.logo_url) && (
                  <button
                    type="button"
                    onClick={handleClearLogoImage}
                    className="text-xs font-semibold text-gray-500 hover:text-gray-700 mt-2"
                  >
                    Limpiar logo del modelo
                  </button>
                )}
                {(logoPreview || isValidUrl(form.logo_url)) && (
                  <div className="mt-3 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-3 flex items-center justify-center">
                    <img
                      src={logoPreview || normalizeStorageUrl(form.logo_url)}
                      alt="Preview logo del modelo"
                      className="h-14 object-contain"
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Logo de la Marca</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBrandLogoFileChange}
                  className="mt-2 w-full text-sm text-gray-600"
                />
                <input
                  name="brand_logo_url"
                  value={form.brand_logo_url}
                  onChange={handleChange}
                  placeholder="o pega una URL https://..."
                  className="mt-2 w-full border rounded-xl px-3 py-2 bg-gray-50"
                />
                {brandLogoUrlError && <p className="text-xs text-red-500 mt-1">{brandLogoUrlError}</p>}
                {(brandLogoFile || form.brand_logo_url) && (
                  <button
                    type="button"
                    onClick={handleClearBrandLogoImage}
                    className="text-xs font-semibold text-gray-500 hover:text-gray-700 mt-2"
                  >
                    Limpiar logo de empresa
                  </button>
                )}
                {(brandLogoPreview || isValidUrl(form.brand_logo_url)) && (
                  <div className="mt-3 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-3 flex items-center justify-center">
                    <img
                      src={brandLogoPreview || normalizeStorageUrl(form.brand_logo_url)}
                      alt="Preview logo de la empresa"
                      className="h-14 object-contain"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">Marca</label>
                <input name="marca" value={form.marca} onChange={handleChange} placeholder="Ej. Yamaha" className="mt-2 w-full border rounded-xl px-3 py-2 bg-gray-50" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Modelo</label>
                <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ej. MT-09" className="mt-2 w-full border rounded-xl px-3 py-2 bg-gray-50" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Año</label>
                <input name="anio" value={form.anio} onChange={handleChange} placeholder="2026" type="number" className="mt-2 w-full border rounded-xl px-3 py-2 bg-gray-50" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Cilindrada</label>
                <input name="cilindrada_cc" value={form.cilindrada_cc} onChange={handleChange} placeholder="Ej. 890cc" type="number" className="mt-2 w-full border rounded-xl px-3 py-2 bg-gray-50" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Capacidad del tanque (L)</label>
                <input name="capacidad_tanque_l" value={form.capacidad_tanque_l} onChange={handleChange} placeholder="Ej. 12" type="number" step="0.1" className="mt-2 w-full border rounded-xl px-3 py-2 bg-gray-50" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Máxima velocidad (km/h)</label>
                <input name="maxima_velocidad_kmh" value={form.maxima_velocidad_kmh} onChange={handleChange} placeholder="Ej. 180" type="number" className="mt-2 w-full border rounded-xl px-3 py-2 bg-gray-50" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Velocidades</label>
                <input name="velocidades" value={form.velocidades} onChange={handleChange} placeholder="Ej. 6" type="number" className="mt-2 w-full border rounded-xl px-3 py-2 bg-gray-50" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Torque (Nm)</label>
                <input name="torque_max_nm" value={form.torque_max_nm} onChange={handleChange} placeholder="Ej. 80" type="number" step="0.1" className="mt-2 w-full border rounded-xl px-3 py-2 bg-gray-50" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Precio</label>
                <input name="precio" value={form.precio} onChange={handleChange} placeholder="0.00" type="number" step="0.01" className="mt-2 w-full border rounded-xl px-3 py-2 bg-gray-50" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Tipo</label>
                {motoTipos.length > 0 ? (
                  <select
                    value={motoTipoId}
                    onChange={(event) => {
                      setMotoTipoId(event.target.value);
                      setMotoSubcategoriaId("");
                    }}
                    className="mt-2 w-full border rounded-xl px-3 py-2 bg-gray-50"
                  >
                    <option value="">Selecciona un tipo</option>
                    {motoTipos.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.nombre}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    name="categoria"
                    value={form.categoria}
                    onChange={handleChange}
                    placeholder="Ej. Deportiva"
                    className="mt-2 w-full border rounded-xl px-3 py-2 bg-gray-50"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">Subcategoría</label>
                {motoTipos.length > 0 ? (
                  <select
                    value={motoSubcategoriaId}
                    onChange={(event) => setMotoSubcategoriaId(event.target.value)}
                    disabled={!motoTipoId}
                    className="mt-2 w-full border rounded-xl px-3 py-2 bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    <option value="">Selecciona una subcategoría</option>
                    {motoSubcategoriasVisibles.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.nombre}
                      </option>
                    ))}
                  </select>
                ) : null}
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Stock</label>
                <input name="stock" value={form.stock} onChange={handleChange} placeholder="0" type="number" className="mt-2 w-full border rounded-xl px-3 py-2 bg-gray-50" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Estado</label>
                <select name="estado" value={form.estado} onChange={handleChange} className="mt-2 w-full border rounded-xl px-3 py-2 bg-gray-50">
                  <option value="disponible">Disponible</option>
                  <option value="preventa">Preventa</option>
                  <option value="agotado">Agotado</option>
                </select>
              </div>
            </div>

            <div className="bg-[#f5f6f8] rounded-2xl p-4 border border-gray-100 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Video destacado</p>
                  <p className="text-xs text-gray-500">Activa para mostrar un video en la vista de detalle.</p>
                </div>
                <button
                  type="button"
                  onClick={handleVideoToggle}
                  className={`px-4 py-2 rounded-full text-xs font-bold ${form.video_activo ? "bg-yellow-400 text-black" : "bg-gray-200 text-gray-500"
                    }`}
                >
                  {form.video_activo ? "Video activo" : "Sin video"}
                </button>
              </div>
              {form.video_activo && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">URL del video</label>
                    <input
                      name="video_url"
                      value={form.video_url}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="mt-2 w-full border rounded-xl px-3 py-2 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Subir video</label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoFileChange}
                      className="mt-2 w-full text-sm text-gray-600"
                    />
                    {uploadingVideo && <p className="text-xs text-gray-400 mt-1">Subiendo video...</p>}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-[#f5f6f8] rounded-2xl p-4 border border-gray-100 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Galería después de especificaciones</p>
                  <p className="text-xs text-gray-500">
                    Activa para agregar imágenes y texto al slider después de las especificaciones técnicas.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleGaleriaToggle}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition ${form.galeria_activa ? "bg-yellow-400 text-black" : "bg-gray-200 text-gray-500"
                    }`}
                >
                  {form.galeria_activa ? "Galería activa" : "Sin galería"}
                </button>
              </div>

              {form.galeria_activa && <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-4 items-start">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">URL de la imagen</label>
                    <input
                      name="imagen_url"
                      value={galeriaItem.imagen_url}
                      onChange={handleGaleriaItemChange}
                      placeholder="https://..."
                      className="mt-2 w-full border rounded-xl px-3 py-2 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Título (opcional)</label>
                    <input
                      name="titulo"
                      value={galeriaItem.titulo}
                      onChange={handleGaleriaItemChange}
                      placeholder="Ej. Diseño premium"
                      className="mt-2 w-full border rounded-xl px-3 py-2 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Descripción</label>
                    <textarea
                      name="descripcion"
                      value={galeriaItem.descripcion}
                      onChange={handleGaleriaItemChange}
                      placeholder="Describe la imagen..."
                      rows={3}
                      className="mt-2 w-full border rounded-xl px-3 py-2 bg-white resize-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleGaleriaAdd}
                    className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold"
                  >
                    Agregar imagen
                  </button>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Imágenes agregadas</p>
                  {form.galeria_destacada.length === 0 ? (
                    <p className="text-sm text-gray-500">Aún no hay imágenes para el slider.</p>
                  ) : (
                    <div className="space-y-4 max-h-72 overflow-auto pr-1">
                      {form.galeria_destacada.map((item, index) => (
                        <div key={`${item.imagen_url}-${item.titulo || "item"}-${item.descripcion || ""}`} className="bg-white border border-gray-200 rounded-xl p-3 space-y-2">
                          <input
                            value={item.imagen_url}
                            onChange={(event) => handleGaleriaUpdate(index, "imagen_url", event.target.value)}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                            placeholder="URL de imagen"
                          />
                          <input
                            value={item.titulo || ""}
                            onChange={(event) => handleGaleriaUpdate(index, "titulo", event.target.value)}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                            placeholder="Título"
                          />
                          <textarea
                            value={item.descripcion || ""}
                            onChange={(event) => handleGaleriaUpdate(index, "descripcion", event.target.value)}
                            className="w-full border rounded-lg px-3 py-2 text-sm resize-none"
                            rows={2}
                            placeholder="Descripción"
                          />
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400">Elemento {index + 1}</span>
                            <button
                              type="button"
                              onClick={() => handleGaleriaRemove(index)}
                              className="text-xs font-semibold text-red-500"
                            >
                              Quitar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>}
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">Motor</label>
              <textarea
                name="motor_especificacion"
                value={form.motor_especificacion}
                onChange={handleChange}
                placeholder="Ej. Bicilíndrico en línea, 4 tiempos"
                rows={2}
                className="mt-2 w-full border rounded-xl px-3 py-2 bg-gray-50 resize-none"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">Descripción</label>
              <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Detalles adicionales..." rows={4} className="mt-2 w-full border rounded-xl px-3 py-2 bg-gray-50 resize-none" />
            </div>

            <div className="flex items-center justify-end gap-4 pt-2">
              <button type="button" onClick={resetForm} className="text-gray-500 font-semibold">
                Cancelar
              </button>
              <button disabled={saving} className="bg-yellow-400 hover:bg-yellow-500 rounded-xl px-6 py-2.5 font-bold text-black flex items-center gap-2">
                <Plus size={16} /> Guardar Moto
              </button>
            </div>
          </form>
        </div>
      )}

      {repuestoModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleRepuestoSubmit} className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 space-y-6 relative shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-2xl font-black text-yellow-400">{repuestoEditingId ? "Editar Repuesto" : "Nuevo Repuesto"}</h2>
              <button
                type="button"
                onClick={resetRepuestoForm}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <label className="relative border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 flex flex-col items-center justify-center text-center gap-2 py-6 cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={handleRepuestoImageChange} />
              {repuestoImagePreview ? (
                <img src={repuestoImagePreview} alt="Preview" className="h-36 object-contain" />
              ) : (
                <>
                  <UploadCloud className="text-gray-400" size={28} />
                  <p className="text-gray-500 font-medium">Click para subir imagen</p>
                </>
              )}
              {uploading && <span className="text-xs text-gray-400">Subiendo imagen...</span>}
            </label>

            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex-1">
                <label className="text-sm font-semibold text-gray-700">URL de imagen (opcional)</label>
                <div className={`mt-2 flex items-center gap-2 bg-gray-50 border rounded-xl px-3 py-2 ${repuestoImageUrlError ? "border-red-300" : "border-gray-200"}`}>
                  <Link2 size={16} className="text-gray-400" />
                  <input
                    name="imagen_url"
                    value={repuestoForm.imagen_url}
                    onChange={handleRepuestoChange}
                    placeholder="https://..."
                    className="w-full bg-transparent outline-none"
                  />
                </div>
                {repuestoImageUrlError && <p className="text-xs text-red-500 mt-1">{repuestoImageUrlError}</p>}
              </div>
              {(repuestoImageFile || repuestoForm.imagen_url) && (
                <button
                  type="button"
                  onClick={handleClearRepuestoImage}
                  className="text-sm font-semibold text-gray-500 hover:text-gray-700"
                >
                  Limpiar imagen
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">Nombre</label>
                <input name="nombre" value={repuestoForm.nombre} onChange={handleRepuestoChange} placeholder="Ej. Filtro de Aceite" className="mt-2 w-full border rounded-xl px-3 py-2 bg-gray-50" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Categoría principal</label>
                <select
                  value={repuestoTipoId}
                  onChange={(event) => handleRepuestoTipoChange(event.target.value)}
                  className="mt-2 w-full border rounded-xl px-3 py-2 bg-gray-50"
                >
                  <option value="">Selecciona una categoría principal</option>
                  {repuestoTipos.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Subcategoría</label>
                <select
                  value={repuestoSubcategoriaId}
                  onChange={(event) => handleRepuestoSubcategoriaChange(event.target.value)}
                  disabled={!repuestoTipoId}
                  className="mt-2 w-full border rounded-xl px-3 py-2 bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <option value="">Sin subcategoría</option>
                  {repuestoSubcategoriasVisibles.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Subsubcategoría</label>
                <select
                  value={repuestoSubsubcategoriaId}
                  onChange={(event) => handleRepuestoSubsubcategoriaChange(event.target.value)}
                  disabled={!repuestoSubcategoriaId}
                  className="mt-2 w-full border rounded-xl px-3 py-2 bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <option value="">Sin subsubcategoría</option>
                  {repuestoSubsubcategoriasVisibles.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Precio</label>
                <input name="precio" value={repuestoForm.precio} onChange={handleRepuestoChange} placeholder="0.00" type="number" step="0.01" className="mt-2 w-full border rounded-xl px-3 py-2 bg-gray-50" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Estado</label>
                <select name="estado" value={repuestoForm.estado} onChange={handleRepuestoChange} className="mt-2 w-full border rounded-xl px-3 py-2 bg-gray-50">
                  <option value="disponible">Disponible</option>
                  <option value="preventa">Preventa</option>
                  <option value="agotado">Agotado</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Stock</label>
                <input name="stock" value={repuestoForm.stock} onChange={handleRepuestoChange} placeholder="0" type="number" className="mt-2 w-full border rounded-xl px-3 py-2 bg-gray-50" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Unidad de medida</label>
                <input name="unidad_medida" value={repuestoForm.unidad_medida} onChange={handleRepuestoChange} placeholder="Ej. unidad, caja, juego" className="mt-2 w-full border rounded-xl px-3 py-2 bg-gray-50" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Modelo</label>
                <input name="modelo" value={repuestoForm.modelo} onChange={handleRepuestoChange} placeholder="Ej. XR 150 / Pulsar NS 200" className="mt-2 w-full border rounded-xl px-3 py-2 bg-gray-50" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Cantidad por paquete</label>
                <input name="cantidad_por_paquete" value={repuestoForm.cantidad_por_paquete} onChange={handleRepuestoChange} placeholder="Ej. 4" type="number" min="1" className="mt-2 w-full border rounded-xl px-3 py-2 bg-gray-50" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">Logo / imagen de marca (URL)</label>
                <input name="marca_logo_url" value={repuestoForm.marca_logo_url} onChange={handleRepuestoChange} placeholder="https://..." className="mt-2 w-full border rounded-xl px-3 py-2 bg-gray-50" />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">Descripción</label>
              <textarea name="descripcion" value={repuestoForm.descripcion} onChange={handleRepuestoChange} placeholder="Detalles del repuesto..." rows={4} className="mt-2 w-full border rounded-xl px-3 py-2 bg-gray-50 resize-none" />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">Carrusel de imágenes</label>
              <div className="mt-2 flex gap-2">
                <input
                  value={repuestoGaleriaUrlInput}
                  onChange={(event) => setRepuestoGaleriaUrlInput(event.target.value)}
                  placeholder="https://..."
                  className="flex-1 border rounded-xl px-3 py-2 bg-gray-50"
                />
                <button
                  type="button"
                  onClick={handleAddRepuestoGaleriaUrl}
                  disabled={(repuestoForm.galeria_imagenes || []).length >= 5}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold disabled:opacity-50"
                >
                  Agregar URL
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Máximo 5 imágenes. Estas imágenes se mostrarán como carrusel en el detalle público del repuesto.
              </p>

              {(repuestoForm.galeria_imagenes || []).length > 0 && (
                <div className="mt-3 space-y-2">
                  {(repuestoForm.galeria_imagenes || []).map((url, index) => (
                    <div key={`${url}-${index}`} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                      <span className="text-xs font-semibold text-gray-500">{index + 1}.</span>
                      <p className="text-xs text-slate-700 truncate flex-1">{url}</p>
                      <button
                        type="button"
                        onClick={() => handleRemoveRepuestoGaleriaUrl(index)}
                        className="text-xs font-semibold text-red-500"
                      >
                        Quitar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-4 pt-2">
              <button type="button" onClick={resetRepuestoForm} className="text-gray-500 font-semibold">
                Cancelar
              </button>
              <button disabled={saving} className="bg-yellow-400 hover:bg-yellow-500 rounded-xl px-6 py-2.5 font-bold text-black flex items-center gap-2">
                <Plus size={16} /> Guardar Repuesto
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};

export default Inventario;

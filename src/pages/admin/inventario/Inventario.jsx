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
} from "../../../services/Motos.service";
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
  video_url: "",
  video_activo: false,
  video_file: null,
};

const initialRepuestoForm = {
  nombre: "",
  categoria_id: "",
  descripcion: "",
  precio: "",
  stock: "",
  estado: "disponible",
  imagen_url: "",
};

const initialCategoriaForm = {
  nombre: "",
  estado: true,
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

const buildRepuestoCategoryLabel = (categorias, categoriaId, fallback = "Otros") =>
  categorias.find((categoria) => categoria.id === categoriaId)?.nombre || fallback;

const buildMotoCategoryLabel = (categorias, parentId, fallback = "Sin tipo") =>
  categorias.find((categoria) => categoria.id === parentId)?.nombre || fallback;

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
  const [categoriasMotos, setCategoriasMotos] = useState([]);
  const [categoriaMotoForm, setCategoriaMotoForm] = useState(initialCategoriaMotoForm);
  const [categoriaMotoEditingId, setCategoriaMotoEditingId] = useState(null);
  const [isCreatingMotoType, setIsCreatingMotoType] = useState(false);

  const fetchMotos = async () => {
    setLoading(true);
    try {
      const data = await getMotos();
      setMotos(data);
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
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo cargar las categorías de repuestos", "error");
    }
  };

  const fetchCategoriasMotos = async () => {
    try {
      const data = await getCategoriasMotos();
      setCategoriasMotos(data);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo cargar las categorías de motos", "error");
    }
  };

  useEffect(() => {
    fetchMotos();
    fetchRepuestos();
    fetchCategoriasRepuestos();
    fetchCategoriasMotos();
  }, []);

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

  const repuestoCategorias = useMemo(() => ["all", ...categoriasRepuestos.map((cat) => cat.id)], [categoriasRepuestos]);

  const repuestosFiltrados = useMemo(() => {
    if (repuestoFiltroCategoria === "all") return repuestos;
    return repuestos.filter((r) => r.categoria_id === repuestoFiltroCategoria);
  }, [repuestos, repuestoFiltroCategoria]);

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

  const handleCategoriaMotoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCategoriaMotoForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const resetCategoriaForm = () => {
    setCategoriaForm(initialCategoriaForm);
    setCategoriaEditingId(null);
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
  };

  const resetRepuestoForm = () => {
    setRepuestoForm(initialRepuestoForm);
    setRepuestoEditingId(null);
    setRepuestoModalOpen(false);
    setRepuestoImageFile(null);
    setRepuestoImagePreview("");
    setRepuestoImageUrlError("");
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
  };

  const handleOpenRepuestoModal = () => {
    setRepuestoEditingId(null);
    setRepuestoForm({
      ...initialRepuestoForm,
      categoria_id: categoriasRepuestos[0]?.id || "",
    });
    setRepuestoModalOpen(true);
    setRepuestoImageFile(null);
    setRepuestoImagePreview("");
    setRepuestoImageUrlError("");
  };

  const handleCategoriaEdit = (categoria) => {
    setCategoriaEditingId(categoria.id);
    setCategoriaForm({
      nombre: categoria.nombre || "",
      estado: categoria.estado ?? true,
    });
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
      video_url: moto.video_url || "",
      video_activo: Boolean(moto.video_url),
    });
    setMotoTipoId(tipoId || "");
    setMotoSubcategoriaId(categoriaMatch?.parent_id ? categoriaMatch.id : "");
    setImagePreview(moto.imagen_url || "");
    setImageFile(null);
    setImageUrlError("");
    setModalOpen(true);
  };

  const handleRepuestoEdit = (repuesto) => {
    const categoriaId =
      repuesto.categoria_id ||
      categoriasRepuestos.find((categoria) => categoria.nombre === repuesto.categoria)?.id ||
      "";
    setRepuestoEditingId(repuesto.id);
    setRepuestoForm({
      nombre: repuesto.nombre || "",
      categoria_id: categoriaId,
      descripcion: repuesto.descripcion || "",
      precio: String(repuesto.precio ?? ""),
      stock: String(repuesto.stock ?? ""),
      estado: repuesto.estado || "disponible",
      imagen_url: repuesto.imagen_url || "",
    });
    setRepuestoImagePreview(repuesto.imagen_url || "");
    setRepuestoImageFile(null);
    setRepuestoImageUrlError("");
    setRepuestoModalOpen(true);
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

  const handleClearRepuestoImage = () => {
    setRepuestoImageFile(null);
    setRepuestoImagePreview("");
    setRepuestoImageUrlError("");
    setRepuestoForm((prev) => ({ ...prev, imagen_url: "" }));
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

    if (form.video_activo && !form.video_url.trim() && !form.video_file) {
      Swal.fire("Validación", "Agrega una URL de video o sube un archivo", "warning");
      return;
    }

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
      precio: Number(form.precio),
      stock: Number(form.stock),
      estado: form.estado,
      imagen_url: form.imagen_url.trim() || null,
      video_url: form.video_activo ? form.video_url.trim() || null : null,
    };

    if (Number.isNaN(payload.precio) || Number.isNaN(payload.stock)) {
      Swal.fire("Validación", "Precio y stock deben ser números válidos", "warning");
      return;
    }

    setSaving(true);
    try {
      if (imageFile) {
        setUploading(true);
        const publicUrl = await uploadMotoImage(imageFile);
        payload.imagen_url = publicUrl;
      }

      if (form.video_activo && form.video_file) {
        setUploadingVideo(true);
        const publicUrl = await uploadMotoVideo(form.video_file);
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
      Swal.fire("Error", "No se pudo guardar el modelo", "error");
    } finally {
      setSaving(false);
      setUploading(false);
      setUploadingVideo(false);
    }
  };

  const handleRepuestoSubmit = async (e) => {
    e.preventDefault();

    if (!repuestoForm.nombre.trim() || !repuestoForm.categoria_id) {
      Swal.fire("Validación", "Nombre y categoría son obligatorios", "warning");
      return;
    }

    if (!repuestoImageFile && repuestoImageUrlError) {
      Swal.fire("Validación", "Ingresa una URL válida o sube una imagen local", "warning");
      return;
    }

    const selectedCategoria = categoriasRepuestos.find((categoria) => categoria.id === repuestoForm.categoria_id);
    const payload = {
      nombre: repuestoForm.nombre.trim(),
      categoria: selectedCategoria?.nombre || "",
      categoria_id: repuestoForm.categoria_id,
      descripcion: repuestoForm.descripcion.trim() || null,
      precio: Number(repuestoForm.precio),
      stock: Number(repuestoForm.stock),
      estado: repuestoForm.estado,
      imagen_url: repuestoForm.imagen_url.trim() || null,
    };

    if (Number.isNaN(payload.precio) || Number.isNaN(payload.stock)) {
      Swal.fire("Validación", "Precio y stock deben ser números válidos", "warning");
      return;
    }

    setSaving(true);
    try {
      if (repuestoImageFile) {
        setUploading(true);
        const publicUrl = await uploadRepuestoImage(repuestoImageFile);
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
      Swal.fire("Error", "No se pudo eliminar el modelo", "error");
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

    setSaving(true);
    try {
      if (categoriaEditingId) {
        const updated = await updateCategoriaRepuesto(categoriaEditingId, categoriaForm);
        setCategoriasRepuestos((prev) => prev.map((cat) => (cat.id === categoriaEditingId ? updated : cat)));
        Swal.fire("Actualizado", "Categoría actualizada correctamente", "success");
      } else {
        const created = await addCategoriaRepuesto(categoriaForm);
        setCategoriasRepuestos((prev) => [...prev, created].sort((a, b) => a.nombre.localeCompare(b.nombre)));
        Swal.fire("Creado", "Categoría creada correctamente", "success");
      }
      resetCategoriaForm();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo guardar la categoría", "error");
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
        Swal.fire("Creado", "Categoría creada correctamente", "success");
      }
      resetCategoriaMotoForm();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo guardar la categoría", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategoriaMoto = async (id) => {
    const childCategorias = categoriasMotos.filter((categoria) => categoria.parent_id === id);
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

  const handleDeleteCategoria = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar categoría?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteCategoriaRepuesto(id);
      setCategoriasRepuestos((prev) => prev.filter((cat) => cat.id !== id));
      if (repuestoForm.categoria_id === id) {
        setRepuestoForm((prev) => ({ ...prev, categoria_id: categoriasRepuestos[0]?.id || "" }));
      }
      if (categoriaEditingId === id) resetCategoriaForm();
      Swal.fire("Eliminado", "Categoría eliminada", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo eliminar la categoría", "error");
    }
  };

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

  const MotoRow = ({ moto }) => (
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
      <p className="text-green-600 text-lg font-bold">${Number(moto.precio || 0).toLocaleString()}</p>
      <span className={`inline-flex w-fit px-3 py-1 rounded-full font-bold text-[11px] uppercase ${estadoClass[(moto.estado || "disponible").toLowerCase()] || "bg-gray-100 text-gray-600"}`}>
        {(moto.estado || "disponible").toUpperCase()}
      </span>
      <div className="flex justify-end gap-3">
        <button onClick={() => handleEdit(moto)} className="p-2 rounded-lg border border-blue-200 text-blue-600">
          <Pencil size={16} />
        </button>
        <button onClick={() => handleDelete(moto.id)} className="p-2 rounded-lg border border-red-200 text-red-500">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );

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
      <p className="text-green-600 text-lg font-bold">${Number(repuesto.precio || 0).toLocaleString()}</p>
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
              className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 ${
                active ? "bg-yellow-400 text-black" : "bg-gray-100 text-gray-600"
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
                <button
                  key={cat}
                  onClick={() => (activeTab === "motos" ? setFiltroCategoria(cat) : setRepuestoFiltroCategoria(cat))}
                  className={`group relative px-4 py-2 rounded-full text-xs font-bold inline-flex items-center gap-2 ${
                    active ? "bg-yellow-400 text-black" : "bg-gray-100 text-gray-600"
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
                </button>
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
                      className={`px-3 py-1.5 rounded-full ${
                        !isCreatingMotoType ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      Subcategoría
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCreatingMotoType(true)}
                      className={`px-3 py-1.5 rounded-full ${
                        isCreatingMotoType ? "bg-yellow-400 text-black" : "bg-gray-100 text-gray-500"
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
                  <MotoRow key={moto.id} moto={moto} />
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
                    placeholder="Ej. Frenos"
                    className="mt-2 w-full border rounded-xl px-3 py-2 bg-white"
                  />
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
                    categoriasRepuestos.map((categoria) => (
                      <div key={categoria.id} className="flex items-center justify-between gap-3 bg-gray-50 rounded-xl px-4 py-3">
                        <div>
                          <p className="text-sm font-bold text-slate-800">{categoria.nombre}</p>
                          <p className="text-xs text-gray-400">ID: {categoria.id}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${categoria.estado ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}>
                            {categoria.estado ? "Activa" : "Inactiva"}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCategoriaEdit(categoria)}
                            className="p-2 rounded-lg border border-blue-200 text-blue-600"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategoria(categoria.id)}
                            className="p-2 rounded-lg border border-red-200 text-red-500"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))
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
                  className={`px-4 py-2 rounded-full text-xs font-bold ${
                    form.video_activo ? "bg-yellow-400 text-black" : "bg-gray-200 text-gray-500"
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
                <label className="text-sm font-semibold text-gray-700">Categoría</label>
                <select
                  name="categoria_id"
                  value={repuestoForm.categoria_id}
                  onChange={handleRepuestoChange}
                  className="mt-2 w-full border rounded-xl px-3 py-2 bg-gray-50"
                >
                  {categoriasRepuestos.map((category) => (
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">Stock</label>
                <input name="stock" value={repuestoForm.stock} onChange={handleRepuestoChange} placeholder="0" type="number" className="mt-2 w-full border rounded-xl px-3 py-2 bg-gray-50" />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">Descripción</label>
              <textarea name="descripcion" value={repuestoForm.descripcion} onChange={handleRepuestoChange} placeholder="Detalles del repuesto..." rows={4} className="mt-2 w-full border rounded-xl px-3 py-2 bg-gray-50 resize-none" />
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

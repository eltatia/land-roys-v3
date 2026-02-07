import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { Pencil, Trash2, Plus, PackageSearch, Bike, Wrench, X, UploadCloud, Link2 } from "lucide-react";
import { addMoto, deleteMoto, getMotos, updateMoto, uploadMotoImage } from "../../../services/Motos.service";

const initialForm = {
  nombre: "",
  marca: "",
  modelo_codigo: "",
  descripcion: "",
  categoria: "",
  anio: "",
  cilindrada_cc: "",
  precio: "",
  stock: "",
  estado: "disponible",
  imagen_url: "",
};

const tabs = [
  { key: "motos", label: "Motos", icon: Bike },
  { key: "repuestos", label: "Repuestos", icon: Wrench },
];

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filtroCategoria, setFiltroCategoria] = useState("all");
  const [form, setForm] = useState(initialForm);
  const [modalOpen, setModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageUrlError, setImageUrlError] = useState("");

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

  useEffect(() => {
    fetchMotos();
  }, []);

  const categorias = useMemo(() => {
    const unique = [...new Set(motos.map((m) => m.categoria).filter(Boolean))];
    return ["all", ...unique];
  }, [motos]);

  const motosFiltradas = useMemo(() => {
    if (filtroCategoria === "all") return motos;
    return motos.filter((m) => (m.categoria || "").toLowerCase() === filtroCategoria.toLowerCase());
  }, [motos, filtroCategoria]);

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

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setModalOpen(false);
    setImageFile(null);
    setImagePreview("");
    setImageUrlError("");
  };

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setForm(initialForm);
    setModalOpen(true);
    setImageFile(null);
    setImagePreview("");
    setImageUrlError("");
  };

  const handleEdit = (moto) => {
    setEditingId(moto.id);
    setForm({
      nombre: moto.nombre || "",
      marca: moto.marca || "",
      modelo_codigo: moto.modelo_codigo || "",
      descripcion: moto.descripcion || "",
      categoria: moto.categoria || "",
      anio: String(moto.anio ?? ""),
      cilindrada_cc: String(moto.cilindrada_cc ?? ""),
      precio: String(moto.precio ?? ""),
      stock: String(moto.stock ?? ""),
      estado: moto.estado || "disponible",
      imagen_url: moto.imagen_url || "",
    });
    setImagePreview(moto.imagen_url || "");
    setImageFile(null);
    setImageUrlError("");
    setModalOpen(true);
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setImageUrlError("");
  };

  const handleClearImage = () => {
    setImageFile(null);
    setImagePreview("");
    setImageUrlError("");
    setForm((prev) => ({ ...prev, imagen_url: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre.trim() || !form.categoria.trim()) {
      Swal.fire("Validación", "Nombre y categoría son obligatorios", "warning");
      return;
    }

    if (!imageFile && imageUrlError) {
      Swal.fire("Validación", "Ingresa una URL válida o sube una imagen local", "warning");
      return;
    }

    const payload = {
      nombre: form.nombre.trim(),
      marca: form.marca.trim() || null,
      modelo_codigo: form.modelo_codigo.trim() || null,
      descripcion: form.descripcion.trim() || null,
      categoria: form.categoria.trim(),
      anio: form.anio ? Number(form.anio) : null,
      cilindrada_cc: form.cilindrada_cc ? Number(form.cilindrada_cc) : null,
      precio: Number(form.precio),
      stock: Number(form.stock),
      estado: form.estado,
      imagen_url: form.imagen_url.trim() || null,
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
            {categorias.map((cat) => {
              const active = filtroCategoria === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFiltroCategoria(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold ${
                    active ? "bg-yellow-400 text-black" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {cat === "all" ? "Todas" : cat}
                </button>
              );
            })}
          </div>

          {activeTab === "motos" && (
            <button
              onClick={handleOpenCreateModal}
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2"
            >
              <Plus size={16} /> Nuevo
            </button>
          )}
        </div>

        <TableHeader />

        {activeTab === "repuestos" ? (
          <div className="border-x border-b border-gray-100 rounded-b-2xl bg-white text-gray-500 text-center py-16">
            Módulo de repuestos en construcción.
          </div>
        ) : loading ? (
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
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white w-full max-w-3xl rounded-2xl p-6 space-y-6 relative shadow-2xl">
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
                <label className="text-sm font-semibold text-gray-700">Precio</label>
                <input name="precio" value={form.precio} onChange={handleChange} placeholder="0.00" type="number" step="0.01" className="mt-2 w-full border rounded-xl px-3 py-2 bg-gray-50" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Categoría</label>
                <input name="categoria" value={form.categoria} onChange={handleChange} placeholder="Ej. Deportiva" className="mt-2 w-full border rounded-xl px-3 py-2 bg-gray-50" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    </section>
  );
};

export default Inventario;

import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { Pencil, Trash2, Plus, PackageSearch } from "lucide-react";
import { addMoto, deleteMoto, getMotos, updateMoto } from "../../../services/Motos.service";

const initialForm = {
  nombre: "",
  descripcion: "",
  categoria: "",
  precio: "",
  stock: "",
  imagen_url: "",
};

const Inventario = () => {
  const [motos, setMotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filtroCategoria, setFiltroCategoria] = useState("all");
  const [form, setForm] = useState(initialForm);

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
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleEdit = (moto) => {
    setEditingId(moto.id);
    setForm({
      nombre: moto.nombre || "",
      descripcion: moto.descripcion || "",
      categoria: moto.categoria || "",
      precio: String(moto.precio ?? ""),
      stock: String(moto.stock ?? ""),
      imagen_url: moto.imagen_url || "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre.trim() || !form.categoria.trim()) {
      Swal.fire("Validación", "Nombre y categoría son obligatorios", "warning");
      return;
    }

    const payload = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim() || null,
      categoria: form.categoria.trim(),
      precio: Number(form.precio),
      stock: Number(form.stock),
      imagen_url: form.imagen_url.trim() || null,
    };

    if (Number.isNaN(payload.precio) || Number.isNaN(payload.stock)) {
      Swal.fire("Validación", "Precio y stock deben ser números válidos", "warning");
      return;
    }

    setSaving(true);
    try {
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

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Inventario de Modelos</h1>
          <p className="text-sm text-gray-500">Gestiona modelos de motos, trimóviles y nuevas categorías.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="lg:col-span-1 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
          <h2 className="font-bold text-slate-800">{editingId ? "Editar modelo" : "Nuevo modelo"}</h2>

          <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="w-full border rounded-xl px-3 py-2" />
          <input name="categoria" value={form.categoria} onChange={handleChange} placeholder="Categoría (Ej. Deportiva, Trimóvil)" className="w-full border rounded-xl px-3 py-2" />
          <input name="precio" value={form.precio} onChange={handleChange} placeholder="Precio" type="number" step="0.01" className="w-full border rounded-xl px-3 py-2" />
          <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" type="number" className="w-full border rounded-xl px-3 py-2" />
          <input name="imagen_url" value={form.imagen_url} onChange={handleChange} placeholder="URL imagen" className="w-full border rounded-xl px-3 py-2" />
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" rows={3} className="w-full border rounded-xl px-3 py-2 resize-none" />

          <div className="flex gap-2">
            <button disabled={saving} className="flex-1 bg-yellow-400 hover:bg-yellow-500 rounded-xl py-2.5 font-bold text-black flex items-center justify-center gap-2">
              <Plus size={16} /> {editingId ? "Guardar cambios" : "Agregar modelo"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="px-4 rounded-xl border border-gray-300 text-gray-600 font-semibold">
                Cancelar
              </button>
            )}
          </div>
        </form>

        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-wrap gap-2 mb-5">
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

          {loading ? (
            <p className="text-gray-500">Cargando inventario...</p>
          ) : motosFiltradas.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <PackageSearch className="mx-auto mb-2" />
              No hay modelos en esta categoría
            </div>
          ) : (
            <div className="space-y-3">
              {motosFiltradas.map((moto) => (
                <div key={moto.id} className="border border-gray-100 rounded-xl p-3 flex flex-wrap items-center gap-3">
                  <img
                    src={moto.imagen_url || "https://images.unsplash.com/photo-1511994298241-608e28f14fde?q=80&w=600&auto=format&fit=crop"}
                    alt={moto.nombre}
                    className="w-20 h-14 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-[180px]">
                    <p className="font-bold text-slate-800">{moto.nombre}</p>
                    <p className="text-xs text-gray-500">{moto.categoria} · Stock: {moto.stock}</p>
                  </div>
                  <p className="font-black text-lg">${Number(moto.precio || 0).toLocaleString()}</p>
                  <button onClick={() => handleEdit(moto)} className="p-2 rounded-lg border border-gray-200 text-blue-600">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(moto.id)} className="p-2 rounded-lg border border-gray-200 text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Inventario;

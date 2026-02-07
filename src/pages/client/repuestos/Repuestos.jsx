import React, { useEffect, useMemo, useState } from "react";
import { Search, ShoppingCart, ChevronDown } from "lucide-react";
import Swal from "sweetalert2";
import { getRepuestos } from "../../../services/Repuestos.service";

const currency = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const defaultCategories = [
  { key: "motores", label: "Motores" },
  { key: "carenados", label: "Carenados" },
  { key: "sistema electrico", label: "Sistema eléctrico" },
  { key: "transmision", label: "Transmisión" },
];

const normalizeCategoryKey = (value = "") => value.trim().toLowerCase();

const Repuestos = () => {
  const [repuestos, setRepuestos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("recientes");

  useEffect(() => {
    const fetchRepuestos = async () => {
      setLoading(true);
      try {
        const data = await getRepuestos();
        setRepuestos(data);
      } catch (error) {
        console.error("Error cargando repuestos:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los repuestos",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRepuestos();
  }, []);

  const categories = useMemo(() => {
    const fromData = [...new Set(repuestos.map((item) => item.categoria).filter(Boolean))].map((value) => ({
      key: normalizeCategoryKey(value),
      label: value,
    }));

    const combined = [
      { key: "all", label: "Todos" },
      ...defaultCategories,
      ...fromData.filter((cat) => !defaultCategories.some((base) => base.key === cat.key)),
    ];

    return combined;
  }, [repuestos]);

  const countsByCategory = useMemo(() => {
    const counts = repuestos.reduce((acc, item) => {
      const key = normalizeCategoryKey(item.categoria || "otros");
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    counts.all = repuestos.length;
    return counts;
  }, [repuestos]);

  const filteredRepuestos = useMemo(() => {
    const term = search.trim().toLowerCase();
    let data = [...repuestos];

    if (activeCategory !== "all") {
      data = data.filter((item) => normalizeCategoryKey(item.categoria) === activeCategory);
    }

    if (term) {
      data = data.filter((item) =>
        [item.nombre, item.descripcion, item.categoria]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(term))
      );
    }

    if (sortOrder === "precio_asc") {
      data.sort((a, b) => Number(a.precio || 0) - Number(b.precio || 0));
    } else if (sortOrder === "precio_desc") {
      data.sort((a, b) => Number(b.precio || 0) - Number(a.precio || 0));
    }

    return data;
  }, [repuestos, activeCategory, search, sortOrder]);

  return (
    <section className="bg-[#f5f6f9] min-h-screen">
      <div className="bg-[#0f172a] text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-yellow-400">Catálogo de Repuestos Originales</h1>
          <p className="text-slate-200 mt-4">Encuentra lo que necesitas para tu moto con repuestos de calidad.</p>
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-full px-5 py-3 w-full max-w-2xl">
              <Search size={18} className="text-slate-200" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por nombre, categoría o detalle..."
                className="bg-transparent w-full outline-none text-sm text-white placeholder:text-slate-300"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        <aside className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-bold text-slate-700 mb-4">Categorías</h2>
            <div className="space-y-3">
              {categories.map((category) => {
                const isActive = activeCategory === category.key;
                const count = countsByCategory[category.key] || 0;
                return (
                  <button
                    key={category.key}
                    onClick={() => setActiveCategory(category.key)}
                    className={`w-full flex items-center justify-between px-4 py-2 rounded-xl text-sm font-semibold transition ${
                      isActive ? "bg-yellow-400 text-black" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <span>{category.label}</span>
                    <span className="bg-white/70 text-xs px-2 py-0.5 rounded-full text-gray-500">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-yellow-50 rounded-2xl border border-yellow-100 p-5 space-y-3">
            <h3 className="text-lg font-bold text-slate-700">¿No encuentras tu repuesto?</h3>
            <p className="text-sm text-slate-600">
              Contáctanos directamente y te ayudaremos a conseguirlo.
            </p>
            <button className="w-full bg-yellow-400 text-black font-bold py-2 rounded-full shadow-sm">
              Contactar Asesor
            </button>
          </div>
        </aside>

        <main className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-black text-slate-800">Destacados</h2>
            <div className="relative">
              <select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-10 text-sm font-semibold text-slate-600"
              >
                <option value="recientes">Más recientes</option>
                <option value="precio_asc">Precio: menor a mayor</option>
                <option value="precio_desc">Precio: mayor a menor</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-500">
              Cargando repuestos...
            </div>
          ) : filteredRepuestos.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-500">
              No hay repuestos para mostrar.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredRepuestos.map((item) => (
                <article key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="relative">
                    <img
                      src={item.imagen_url || "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=1200&auto=format&fit=crop"}
                      alt={item.nombre}
                      className="w-full h-48 object-cover"
                    />
                    <button className="absolute right-4 bottom-4 bg-white p-2 rounded-full shadow-sm">
                      <ShoppingCart size={18} className="text-slate-700" />
                    </button>
                  </div>
                  <div className="p-5 space-y-2">
                    <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
                      {item.categoria || "Sin categoría"}
                    </span>
                    <h3 className="text-lg font-bold text-slate-800">{item.nombre}</h3>
                    {item.descripcion && <p className="text-sm text-gray-500">{item.descripcion}</p>}
                    <div className="flex items-center justify-between pt-2">
                      <p className="text-lg font-black text-slate-900">{currency.format(Number(item.precio || 0))}</p>
                      <button className="text-xs font-bold text-yellow-500">Ver ficha</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>
    </section>
  );
};

export default Repuestos;

import React, { useEffect, useMemo, useState } from "react";
import { Filter, Gauge, Boxes, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { getMotos } from "../../../services/motos.service";
import { getCategoriasMotos } from "../../../services/CategoriasMotos.service";
import { resolveFichaTecnicaUrl } from "../../../util/fichaTecnica";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const stateColors = {
  disponible: "bg-green-100 text-green-700",
  agotado: "bg-red-100 text-red-600",
  preventa: "bg-blue-100 text-blue-700",
};

const Modelos = () => {
  const [motos, setMotos] = useState([]);
  const [categoriasMotos, setCategoriasMotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tipoActivo, setTipoActivo] = useState("all");
  const [subcategoriaActiva, setSubcategoriaActiva] = useState("all");

  useEffect(() => {
    const fetchMotos = async () => {
      setLoading(true);
      try {
        const [motosData, categoriasData] = await Promise.all([getMotos(), getCategoriasMotos()]);
        setMotos(motosData);
        setCategoriasMotos(categoriasData);
      } catch (error) {
        console.error("Error cargando modelos:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los modelos de motos",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMotos();
  }, []);

  const tipos = useMemo(
    () => categoriasMotos.filter((categoria) => categoria.estado !== false && !categoria.parent_id),
    [categoriasMotos]
  );

  const subcategorias = useMemo(
    () => categoriasMotos.filter((categoria) => categoria.estado !== false && categoria.parent_id),
    [categoriasMotos]
  );

  const tiposDisponibles = useMemo(() => {
    if (tipos.length > 0) {
      return [
        { id: "all", nombre: "Todas" },
        ...tipos.map((tipo) => ({ id: tipo.id, nombre: tipo.nombre })),
      ];
    }

    const unique = [...new Set(motos.map((m) => m.categoria).filter(Boolean))];
    return [{ id: "all", nombre: "Todas" }, ...unique.map((nombre) => ({ id: nombre, nombre }))];
  }, [tipos, motos]);

  const subcategoriasPorTipo = useMemo(() => {
    return subcategorias.reduce((acc, categoria) => {
      const key = categoria.parent_id;
      if (!acc[key]) acc[key] = [];
      acc[key].push(categoria);
      return acc;
    }, {});
  }, [subcategorias]);

  const subcategoriasVisibles = useMemo(() => {
    if (tipoActivo === "all") return [];

    if (tipos.length === 0) return [];
    return subcategoriasPorTipo[tipoActivo] || [];
  }, [tipoActivo, tipos.length, subcategoriasPorTipo]);

  const motosFiltradas = useMemo(() => {
    if (tipoActivo === "all" && subcategoriaActiva === "all") return motos;

    if (subcategoriaActiva !== "all") {
      return motos.filter((m) => String(m.categoria_id || "") === String(subcategoriaActiva));
    }

    if (tipoActivo !== "all") {
      const children = subcategoriasPorTipo[tipoActivo] || [];
      if (children.length > 0) {
        const childIds = new Set(children.map((child) => String(child.id)));
        return motos.filter((m) => childIds.has(String(m.categoria_id || "")));
      }

      return motos.filter((m) => String(m.categoria_id || "") === String(tipoActivo));
    }

    return motos;
  }, [motos, tipoActivo, subcategoriaActiva, subcategoriasPorTipo]);

  useEffect(() => {
    setSubcategoriaActiva("all");
  }, [tipoActivo]);

  return (
    <section className="bg-[#f7f8fa] pb-16">
      <div
        className="relative h-[360px] bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,.75), rgba(0,0,0,.45)), url('https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1600&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-5xl md:text-6xl font-black text-yellow-400">Nuestros Modelos</h1>
            <p className="text-white text-2xl mt-2">Innovación y potencia en cada viaje</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-[0_24px_60px_rgba(15,23,42,0.12)] overflow-hidden">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-6 py-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-yellow-300">Explora por tipo</p>
                <h2 className="text-2xl md:text-3xl font-black">Encuentra tu moto ideal en segundos</h2>
                <p className="text-sm text-slate-300 mt-1">Selecciona un tipo y navega por sus subcategorías.</p>
              </div>
              <div className="flex items-center gap-2 text-yellow-300 text-sm font-semibold">
                <Filter size={18} /> Filtros activos
              </div>
            </div>
          </div>
          <div className="px-6 py-5 space-y-4 bg-white">
            <div className="flex flex-wrap gap-3">
              {tiposDisponibles.map((tipo) => {
                const active = String(tipoActivo) === String(tipo.id);
                return (
                  <button
                    key={tipo.id}
                    onClick={() => setTipoActivo(tipo.id)}
                    className={`px-6 py-2.5 rounded-full text-sm font-extrabold tracking-wide transition ${
                      active
                        ? "bg-yellow-400 text-black shadow-[0_10px_20px_rgba(250,204,21,0.35)]"
                        : "bg-[#f4f6f9] text-[#51617d] hover:bg-gray-200"
                    }`}
                  >
                    {tipo.nombre}
                  </button>
                );
              })}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {tipoActivo === "all" ? (
                <span className="text-sm text-gray-500">
                  Selecciona un tipo para ver subcategorías disponibles.
                </span>
              ) : subcategoriasVisibles.length === 0 ? (
                <span className="text-sm text-gray-500">
                  Este tipo no tiene subcategorías registradas.
                </span>
              ) : (
                <>
                  <button
                    onClick={() => setSubcategoriaActiva("all")}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      subcategoriaActiva === "all"
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Todas
                  </button>
                  {subcategoriasVisibles.map((categoria) => (
                    <button
                      key={categoria.id}
                      onClick={() => setSubcategoriaActiva(categoria.id)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        String(subcategoriaActiva) === String(categoria.id)
                          ? "bg-yellow-400 text-black"
                          : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                      }`}
                    >
                      {categoria.nombre}
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-10">
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loading && motosFiltradas.length === 0 && (
            <div className="col-span-full bg-white rounded-xl p-8 text-center text-gray-500 font-medium">
              No hay modelos disponibles para esta categoría.
            </div>
          )}

          {motosFiltradas.map((moto) => (
            <article key={moto.id} className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100">
              <div className="relative group">
                <img
                  src={moto.imagen_url || "https://images.unsplash.com/photo-1511994298241-608e28f14fde?q=80&w=1200&auto=format&fit=crop"}
                  alt={moto.nombre}
                  className="w-full h-60 object-cover transition-opacity duration-300 group-hover:opacity-55"
                />
                <span className="absolute top-3 right-3 bg-[#111] text-yellow-400 text-xs font-black px-3 py-1 rounded-full uppercase">
                  {moto.categoria || "Sin categoría"}
                </span>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link
                    to={`/modelos/${moto.id}`}
                    className="bg-black/85 text-white font-extrabold px-5 py-2.5 rounded-full border border-yellow-400"
                  >
                    Ver detalles
                  </Link>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-[#6783b0] leading-tight">{moto.nombre}</h3>
                    {moto.marca && <p className="text-xs text-gray-400">{moto.marca}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-black whitespace-nowrap">
                      {currency.format(Number(moto.precio || 0))}
                    </p>
                    {resolveFichaTecnicaUrl(moto) && (
                      <a
                        href={resolveFichaTecnicaUrl(moto)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ficha-tecnica-btn text-xs"
                      >
                        Ver ficha técnica (PDF)
                      </a>
                    )}
                  </div>
                </div>

                {moto.descripcion && <p className="text-xs text-gray-500">{moto.descripcion}</p>}

                <div className="grid grid-cols-4 gap-2 pt-2 text-[10px] text-gray-500 uppercase font-semibold border-t border-gray-100">
                  <div className="flex flex-col items-center gap-1 py-2">
                    <Gauge size={14} />
                    <span>{moto.categoria || "n/a"}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 py-2">
                    <Boxes size={14} />
                    <span>{moto.stock} Stock</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 py-2">
                    <DollarSign size={14} />
                    <span>{currency.format(Number(moto.precio || 0))}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 py-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] ${stateColors[(moto.estado || "disponible").toLowerCase()] || "bg-gray-100 text-gray-600"}`}
                    >
                      {(moto.estado || "disponible").toUpperCase()}
                    </span>
                    <span>{moto.anio || "-"} / {moto.cilindrada_cc || "-"}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Modelos;

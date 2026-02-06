import React, { useEffect, useMemo, useState } from "react";
import { Filter, Gauge, Boxes, DollarSign } from "lucide-react";
import Swal from "sweetalert2";
import { getMotos } from "../../../services/Motos.service";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const Modelos = () => {
  const [motos, setMotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriaActiva, setCategoriaActiva] = useState("all");

  useEffect(() => {
    const fetchMotos = async () => {
      setLoading(true);
      try {
        const data = await getMotos();
        setMotos(data);
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

  const categorias = useMemo(() => {
    const unique = [...new Set(motos.map((m) => m.categoria).filter(Boolean))];
    return ["all", ...unique];
  }, [motos]);

  const motosFiltradas = useMemo(() => {
    if (categoriaActiva === "all") return motos;
    return motos.filter((m) => (m.categoria || "").toLowerCase() === categoriaActiva.toLowerCase());
  }, [motos, categoriaActiva]);

  return (
    <section className="bg-[#f7f8fa] pb-16">
      <div
        className="relative h-[310px] bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,.75), rgba(0,0,0,.45)), url('https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1600&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-yellow-400">Nuestros Modelos</h1>
            <p className="text-white text-xl mt-2">Innovación y potencia en cada viaje</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="-mt-8 bg-white shadow-xl rounded-2xl p-4 md:p-5 flex flex-wrap items-center gap-3 md:gap-4">
          <div className="flex items-center gap-2 text-gray-500 font-bold text-sm uppercase tracking-wider mr-2">
            <Filter size={16} /> Filtrar por:
          </div>

          {categorias.map((cat) => {
            const active = categoriaActiva === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategoriaActiva(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition ${
                  active ? "bg-yellow-400 text-black" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat === "all" ? "All" : cat}
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loading && motosFiltradas.length === 0 && (
            <div className="col-span-full bg-white rounded-xl p-8 text-center text-gray-500 font-medium">
              No hay modelos disponibles para esta categoría.
            </div>
          )}

          {motosFiltradas.map((moto) => (
            <article key={moto.id} className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100">
              <div className="relative">
                <img
                  src={moto.imagen_url || "https://images.unsplash.com/photo-1511994298241-608e28f14fde?q=80&w=1200&auto=format&fit=crop"}
                  alt={moto.nombre}
                  className="w-full h-60 object-cover"
                />
                <span className="absolute top-3 right-3 bg-[#111] text-yellow-400 text-xs font-black px-3 py-1 rounded-full uppercase">
                  {moto.categoria || "Sin categoría"}
                </span>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex justify-between items-start gap-3">
                  <h3 className="text-3xl md:text-[2rem] font-bold text-[#6783b0] leading-tight">{moto.nombre}</h3>
                  <p className="text-3xl md:text-[2rem] font-black text-black whitespace-nowrap">
                    {currency.format(Number(moto.precio || 0))}
                  </p>
                </div>

                {moto.descripcion && <p className="text-sm text-gray-500">{moto.descripcion}</p>}

                <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-gray-500 uppercase font-bold border-t border-gray-100">
                  <div className="flex flex-col items-center gap-1 py-2">
                    <Gauge size={15} />
                    <span>{moto.categoria || "n/a"}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 py-2">
                    <Boxes size={15} />
                    <span>{moto.stock} Stock</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 py-2">
                    <DollarSign size={15} />
                    <span>{currency.format(Number(moto.precio || 0))}</span>
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

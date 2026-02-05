import React from "react";
import {
  Search,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const MotosTable = ({ motos = [], loading = false }) => {
  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
      {/* Filtros */}
      <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-yellow-400/20"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50/50 ">
            <tr>
              {["Imagen", "Modelo", "Año", "Estado", "Precio", "Acciones"].map(h => (
                <th key={h} className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {loading && (
              <tr>
                <td colSpan={6} className="px-8 py-8 text-center text-sm text-slate-400">
                  Cargando motos...
                </td>
              </tr>
            )}
            {!loading && motos.length === 0 && (
              <tr>
                <td colSpan={6} className="px-8 py-8 text-center text-sm text-slate-400">
                  No hay motos registradas.
                </td>
              </tr>
            )}
            {!loading && motos.map(moto => {
              const imagen = moto.imagen_moto?.[0]?.imagen?.url_imagen;

              return (
                <tr key={moto.id_moto} className="hover:bg-slate-50/30">
                  <td className="px-8 py-5">
                    <img
                      src={imagen || "https://images.unsplash.com/photo-1558981403-c5f91cbba527?w=200"}
                      alt={moto.modelo}
                      className="w-14 h-10 object-cover rounded-lg border"
                    />
                  </td>

                  <td className="px-8 py-5">
                    <div className="font-black text-sm">{moto.modelo}</div>
                    <div className="text-[10px] text-slate-400 break-all">
                      {moto.id_moto}
                    </div>
                  </td>

                  <td className="px-8 py-5">
                    <span className="text-[10px] font-black text-slate-500 uppercase">
                      {moto.anio || "—"}
                    </span>
                  </td>

                  <td className="px-8 py-5 text-center">
                    <span
                      className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                        moto.estado === "disponible"
                          ? "bg-emerald-50 text-emerald-600"
                          : moto.estado === "reservado"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {moto.estado || "inactivo"}
                    </span>
                  </td>

                  <td className="px-8 py-5 font-black">
                    S/ {(moto.precio || 0).toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                  </td>

                  <td className="px-8 py-5">
                    <div className="flex gap-2">
                      <button className="p-2.5 border rounded-xl text-blue-500">
                        <Pencil size={14} />
                      </button>
                      <button className="p-2.5 border rounded-xl text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Paginación (visual) */}
      <div className="p-8 bg-slate-50/30  flex justify-between items-center">
        <span className="text-[10px] font-black text-slate-400 uppercase">
          Mostrando {motos.length} registros
        </span>
        <div className="flex gap-2">
          <ChevronLeft size={16} />
          <ChevronRight size={16} />
        </div>
      </div>
    </div>
  );
};

export default MotosTable;

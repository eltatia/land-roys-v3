import React from "react";
import {
  Search,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const EMPTY_MOTOS = [];

const MotosTable = ({ motos = EMPTY_MOTOS }) => {
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
              {["Imagen", "Nombre", "Categoría", "Stock", "Precio", "Acciones"].map(h => (
                <th key={h} className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {motos.map(moto => {
              const stockCritico = moto.stock > 0 && moto.stock <= 3;
              const sinStock = moto.stock === 0;

              return (
                <tr key={moto.id} className="hover:bg-slate-50/30">
                  <td className="px-8 py-5">
                    <img
                      src={moto.imagen_url || "https://images.unsplash.com/photo-1558981403-c5f91cbba527?w=200"}
                      alt={moto.nombre}
                      className="w-14 h-10 object-cover rounded-lg border"
                    />
                  </td>

                  <td className="px-8 py-5">
                    <div className="font-black text-sm">{moto.nombre}</div>
                    <div className="text-[10px] text-slate-400 break-all">
                      {moto.id}
                    </div>
                  </td>

                  <td className="px-8 py-5">
                    <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-3 py-1.5 rounded-full uppercase">
                      {moto.categoria}
                    </span>
                  </td>

                  <td className="px-8 py-5 text-center">
                    <div className={`font-black ${stockCritico ? "text-red-500" : "text-slate-900"}`}>
                      {moto.stock.toString().padStart(2, "0")}
                    </div>
                    {stockCritico && <span className="text-[8px] text-red-400 font-black">CRÍTICO</span>}
                    {sinStock && <span className="text-[8px] text-slate-300 font-black">SIN STOCK</span>}
                  </td>

                  <td className="px-8 py-5 font-black">
                    S/ {moto.precio.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
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

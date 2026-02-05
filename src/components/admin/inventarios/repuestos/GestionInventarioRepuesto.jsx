import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Plus, Package, AlertTriangle, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getRepuestos } from "../../../../services/repuestos.service";
import RepuestosTable from "./RepuestosTable";

const GestionInventarioRepuesto = () => {
  const navigate = useNavigate();
  const [repuestos, setRepuestos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarRepuestos = async () => {
      setLoading(true);
      try {
        const data = await getRepuestos();
        setRepuestos(data || []);
      } catch (error) {
        console.error("Error cargando repuestos:", error);
        setRepuestos([]);
      } finally {
        setLoading(false);
      }
    };

    cargarRepuestos();
  }, []);

  const resumen = useMemo(() => {
    const disponibles = repuestos.filter((r) => r.estado === "disponible").length;
    const agotados = repuestos.filter((r) => r.estado === "agotado").length;
    const valor = repuestos.reduce((acc, repuesto) => acc + (repuesto.precio || 0), 0);

    return { disponibles, agotados, valor };
  }, [repuestos]);

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 space-y-8">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/inventarios")}
            className="p-3 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 shadow-sm text-slate-400"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
              Gestión de <span className="text-yellow-400 italic">Repuestos</span>
            </h1>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-1">
              Inventario, precios y estado
            </p>
          </div>
        </div>

        <button className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95">
          <Plus size={16} strokeWidth={3} /> Agregar Nuevo Repuesto
        </button>
      </div>

      {/* Indicadores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex justify-between">
          <div>
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Disponibles</span>
            <div className="text-3xl font-black">{resumen.disponibles}</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-2xl text-yellow-400">
            <Package size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex justify-between">
          <div>
            <span className="text-[8px] font-black text-red-400 uppercase tracking-widest">Agotados</span>
            <div className="text-3xl font-black text-red-500">{resumen.agotados}</div>
          </div>
          <div className="bg-red-50 p-4 rounded-2xl text-red-400">
            <AlertTriangle size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex justify-between">
          <div>
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Valor Referencial</span>
            <div className="text-3xl font-black">S/ {resumen.valor.toLocaleString()}</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-2xl text-blue-400">
            <Wallet size={24} />
          </div>
        </div>
      </div>

      <RepuestosTable repuestos={repuestos} loading={loading} />
    </div>
  );
};

export default GestionInventarioRepuesto;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useOfertas } from "../../../hooks/useOfertas";
import OfertaForm from "./OfertaForm";
import OfertaPreview from "./OfertaPreview";
import Landing from "../../ui/Landing";

const Ofertas = () => {
  const navigate = useNavigate();
  const { ofertas, loading, addOferta, editOferta, removeOferta } = useOfertas();
  const [ofertaEditar, setOfertaEditar] = useState(null);

  const handleSubmit = async (data) => {
    if (ofertaEditar) {
      await editOferta(ofertaEditar.id, data);
      setOfertaEditar(null);
    } else {
      await addOferta(data);
    }
  };

  if (loading) {
    return <Landing />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <button
          onClick={() => navigate("/admin/home_secciones")}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-white shadow hover:shadow-md transition"
        >
          <ArrowLeft size={14} />
          Volver
        </button>

        <h1 className="text-3xl font-extrabold text-slate-800">
          Gestión de Ofertas
        </h1>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        {/* Formulario */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-3xl shadow-lg p-6 sticky top-8">
            <h2 className="text-xl font-bold mb-6 text-slate-700">
              {ofertaEditar ? "Editar oferta" : "Nueva oferta"}
            </h2>

            <OfertaForm
              key={ofertaEditar?.id || "nueva-oferta"}
              onSubmit={handleSubmit}
              ofertaExistente={ofertaEditar}
            />
          </div>
        </div>

        {/* Listado */}
        <div className="xl:col-span-3 space-y-6">
          {ofertas.length === 0 && (
            <div className="bg-white rounded-3xl border border-dashed p-10 text-center text-slate-400">
              No hay ofertas registradas
            </div>
          )}

          {ofertas.map((oferta) => (
            <OfertaPreview
              key={oferta.id}
              oferta={oferta}
              onEdit={setOfertaEditar}
              onDelete={removeOferta}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Ofertas;

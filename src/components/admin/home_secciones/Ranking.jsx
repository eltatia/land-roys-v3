import React from "react";
import { useRankingHome } from "../../../hooks/useRankingHome";
import { Star, ArrowLeft, Save, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

const inputBase =
  "w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-yellow-400 transition";

const Ranking = () => {
  const navigate = useNavigate();
  const { productos, updateProducto, guardarRanking, handleUploadImage, loading } = useRankingHome();

  if (loading) return <p className="text-center mt-10">Cargando ranking...</p>;

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12 lg:px-16">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-16">
        <div>
          <span className="text-[10px] font-black tracking-widest text-yellow-500 uppercase">
            Home · Colección Exclusiva
          </span>
          <h1 className="text-3xl font-black text-slate-900 mt-2">
            Ranking de Productos
          </h1>
        </div>

        <button
          onClick={() => navigate("/admin/home_secciones")}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-slate-100"
        >
          <ArrowLeft size={14} />
          Volver
        </button>
      </div>

      {/* VISTA PREVIA */}
      <div className="bg-white rounded-[3rem] p-12 shadow-xl mb-24 flex flex-wrap justify-center gap-12">
        {productos.length > 0 &&
          productos.map((p) => (
            <div key={p.id} className="w-64 text-center">
              <div className="bg-yellow-400 rounded-full px-4 py-1 text-xs font-black mb-3">
                {p.tag}
              </div>
              <img src={p.image} alt={p.name} className="rounded-3xl mb-3" />
              <h3 className="font-black text-lg">{p.name}</h3>
              <div className="flex justify-center text-yellow-400 my-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={`${p.id || p.name}-star-${i}`} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="font-black text-yellow-500">{p.price}</p>
            </div>
          ))}
      </div>

      {/* FORMULARIOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {productos.length > 0 &&
          productos.map((p, i) => (
            <div key={p.id} className="bg-white rounded-3xl p-10 shadow-md">
              <h4 className="font-black mb-4">Producto {p.rank}</h4>

              <input
                className={inputBase}
                value={p.name}
                onChange={(e) => updateProducto(i, "name", e.target.value)}
                placeholder="Nombre del producto"
              />

              <textarea
                className={`${inputBase} mt-3`}
                value={p.desc}
                onChange={(e) => updateProducto(i, "desc", e.target.value)}
                placeholder="Descripción del producto"
              />

              <input
                className={`${inputBase} mt-3`}
                value={p.price}
                onChange={(e) => updateProducto(i, "price", e.target.value)}
                placeholder="Precio"
              />

              <input
                className={`${inputBase} mt-3`}
                value={p.btn_primary_url}
                onChange={(e) => updateProducto(i, "btn_primary_url", e.target.value)}
                placeholder="URL botón principal"
              />

              <img src={p.image} alt={p.name} className="rounded-3xl mt-4" />

              <label className="relative flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-gray-300 bg-slate-50 px-6 py-8 text-center cursor-pointer mt-4 hover:border-yellow-400 hover:bg-yellow-50/40 transition">
                <Upload size={18} />
                <span className="text-sm mt-1">Subir imagen</span>
                <input
                  type="file"
                  hidden
                  onChange={(e) => handleUploadImage(i, e.target.files[0])}
                />
              </label>
            </div>
          ))}
      </div>

      {/* GUARDAR */}
      <div className="fixed bottom-10 right-10">
        <button
          onClick={guardarRanking}
          className="flex items-center gap-3 bg-yellow-400 px-8 py-4 rounded-full font-black shadow-xl"
        >
          Publicar ranking
          <Save size={18} />
        </button>
      </div>
    </div>
  );
};

export default Ranking;

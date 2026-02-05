import React, { useEffect, useState } from "react";
import { Save, Trash2 } from "lucide-react";
import { supabase } from "../../../api/Supabase.provider";
import Swal from "sweetalert2";

const inputBase =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm transition focus:border-[#ffd900] focus:ring-2 focus:ring-[#ffd900]/30 outline-none";

const labelBase =
  "block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2";

const Slider_preview = ({ slide, onSave, onChange }) => {
  const [localSlide, setLocalSlide] = useState(slide);

  useEffect(() => {
    setLocalSlide(slide);
  }, [slide]);

  const update = (field, value) => {
    const updated = { ...localSlide, [field]: value };
    setLocalSlide(updated);
    if (onChange) onChange(updated); // Actualiza solo localmente
  };

  const handleDeleteSlide = async () => {
    const result = await Swal.fire({
      title: "¿Eliminar slide?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const { error } = await supabase.from("slider_home").delete().eq("id", slide.id);
        if (error) throw error;

        Swal.fire({
          icon: "success",
          title: "Slide eliminado",
          timer: 1500,
          showConfirmButton: false,
        });

        // Recarga la página para reflejar cambios
        window.location.reload();
      } catch (err) {
        console.error("Error eliminando slide:", err);
        Swal.fire({ icon: "error", title: "Error", text: "No se pudo eliminar el slide" });
      }
    }
  };

  return (
    <div className="bg-white p-8 min-h-screen">
      {/* PREVIEW */}
      <div className="relative aspect-video rounded-3xl overflow-hidden shadow-xl mb-12 bg-black">
        <img
          src={localSlide.url_image || ""}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex items-center px-16">
          <div className="max-w-md space-y-4">
            <span className="text-[11px] uppercase tracking-widest text-white/70 font-bold">
              {localSlide.tag || ""}
            </span>

            <h2 className="text-5xl font-black text-white leading-tight">
              {localSlide.title || ""}
              <br />
              <span className="text-[#ffd900] italic">{localSlide.destacar || ""}</span>
            </h2>

            <p className="text-white/80 text-sm leading-relaxed">
              {localSlide.descripcion || ""}
            </p>

            <div className="flex gap-4 pt-4">
              <button className="bg-[#ffd900] text-black px-6 py-2.5 rounded-full font-black text-[11px] uppercase shadow-md">
                {localSlide.name_btn_1 || ""}
              </button>
              <button className="bg-white/20 backdrop-blur border border-white/30 text-white px-6 py-2.5 rounded-full font-black text-[11px] uppercase">
                {localSlide.name_btn_2 || ""}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FORM */}
      <div className="bg-gray-50 rounded-3xl p-8 shadow-sm border border-gray-100">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className={labelBase}>Tag</label>
            <input
              value={localSlide.tag || ""}
              onChange={(e) => update("tag", e.target.value)}
              className={inputBase}
              placeholder="SUMMER"
            />
          </div>

          <div>
            <label className={labelBase}>Title</label>
            <input
              value={localSlide.title || ""}
              onChange={(e) => update("title", e.target.value)}
              className={inputBase}
              placeholder="COLLECTION"
            />
          </div>

          <div>
            <label className={labelBase}>Destacar</label>
            <input
              value={localSlide.destacar || ""}
              onChange={(e) => update("destacar", e.target.value)}
              className={inputBase}
              placeholder="2024"
            />
          </div>

          <div>
            <label className={labelBase}>Botón principal</label>
            <input
              value={localSlide.name_btn_1 || ""}
              onChange={(e) => update("name_btn_1", e.target.value)}
              className={inputBase}
              placeholder="Shop Now"
            />
          </div>

          <div className="col-span-2">
            <label className={labelBase}>Descripción</label>
            <textarea
              rows={3}
              value={localSlide.descripcion || ""}
              onChange={(e) => update("descripcion", e.target.value)}
              className={`${inputBase} resize-none`}
              placeholder="Describe el mensaje principal del slide"
            />
          </div>

          <div className="col-span-2">
            <label className={labelBase}>URL Imagen</label>
            <input
              value={localSlide.url_image || ""}
              onChange={(e) => update("url_image", e.target.value)}
              className={inputBase}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className={labelBase}>Botón secundario</label>
            <input
              value={localSlide.name_btn_2 || ""}
              onChange={(e) => update("name_btn_2", e.target.value)}
              className={inputBase}
              placeholder="View Lookbook"
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-6 pt-8 mt-8 border-t border-gray-200">
          <button
            className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-700"
            onClick={handleDeleteSlide} // Elimina slide y recarga
          >
            <Trash2 size={16} /> Eliminar
          </button>

          <button
            className="flex items-center gap-2 bg-[#ffd900] hover:bg-[#e6c200] text-black font-black px-8 py-3 rounded-full text-[11px] uppercase shadow-md"
            onClick={() => onSave(localSlide)} // guarda en Supabase
          >
            Guardar cambios
            <Save size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Slider_preview;

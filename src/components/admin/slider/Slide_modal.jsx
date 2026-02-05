import React, { useState } from "react";
import { X } from "lucide-react";

const Slide_modal = ({ onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [urlImage, setUrlImage] = useState("");
  const [estado, setEstado] = useState(true);

  const handleSave = () => {
    if (!title.trim()) return alert("El título es obligatorio");

    const newSlide = {
      title: title.trim(),
      url_image: urlImage.trim() === "" ? null : urlImage.trim(), // null si no hay URL
      estado,
    };

    onSave(newSlide);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-xl w-[400px] relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500">
          <X size={20} />
        </button>
        <h2 className="text-lg font-bold mb-4">Nuevo Slide</h2>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="URL de Imagen (opcional)"
            value={urlImage}
            onChange={(e) => setUrlImage(e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={estado}
              onChange={() => setEstado(!estado)}
            />
            Activo
          </label>
          <button
            onClick={handleSave}
            className="mt-3 bg-yellow-400 text-black font-bold px-4 py-2 rounded-full"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Slide_modal;

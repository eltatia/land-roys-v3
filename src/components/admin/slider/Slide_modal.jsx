import React, { useState, useRef } from "react";
import { X } from "lucide-react";

const Slide_modal = ({ onClose, onSave }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [estado, setEstado] = useState(true);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const handleFileChange = (selectedFile) => {
    if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
      setError("El tamaño máximo permitido es 5MB.");
      setFile(null);
      setPreview("");
    } else {
      setError("");
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileChange(droppedFile);
  };

  const handleSave = () => {
    if (!file) return alert("La imagen es obligatoria");

    onSave({ file, estado });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-2xl w-[400px] relative shadow-lg">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-5 text-center">Nuevo Slide</h2>

        <div className="flex flex-col gap-4">
          {/* Drag & Drop Input */}
          <div
            role="button"
            tabIndex={0}
            className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                inputRef.current?.click();
              }
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e.target.files[0])}
              className="hidden"
            />
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-32 object-cover rounded-lg"
              />
            ) : (
              <p className="text-gray-500 text-sm text-center">
                Arrastra la imagen aquí o haz clic para seleccionar
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1 text-center">
              Tamaño máximo recomendado: 5MB
            </p>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>

          {/* Checkbox de estado más visual */}
          <div className="flex items-center gap-3 select-none">
            <button
              type="button"
              aria-label="Cambiar estado"
              className={`w-10 h-5 rounded-full p-1 flex items-center transition ${
                estado ? "bg-green-500 justify-end" : "bg-gray-300 justify-start"
              }`}
              onClick={() => setEstado(!estado)}
            >
              <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
            </button>
            <span className="text-gray-700 font-medium">{estado ? "Activo" : "Inactivo"}</span>
          </div>

          {/* Botón guardar */}
          <button
            onClick={handleSave}
            className="mt-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-4 py-2 rounded-full shadow-md transition"
            disabled={!!error}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Slide_modal;

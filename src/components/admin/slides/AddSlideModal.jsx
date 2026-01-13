import { useState } from "react";
import { uploadImage, createSlide } from "../../../services/slidesService";
import Swal from "sweetalert2";
import { MdUploadFile } from "react-icons/md";
import "./AddSlideModal.css";

export default function AddSlideModal({ onClose, onCreated, orderIndex }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);

  const [hasButton, setHasButton] = useState(false);
  const [buttonText, setButtonText] = useState("");
  const [buttonLink, setButtonLink] = useState("");

  const [visible, setVisible] = useState(true);

  const handleSubmit = async () => {
    if (!title || !text || !file) {
      Swal.fire("Campos incompletos", "Completa los campos obligatorios.", "warning");
      return;
    }

    const img = await uploadImage(file);
    if (img.error) {
      Swal.fire("Error", "No se pudo subir la imagen", "error");
      return;
    }

    const { error } = await createSlide({
      order_index: orderIndex,
      title,
      text,
      img_path: img.data.path,
      img_url: img.data.url,
      hasbutton: hasButton,
      buttontext: buttonText,
      buttonlink: buttonLink,
      visible,
    });

    if (error) {
      Swal.fire("Error", error.message || "Error al crear slide", "error");
      return;
    }

    Swal.fire("Éxito", "Slide creada correctamente", "success");
    onCreated();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">

        <main className="flex-1 p-8 w-full max-w-4xl mx-auto">

          <div className="mb-8">
            <h1 className="text-text-light dark:text-text-dark text-4xl font-black">
              Añadir Nueva Slide
            </h1>
            <p className="text-text-muted-light dark:text-text-muted-dark mt-2">
              Rellena el formulario para añadir una nueva slide a la página principal.
            </p>
          </div>

          <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-xl border border-border-light dark:border-border-dark space-y-8">

            {/* Título */}
            <div className="flex flex-col">
              <label className="pb-2 font-medium">Título</label>
              <input
                className="form-input rounded-lg border px-4 h-12"
                placeholder="Introduce el título de la slide"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Texto */}
            <div className="flex flex-col">
              <label className="pb-2 font-medium">Texto Principal</label>
              <textarea
                className="form-textarea rounded-lg border p-4 min-h-36 resize-y"
                placeholder="Introduce el texto principal para la slide"
                value={text}
                onChange={(e) => setText(e.target.value)}
              ></textarea>
            </div>

            {/* Imagen */}
            <div>
                <label className="pb-2 block font-medium">Imagen</label>
                <div className="flex flex-col items-center gap-6 rounded-lg border-2 border-dashed px-6 py-10">
                    <div className="flex items-center justify-center size-16 bg-primary/10 rounded-full">
                    <MdUploadFile className="text-primary" size={40} />
                    </div>

                    <p className="text-lg font-bold">Cargar Imagen</p>

                <input
                    type="file"
                    accept="image/*"
                    className="cursor-pointer"
                    onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
            </div>

            {/* Tiene botón */}
            <div>
              <div className="flex items-center justify-between pb-6">
                <p className="font-medium">¿Tiene Botón?</p>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasButton}
                    onChange={() => setHasButton(!hasButton)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-primary after:absolute after:h-5 after:w-5 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
              </div>

              {hasButton && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-4 border-l-2">
                  <div className="flex flex-col">
                    <label className="pb-2 font-medium">Texto del Botón</label>
                    <input
                      className="form-input rounded-lg border px-4 h-12"
                      placeholder="Nombre del boton"
                      value={buttonText}
                      onChange={(e) => setButtonText(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="pb-2 font-medium">Enlace del Botón</label>
                    <input
                      className="form-input rounded-lg border px-4 h-12"
                      placeholder="/ruta"
                      value={buttonLink}
                      onChange={(e) => setButtonLink(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Visible */}
            <div className="flex items-center justify-between">
              <p className="font-medium">Visible</p>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={visible}
                  onChange={() => setVisible(!visible)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-primary after:absolute after:h-5 after:w-5 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </div>

            {/* Acciones */}
            <div className="flex justify-end gap-4 pt-4 border-t">
                <button onClick={handleSubmit} className="btn-primary-save">
                    Guardar Slide
                </button>

                <button onClick={onClose} className="btn-secondary-cancel">
                    Cancelar
                </button>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}

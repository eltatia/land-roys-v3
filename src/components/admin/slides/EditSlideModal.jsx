import { useState } from "react";
import { uploadImage, updateSlide } from "../../../services/slidesService";
import "./EditSlideModal.css";
import Swal from "sweetalert2";
import { MdUploadFile } from "react-icons/md";

export default function EditSlideModal({ slide, onClose, onUpdated }) {
  const [title, setTitle] = useState(slide.title);
  const [text, setText] = useState(slide.text);

  const [hasButton, setHasButton] = useState(slide.hasbutton);
  const [buttonText, setButtonText] = useState(slide.buttontext || "");
  const [buttonLink, setButtonLink] = useState(slide.buttonlink || "");

  const [file, setFile] = useState(null);

  const handleUpdate = async () => {
    let newImage = {};

    // Subir nueva imagen si hay cambio
    if (file) {
      const img = await uploadImage(file);
      if (img.error) {
        Swal.fire("Error", "No se pudo subir la nueva imagen.", "error");
        return;
      }

      newImage = {
        img_path: img.data.path,
        img_url: img.data.url,
      };
    }

    const { error } = await updateSlide(slide.id, {
      title,
      text,
      hasbutton: hasButton,
      buttontext: hasButton ? buttonText : null,
      buttonlink: hasButton ? buttonLink : null,
      ...newImage,
    });

    if (error) {
      Swal.fire("Error", "No se pudo actualizar la slide.", "error");
      return;
    }

    Swal.fire("Éxito", "Slide actualizada correctamente", "success");
    onUpdated();
    onClose();
  };

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal-card">

        <h2 className="modal-title">Editar Slide</h2>

        {/* Título */}
        <label className="input-label">Título</label>
        <input
          className="modal-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Texto */}
        <label className="input-label">Texto Principal</label>
        <textarea
          className="modal-input textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* Cambiar imagen */}
        <label className="input-label">Cambiar imagen (opcional)</label>

        <div className="image-upload-box">
          <MdUploadFile size={40} className="text-orange" />
          <p>Selecciona una imagen nueva</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="file-input"
          />
        </div>

        {/* Switch botón */}
        <div className="switch-box">
          <input
            type="checkbox"
            checked={hasButton}
            onChange={() => setHasButton(!hasButton)}
          />
          <span>Esta slide tiene botón</span>
        </div>

        {/* Opciones de botón */}
        {hasButton && (
          <>
            <label className="input-label">Texto del botón</label>
            <input
              className="modal-input"
              placeholder="Nombre del boton"
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
            />

            <label className="input-label">Enlace del botón</label>
            <input
              className="modal-input"
                placeholder="/URL del boton"
              value={buttonLink}
              onChange={(e) => setButtonLink(e.target.value)}
            />
          </>
        )}

        {/* Botones */}
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-save" onClick={handleUpdate}>
            Guardar Cambios
          </button>
        </div>

      </div>
    </div>
  );
}


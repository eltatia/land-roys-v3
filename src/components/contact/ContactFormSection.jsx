import { useState } from "react";
import { HiPaperAirplane } from "react-icons/hi";
import { supabase } from "../../services/Supabase";
import "../../styles/contact/ContactFormSection.css";

const initialState = {
  nombre: "",
  email: "",
  telefono: "",
  asunto: "",
  mensaje: "",
};

const ContactFormSection = () => {
  const [formData, setFormData] = useState(initialState);
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const nextErrors = {};
    if (!formData.nombre.trim()) nextErrors.nombre = "El nombre es obligatorio.";
    if (!formData.email.trim()) {
      nextErrors.email = "El correo es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = "Ingresa un correo válido.";
    }
    if (!formData.telefono.trim()) nextErrors.telefono = "El teléfono es obligatorio.";
    if (!formData.asunto.trim()) nextErrors.asunto = "El asunto es obligatorio.";
    if (!formData.mensaje.trim()) nextErrors.mensaje = "El mensaje es obligatorio.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("");
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from("consultas").insert({
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        asunto: formData.asunto,
        mensaje: formData.mensaje,
      });

      if (error) throw error;

      setStatus("Recibimos tus datos. Un asesor se comunicará pronto.");
      setFormData(initialState);
    } catch (error) {
      console.error("Error sending consulta:", error);
      setStatus("No pudimos enviar tu consulta. Intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact-form" className="contact-form-section">
      <div className="form-header">
        <span className="form-badge">Envíanos tu consulta</span>
        <h2>Cuéntanos qué necesitas y te responderemos en breve</h2>
        <p>Te ayudamos con cotizaciones, financiamiento, repuestos y agendamiento de pruebas de manejo.</p>
      </div>

      <div className="form-grid">
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="nombre">Nombre completo</label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ingresa tu nombre"
              required
            />
            {errors.nombre && <span className="form-error">{errors.nombre}</span>}
          </div>

          <div className="form-row two-columns">
            <div>
              <label htmlFor="email">Correo</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contacto@correo.com"
                required
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>
            <div>
              <label htmlFor="telefono">Teléfono</label>
              <input
                id="telefono"
                name="telefono"
                type="tel"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="+51 999 888 777"
                required
              />
              {errors.telefono && <span className="form-error">{errors.telefono}</span>}
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="asunto">Asunto</label>
            <input
              id="asunto"
              name="asunto"
              type="text"
              value={formData.asunto}
              onChange={handleChange}
              placeholder="Cotización, financiamiento, repuestos..."
              required
            />
            {errors.asunto && <span className="form-error">{errors.asunto}</span>}
          </div>

          <div className="form-row">
            <label htmlFor="mensaje">Mensaje</label>
            <textarea
              id="mensaje"
              name="mensaje"
              rows="4"
              value={formData.mensaje}
              onChange={handleChange}
              placeholder="Cuéntanos más detalles sobre lo que buscas"
              required
            />
            {errors.mensaje && <span className="form-error">{errors.mensaje}</span>}
          </div>

          <button className="form-submit" type="submit" disabled={submitting}>
            <HiPaperAirplane /> {submitting ? "Enviando..." : "Enviar mensaje"}
          </button>

          {status && (
            <p className={`form-status ${status.startsWith("No") ? "is-error" : ""}`}>{status}</p>
          )}
        </form>

        <div className="form-aside">
          <div className="aside-card">
            <h3>¿Necesitas asesoría rápida?</h3>
            <p>Un especialista te llama para revisar opciones y disponibilidad en menos de 30 minutos.</p>
            <ul>
              <li>Revisión de stock en tiempo real</li>
              <li>Financiamiento a medida</li>
              <li>Entrega y matriculación asistida</li>
            </ul>
            <a className="aside-link" href="tel:+51987654321">
              Llamar a un asesor
            </a>
          </div>
          <div className="aside-card secondary">
            <h3>Visita el taller certificado</h3>
            <p>Agenda una cita para mantenimiento preventivo o instalación de accesorios.</p>
            <a className="aside-link" href="#contact-channels">
              Ver horarios disponibles
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;

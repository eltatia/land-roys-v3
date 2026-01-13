import { useState } from "react";
import { HiPaperAirplane } from "react-icons/hi";
import "../../../styles/contact/ContactFormSection.css";

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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatus("Recibimos tus datos. Un asesor se comunicará pronto.");
    setFormData(initialState);
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
          </div>

          <button className="form-submit" type="submit">
            <HiPaperAirplane /> Enviar mensaje
          </button>

          {status && <p className="form-status">{status}</p>}
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

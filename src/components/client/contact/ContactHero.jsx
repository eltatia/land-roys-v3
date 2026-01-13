import { HiLocationMarker, HiPhoneOutgoing, HiOutlineChatAlt2 } from "react-icons/hi";
import "../../../styles/contact/ContactHero.css";

const ContactHero = () => {
  return (
    <section className="contact-hero">
      <div className="contact-hero__content">
        <span className="contact-hero__badge">Estamos para ayudarte</span>
        <h1 className="contact-hero__title">Conversemos sobre tu próxima aventura</h1>
        <p className="contact-hero__subtitle">
          Nuestro equipo responde en menos de 24 horas. Llámanos, agenda una visita o déjanos un mensaje y te
          acompañaremos a elegir la moto perfecta para ti.
        </p>

        <div className="contact-hero__actions">
          <a className="btn-primary" href="#contact-form">Agendar una llamada</a>
          <a className="btn-outline" href="#contact-channels">Ver canales de contacto</a>
        </div>

        <div className="contact-hero__highlights">
          <div className="highlight-card">
            <HiPhoneOutgoing className="highlight-icon" />
            <div>
              <p className="highlight-label">Asesor directo</p>
              <p className="highlight-value">+51 987 654 321</p>
            </div>
          </div>
          <div className="highlight-card">
            <HiOutlineChatAlt2 className="highlight-icon" />
            <div>
              <p className="highlight-label">Respuesta promedio</p>
              <p className="highlight-value">&lt; 24 horas</p>
            </div>
          </div>
          <div className="highlight-card">
            <HiLocationMarker className="highlight-icon" />
            <div>
              <p className="highlight-label">Showroom principal</p>
              <p className="highlight-value">Av. Panamericana 123, Lima</p>
            </div>
          </div>
        </div>
      </div>

      <div className="contact-hero__panel">
        <p className="panel-title">Agenda una visita guiada</p>
        <p className="panel-description">
          Recorre el showroom, prueba la moto que te gusta y recibe recomendaciones personalizadas de nuestros expertos.
        </p>
        <ul className="panel-list">
          <li>Pruebas de manejo supervisadas</li>
          <li>Rutas sugeridas según tu estilo</li>
          <li>Financiamiento y seguros en sitio</li>
        </ul>
        <a className="panel-link" href="#contact-form">Agendar ahora</a>
      </div>
    </section>
  );
};

export default ContactHero;

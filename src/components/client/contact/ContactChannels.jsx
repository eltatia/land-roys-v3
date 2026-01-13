import { useEffect, useRef, useState } from "react";
import { HiMail, HiPhone, HiLocationMarker, HiClock } from "react-icons/hi";
import "../../../styles/contact/ContactChannels.css";
import "../../../styles/contact/ContactMap.css";

const channels = [
  {
    icon: <HiPhone />,
    title: "Llámanos",
    detail: "+51 987 654 321",
    description: "Atención de lunes a sábado, 9:00 a 19:00.",
    actionLabel: "Llamar ahora",
    href: "tel:+51987654321",
  },
  {
    icon: <HiMail />,
    title: "Escríbenos",
    detail: "contacto@landroys.com",
    description: "Respondemos en menos de 24 horas hábiles.",
    actionLabel: "Enviar correo",
    href: "mailto:contacto@landroys.com",
  },
  {
    icon: <HiLocationMarker />,
    title: "Visítanos",
    detail: "Av. Panamericana 123, Lima",
    description: "Showroom y taller certificado.",
    actionLabel: "Ver ubicación",
    href: "https://maps.google.com",
  },
  {
    icon: <HiClock />,
    title: "Horarios",
    detail: "Lun a sáb: 9:00 - 19:00",
    description: "Domingos para test drives con reserva.",
    actionLabel: "Agendar visita",
    href: "#contact-form",
  },
];

const storeLocations = [
  {
    id: "lima",
    title: "Lima - Showroom Central",
    address: "Av. Panamericana 123, Surco, Lima",
    phone: "+51 987 654 321",
    hours: "Lun a sáb: 9:00 - 19:00",
    coords: [-12.0464, -77.0428],
    image:
      "https://images.unsplash.com/photo-1529429617124-aee1f1650a5c?auto=format&fit=crop&w=900&q=60",
    detailMap: "https://www.openstreetmap.org/#map=16/-12.0464/-77.0428",
  },
  {
    id: "arequipa",
    title: "Arequipa - Concesionario Sur",
    address: "Av. Ejército 789, Cayma, Arequipa",
    phone: "+51 912 222 333",
    hours: "Lun a sáb: 9:30 - 18:30",
    coords: [-16.409, -71.5375],
    image:
      "https://images.unsplash.com/photo-1473646910415-5c1d9f9030ad?auto=format&fit=crop&w=900&q=60",
    detailMap: "https://www.openstreetmap.org/#map=16/-16.4090/-71.5375",
  },
  {
    id: "cusco",
    title: "Cusco - Punto Andino",
    address: "Calle Saphi 456, Cusco",
    phone: "+51 921 555 777",
    hours: "Lun a sáb: 10:00 - 19:00",
    coords: [-13.532, -71.9675],
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=60",
    detailMap: "https://www.openstreetmap.org/#map=16/-13.5320/-71.9675",
  },
  {
    id: "trujillo",
    title: "Trujillo - Costa Norte",
    address: "Av. América Sur 1020, Trujillo",
    phone: "+51 913 444 111",
    hours: "Lun a sáb: 9:00 - 18:00",
    coords: [-8.1091, -79.0215],
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=60",
    detailMap: "https://www.openstreetmap.org/#map=16/-8.1091/-79.0215",
  },
];

const LEAFLET_STYLESHEET = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const LEAFLET_SCRIPT = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
const LEAFLET_ICON = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const LEAFLET_ICON_RETINA = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
const LEAFLET_SHADOW = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

const ContactChannels = () => {
  const [activeLocation, setActiveLocation] = useState(storeLocations[0]);
  const [leafletReady, setLeafletReady] = useState(false);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ensureStylesheet = () => {
      const existing = document.querySelector(`link[href="${LEAFLET_STYLESHEET}"]`);
      if (!existing) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = LEAFLET_STYLESHEET;
        document.head.appendChild(link);
      }
    };

    const ensureScript = () =>
      new Promise((resolve) => {
        if (window.L) {
          resolve(window.L);
          return;
        }

        const existing = document.querySelector(`script[src="${LEAFLET_SCRIPT}"]`);
        if (existing) {
          existing.addEventListener("load", () => resolve(window.L));
          return;
        }

        const script = document.createElement("script");
        script.src = LEAFLET_SCRIPT;
        script.async = true;
        script.defer = true;
        script.addEventListener("load", () => resolve(window.L));
        document.body.appendChild(script);
      });

    ensureStylesheet();
    ensureScript().then(() => setLeafletReady(true));
  }, []);

  useEffect(() => {
    if (!leafletReady || !mapContainerRef.current || typeof window === "undefined") return;

    const L = window.L;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        center: activeLocation.coords,
        zoom: 6,
        minZoom: 4,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapInstanceRef.current);

      markersLayerRef.current = L.layerGroup().addTo(mapInstanceRef.current);
    }

    const icon = L.icon({
      iconUrl: LEAFLET_ICON,
      iconRetinaUrl: LEAFLET_ICON_RETINA,
      shadowUrl: LEAFLET_SHADOW,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    markersLayerRef.current.clearLayers();

    storeLocations.forEach((location) => {
      const marker = L.marker(location.coords, { icon }).addTo(markersLayerRef.current);
      marker.bindPopup(`<strong>${location.title}</strong><br/>${location.address}`);
      marker.on("click", () => setActiveLocation(location));
      if (location.id === activeLocation.id) {
        marker.openPopup();
      }
    });

    mapInstanceRef.current.setView(activeLocation.coords, 6);
  }, [leafletReady, activeLocation]);

  return (
    <section id="contact-channels" className="contact-channels">
      <div className="channels-header">
        <span className="channels-badge">Canales oficiales</span>
        <h2>Estamos disponibles en tus vías favoritas</h2>
        <p>
          Elige el canal que prefieras para resolver dudas sobre modelos, financiamiento, repuestos o agendar un test drive.
        </p>
      </div>

      <div className="channels-grid">
        {channels.map((channel) => (
          <article className="channel-card" key={channel.title}>
            <div className="channel-icon">{channel.icon}</div>
            <div className="channel-info">
              <h3>{channel.title}</h3>
              <p className="channel-detail">{channel.detail}</p>
              <p className="channel-description">{channel.description}</p>
            </div>
            <a className="channel-action" href={channel.href}>
              {channel.actionLabel}
            </a>
          </article>
        ))}
      </div>

      <div className="contact-map">
        <div className="contact-map__header">
          <span className="channels-badge">Mapa interactivo de Perú</span>

        </div>

        <div className="contact-map__layout">
          <aside className="contact-map__sidebar">
            <div className="sidebar-top">
              <p className="sidebar-label">Punto seleccionado</p>
              <h3 className="sidebar-title">{activeLocation.title}</h3>
            </div>

            <div className="sidebar-card">
              <img src={activeLocation.image} alt={activeLocation.title} className="sidebar-image" />
              <div className="sidebar-details">
                <p className="sidebar-address">{activeLocation.address}</p>
                <p className="sidebar-meta">Teléfono: {activeLocation.phone}</p>
                <p className="sidebar-meta">Horarios: {activeLocation.hours}</p>
                <a className="sidebar-link" href={activeLocation.detailMap} target="_blank" rel="noreferrer">
                  Ver mapa detallado
                </a>
              </div>
            </div>

            <div className="sidebar-list">
              <p className="sidebar-list__title">Otros puntos de venta</p>
              <div className="sidebar-list__chips">
                {storeLocations.map((location) => (
                  <button
                    key={location.id}
                    type="button"
                    className={`sidebar-chip ${location.id === activeLocation.id ? "is-active" : ""}`}
                    onClick={() => setActiveLocation(location)}
                  >
                    {location.title.split(" - ")[0]}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="contact-map__canvas" ref={mapContainerRef} aria-label="Mapa interactivo de puntos Land Roys" />
        </div>
      </div>
    </section>
  );
};

export default ContactChannels;
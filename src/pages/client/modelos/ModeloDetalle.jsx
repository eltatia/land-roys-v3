import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BatteryFull, Fuel, Gauge, Wrench, Zap } from "lucide-react";
import Swal from "sweetalert2";
import { getMotoById } from "../../../services/Motos.service";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const defaultVideo =
  "https://cdn.coverr.co/videos/coverr-motorcycle-ride-4284/1080p.mp4";

const ModeloDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [moto, setMoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    ciudad: "",
    mensaje: "",
  });

  useEffect(() => {
    const fetchMoto = async () => {
      setLoading(true);
      try {
        const data = await getMotoById(id);
        setMoto(data);
      } catch (error) {
        console.error("Error cargando detalle de moto:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cargar el detalle del modelo.",
        }).then(() => navigate("/modelos"));
      } finally {
        setLoading(false);
      }
    };

    fetchMoto();
  }, [id, navigate]);

  const specsList = useMemo(() => {
    if (!moto) return [];
    return [
      { label: "Motor", value: moto.motor_especificacion || "Sin especificar", icon: Wrench },
      {
        label: "Capacidad del tanque",
        value: moto.capacidad_tanque_l ? `${moto.capacidad_tanque_l} L` : "Sin dato",
        icon: Fuel,
      },
      { label: "Cilindrada", value: moto.cilindrada_cc ? `${moto.cilindrada_cc} cc` : "Sin dato", icon: Zap },
      { label: "Torque", value: moto.torque_max_nm ? `${moto.torque_max_nm} Nm` : "Sin dato", icon: BatteryFull },
      { label: "Velocidades", value: moto.velocidades ? `${moto.velocidades}` : "Sin dato", icon: Gauge },
      {
        label: "Máxima velocidad",
        value: moto.maxima_velocidad_kmh ? `${moto.maxima_velocidad_kmh} km/h` : "Sin dato",
        icon: Gauge,
      },
    ];
  }, [moto]);

  const diferencialTitulo = moto?.diferencial_titulo || "Diseñado para destacar";
  const diferencialTexto =
    moto?.diferencial_texto ||
    "Agrega aquí una descripción corta de ese detalle especial que hace única a esta moto.";
  const diferencialImagen =
    moto?.imagen_url ||
    "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=1200&auto=format&fit=crop";

  const handleContactChange = (event) => {
    const { name, value } = event.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = (event) => {
    event.preventDefault();
    if (!contactForm.nombre.trim() || !contactForm.email.trim()) {
      Swal.fire("Validación", "Nombre y correo son obligatorios.", "warning");
      return;
    }
    Swal.fire("Enviado", "Un asesor se pondrá en contacto contigo.", "success");
    setContactForm({
      nombre: "",
      email: "",
      telefono: "",
      ciudad: "",
      mensaje: "",
    });
  };

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-black text-white">
        Cargando detalles...
      </section>
    );
  }

  if (!moto) {
    return null;
  }

  const modelLogo = moto.logo_url || "/vite.svg";
  const brandLogo = moto.brand_logo_url || "/vite.svg";

  const hasVideo = Boolean(moto.video_url);

  return (
    <section className="bg-white text-slate-900">
      {hasVideo ? (
        <div className="relative h-screen w-full overflow-hidden">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={moto.imagen_url || "/vite.svg"}
          >
            <source src={moto.video_url || defaultVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/80" />
          <div className="relative z-10 h-full w-full px-6 pb-12 text-white">
            <div className="absolute bottom-10 left-14 flex flex-col gap-4">
              {moto.logo_url ? (
                <img
                  src={modelLogo}
                  alt={`${moto.nombre} logo`}
                  className="h-32 md:h-40 w-auto max-w-[520px] object-contain"
                />
              ) : (
                <p className="uppercase tracking-[0.3em] text-yellow-300 text-xs">Modelo</p>
              )}
              <div>
                <h1 className="text-4xl md:text-6xl font-black">{moto.nombre}</h1>
                <p className="text-sm md:text-base mt-2 text-slate-200 max-w-2xl">
                  {moto.descripcion || "Descubre cada detalle de esta moto diseñada para tu estilo de vida."}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 pt-16">
          <section className="grid grid-cols-1 lg:grid-cols-[1.45fr_0.75fr] gap-12 items-center">
            <div className="overflow-hidden lg:-ml-6">
              <img
                src={
                  moto.imagen_url ||
                  "https://images.unsplash.com/photo-1511994298241-608e28f14fde?q=80&w=1200&auto=format&fit=crop"
                }
                alt={moto.nombre}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center lg:text-left space-y-6 lg:pl-10 lg:translate-x-20 lg:ml-auto">
              <img
                src={modelLogo}
                alt={`${moto.nombre} logo`}
                className="h-28 md:h-32 w-auto max-w-[260px] object-contain mx-auto lg:mx-0"
              />
              <p className="text-xl text-slate-600 text-center lg:text-left">
                {moto.descripcion || "Potencia, estilo y tecnología pensados para el conductor exigente."}
              </p>
              <div className="flex flex-col items-center lg:items-start gap-2">
                <img src={brandLogo} alt="Logo empresa" className="h-16 w-auto object-contain" />
                <p className="text-4xl font-black text-yellow-500">{currency.format(Number(moto.precio || 0))}</p>
              </div>
            </div>
          </section>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        {hasVideo && (
          <section className="grid grid-cols-1 lg:grid-cols-[1.35fr_0.75fr] gap-12 items-center">
            <div className="overflow-hidden lg:-ml-6">
              <img
                src={
                  moto.imagen_url ||
                  "https://images.unsplash.com/photo-1511994298241-608e28f14fde?q=80&w=1200&auto=format&fit=crop"
                }
                alt={moto.nombre}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center lg:text-left space-y-5 lg:pl-10 lg:translate-x-20 lg:ml-auto">
              <img
                src={modelLogo}
                alt={`${moto.nombre} logo`}
                className="h-24 md:h-28 w-auto max-w-[240px] object-contain mx-auto lg:mx-0"
              />
              <p className="text-lg text-slate-600">
                {moto.descripcion || "Potencia, estilo y tecnología pensados para el conductor exigente."}
              </p>
              <div className="flex flex-col items-center lg:items-start gap-2">
                <img src={brandLogo} alt="Logo empresa" className="h-14 w-auto object-contain" />
                <p className="text-3xl font-black text-yellow-500">{currency.format(Number(moto.precio || 0))}</p>
              </div>
            </div>
          </section>
        )}

        <section className="rounded-3xl px-4 md:px-8 py-12">
          <h2 className="text-center text-2xl md:text-3xl font-black text-slate-900 mb-10">
            Especificaciones técnicas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specsList.map((spec) => {
              const Icon = spec.icon;
              return (
                <div key={spec.label} className="border border-slate-200 rounded-2xl p-6 bg-white">
                  <div className="flex flex-col items-center text-center gap-3">
                    <span className="h-14 w-14 rounded-2xl bg-yellow-400/20 text-yellow-500 flex items-center justify-center">
                      <Icon size={24} />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{spec.label}</p>
                      <p className="text-lg font-bold mt-1 text-slate-900">{spec.value}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-[1.4fr_0.6fr] gap-12 items-center">
          <div className="overflow-hidden lg:-ml-8">
            <img
              src={diferencialImagen}
              alt="Detalle destacado"
              className="w-full h-[520px] md:h-[640px] object-cover"
            />
          </div>
          <div className="space-y-4 text-center lg:text-left">
            <h3 className="text-4xl md:text-5xl font-black text-slate-800">{diferencialTitulo}</h3>
            <p className="text-xl text-slate-600">{diferencialTexto}</p>
          </div>
        </section>

        <section className="bg-[#f7f8fa] rounded-3xl p-8">
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 text-center mb-6">
            Agenda tu asesoría
          </h2>
          <form onSubmit={handleContactSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="nombre"
              value={contactForm.nombre}
              onChange={handleContactChange}
              placeholder="Nombre completo"
              className="border rounded-xl px-4 py-3"
            />
            <input
              name="email"
              value={contactForm.email}
              onChange={handleContactChange}
              placeholder="Correo electrónico"
              className="border rounded-xl px-4 py-3"
            />
            <input
              name="telefono"
              value={contactForm.telefono}
              onChange={handleContactChange}
              placeholder="Teléfono"
              className="border rounded-xl px-4 py-3"
            />
            <input
              name="ciudad"
              value={contactForm.ciudad}
              onChange={handleContactChange}
              placeholder="Ciudad"
              className="border rounded-xl px-4 py-3"
            />
            <textarea
              name="mensaje"
              value={contactForm.mensaje}
              onChange={handleContactChange}
              placeholder="Cuéntanos qué buscas"
              rows={4}
              className="border rounded-xl px-4 py-3 md:col-span-2"
            />
            <button
              type="submit"
              className="md:col-span-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-xl"
            >
              Enviar datos
            </button>
          </form>
        </section>
      </div>
    </section>
  );
};

export default ModeloDetalle;

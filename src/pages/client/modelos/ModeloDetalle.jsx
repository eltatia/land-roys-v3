import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BatteryFull, ChevronLeft, ChevronRight, Fuel, Gauge, Wrench, Zap } from "lucide-react";
import Swal from "sweetalert2";
import { getMotoById } from "../../../services/motos.service";
import { resolveFichaTecnicaUrl } from "../../../util/fichaTecnica";
import { createSolicitud } from "../../../services/Solicitudes.service";

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
  const heroRef = useRef(null);
  const infoRef = useRef(null);
  const diferencialRef = useRef(null);
  const [heroVisible, setHeroVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [diferencialVisible, setDiferencialVisible] = useState(false);
  const [contactForm, setContactForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    ciudad: "",
    mensaje: "",
  });
  const [galeriaIndex, setGaleriaIndex] = useState(0);

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

  useEffect(() => {
    if (!moto) return;
    const node = heroRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeroVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [moto]);

  useEffect(() => {
    if (!moto) return;
    const node = infoRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInfoVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [moto]);

  useEffect(() => {
    if (!moto) return;
    const node = diferencialRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDiferencialVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [moto]);

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

  const galeriaItems = useMemo(() => {
    if (!moto) return [];
    const raw = moto.galeria_destacada;
    let parsed = [];
    if (Array.isArray(raw)) {
      parsed = raw;
    } else if (typeof raw === "string") {
      try {
        const decoded = JSON.parse(raw);
        parsed = Array.isArray(decoded) ? decoded : [];
      } catch {
        parsed = [];
      }
    }
    return parsed
      .map((item) => ({
        imagen_url: item?.imagen_url ?? item?.imagenUrl ?? "",
        titulo: item?.titulo ?? "",
        descripcion: item?.descripcion ?? "",
      }))
      .filter((item) => item.imagen_url);
  }, [moto]);

  useEffect(() => {
    setGaleriaIndex(0);
  }, [galeriaItems.length]);

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

  const handleContactSubmit = async (event) => {
    event.preventDefault();
    if (!contactForm.nombre.trim() || !contactForm.email.trim()) {
      Swal.fire("Validación", "Nombre y correo son obligatorios.", "warning");
      return;
    }

    try {
      Swal.fire({
        title: 'Enviando...',
        text: 'Por favor espere',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        }
      });

      await createSolicitud(contactForm);

      Swal.fire("Enviado", "Un asesor se pondrá en contacto contigo.", "success");
      setContactForm({
        nombre: "",
        email: "",
        telefono: "",
        ciudad: "",
        mensaje: "",
      });
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Hubo un problema al enviar la solicitud. Intenta nuevamente.", "error");
    }
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
  const fichaTecnicaUrl = resolveFichaTecnicaUrl(moto);
  const heroAnimation = heroVisible
    ? "opacity-100 translate-x-0 blur-0"
    : "opacity-0 -translate-x-24 blur-md";
  const infoAnimation = infoVisible
    ? "opacity-100 translate-x-0 blur-0"
    : "opacity-0 -translate-x-20 blur-md";
  const diferencialAnimation = diferencialVisible
    ? "opacity-100 translate-x-0 blur-0"
    : "opacity-0 -translate-x-16 blur-sm";

  const handleGaleriaPrev = () => {
    setGaleriaIndex((prev) => (prev === 0 ? galeriaItems.length - 1 : prev - 1));
  };

  const handleGaleriaNext = () => {
    setGaleriaIndex((prev) => (prev + 1) % galeriaItems.length);
  };

  return (
    <section className="bg-white text-slate-900">
      <a
        href="#agenda-asesoria"
        className="fixed right-3 md:right-5 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-2 bg-yellow-400 text-black px-3 py-4 rounded-2xl shadow-xl border border-yellow-500 hover:bg-yellow-300 transition-all duration-300 hover:scale-105"
      >
        <span className="text-[10px] font-black tracking-[0.18em] [writing-mode:vertical-rl] rotate-180">
          COTIZAR AHORA
        </span>
      </a>
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
            <div
              ref={heroRef}
              className={`absolute bottom-28 left-8 md:left-14 transition-[opacity,transform,filter] duration-[1400ms] ease-out transform-gpu will-change-[opacity,transform,filter] ${heroAnimation}`}
            >
              {moto.logo_url ? (
                <img
                  src={modelLogo}
                  alt={`${moto.nombre} logo`}
                  className="h-56 md:h-72 w-auto max-w-[820px] object-contain"
                />
              ) : (
                <p className="uppercase tracking-[0.3em] text-yellow-300 text-xs">Modelo</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 pt-16">
          <section
            ref={heroRef}
            className={`grid grid-cols-1 lg:grid-cols-[1.45fr_0.75fr] gap-12 items-center transition-[opacity,transform,filter] duration-[1400ms] ease-out transform-gpu will-change-[opacity,transform,filter] ${heroAnimation}`}
          >
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
                {fichaTecnicaUrl && (
                  <a
                    href={fichaTecnicaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ficha-tecnica-btn text-sm"
                  >
                    Ver ficha técnica (PDF)
                  </a>
                )}
              </div>
            </div>
          </section>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        {hasVideo && (
          <section
            ref={infoRef}
            className="grid grid-cols-1 lg:grid-cols-[1.35fr_0.75fr] gap-12 items-center"
          >
            <div
              className={`overflow-hidden lg:-ml-6 transition-[opacity,transform,filter] duration-[1400ms] ease-out transform-gpu will-change-[opacity,transform,filter] ${infoAnimation}`}
            >
              <img
                src={
                  moto.imagen_url ||
                  "https://images.unsplash.com/photo-1511994298241-608e28f14fde?q=80&w=1200&auto=format&fit=crop"
                }
                alt={moto.nombre}
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className={`text-center lg:text-left space-y-5 lg:pl-10 lg:translate-x-20 lg:ml-auto transition-[opacity,transform,filter] duration-[1400ms] ease-out transform-gpu will-change-[opacity,transform,filter] ${infoAnimation}`}
            >
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
                {fichaTecnicaUrl && (
                  <a
                    href={fichaTecnicaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ficha-tecnica-btn text-sm"
                  >
                    Ver ficha técnica (PDF)
                  </a>
                )}
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

        {galeriaItems.length > 0 ? (
          <section
            ref={diferencialRef}
            className="relative left-1/2 right-1/2 -mx-[50vw] w-screen px-6 lg:px-16 py-4 space-y-10"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className={`transition-[opacity,transform,filter] duration-[1400ms] ease-out transform-gpu will-change-[opacity,transform,filter] ${diferencialAnimation}`}>
                <p className="text-xs uppercase tracking-[0.3em] text-yellow-500 font-semibold">Galería</p>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900">Detalles que resaltan</h2>
              </div>
              <div className={`flex items-center gap-3 transition-[opacity,transform,filter] duration-[1400ms] ease-out transform-gpu will-change-[opacity,transform,filter] ${diferencialAnimation}`}>
                <button
                  type="button"
                  onClick={handleGaleriaPrev}
                  className="group h-14 w-20 rounded-full border border-slate-200/70 bg-white/80 backdrop-blur flex items-center justify-center gap-2 text-slate-700 hover:text-slate-900 hover:border-yellow-400 hover:shadow-lg"
                  disabled={galeriaItems.length < 2}
                >
                  <ChevronLeft size={20} />
                  <span className="h-2.5 w-2.5 rounded-full border-2 border-slate-600 group-hover:border-yellow-500" />
                  <span className="h-[2px] w-6 bg-slate-600 group-hover:bg-yellow-500" />
                </button>
                <button
                  type="button"
                  onClick={handleGaleriaNext}
                  className="group h-14 w-20 rounded-full border border-slate-200/70 bg-white/80 backdrop-blur flex items-center justify-center gap-2 text-slate-700 hover:text-slate-900 hover:border-yellow-400 hover:shadow-lg"
                  disabled={galeriaItems.length < 2}
                >
                  <span className="h-[2px] w-6 bg-slate-600 group-hover:bg-yellow-500" />
                  <span className="h-2.5 w-2.5 rounded-full border-2 border-slate-600 group-hover:border-yellow-500" />
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_0.6fr] gap-12 items-center">
              <div
                className={`transition-[opacity,transform,filter] duration-[1400ms] ease-out transform-gpu will-change-[opacity,transform,filter] ${diferencialAnimation}`}
              >
                <img
                  src={galeriaItems[galeriaIndex]?.imagen_url}
                  alt={galeriaItems[galeriaIndex]?.titulo || "Detalle del modelo"}
                  className="w-full h-[560px] md:h-[700px] object-cover"
                />
              </div>
              <div
                className={`space-y-4 text-center lg:text-left transition-[opacity,transform,filter] duration-[1400ms] ease-out transform-gpu will-change-[opacity,transform,filter] ${diferencialAnimation}`}
              >
                <h3 className="text-4xl md:text-6xl font-black text-slate-900">
                  {galeriaItems[galeriaIndex]?.titulo || "Diseño protagonista"}
                </h3>
                <p className="text-xl md:text-2xl text-slate-600">
                  {galeriaItems[galeriaIndex]?.descripcion ||
                    "Agrega una descripción para destacar lo más importante de esta imagen."}
                </p>
                {galeriaItems.length > 1 && (
                  <p className="text-sm text-slate-400">
                    Imagen {galeriaIndex + 1} de {galeriaItems.length}
                  </p>
                )}
              </div>
            </div>
          </section>
        ) : (
          <section
            ref={diferencialRef}
            className="relative left-1/2 right-1/2 -mx-[50vw] w-screen px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-[1.4fr_0.6fr] gap-12 items-center"
          >
            <div
              className={`overflow-hidden lg:-ml-8 transition-[opacity,transform,filter] duration-[1400ms] ease-out transform-gpu will-change-[opacity,transform,filter] ${diferencialAnimation}`}
            >
              <img
                src={diferencialImagen}
                alt="Detalle destacado"
                className="w-full h-[520px] md:h-[640px] object-cover"
              />
            </div>
            <div
              className={`space-y-4 text-center lg:text-left transition-[opacity,transform,filter] duration-[1400ms] ease-out transform-gpu will-change-[opacity,transform,filter] ${diferencialAnimation}`}
            >
              <h3 className="text-4xl md:text-5xl font-black text-slate-800">{diferencialTitulo}</h3>
              <p className="text-xl text-slate-600">{diferencialTexto}</p>
            </div>
          </section>
        )}

        <section id="agenda-asesoria" className="bg-[#f7f8fa] rounded-3xl p-8 scroll-mt-24">
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

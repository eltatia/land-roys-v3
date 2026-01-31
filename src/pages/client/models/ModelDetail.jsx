import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  Bike,
  Gauge,
  ShieldCheck,
  PhoneCall,
} from "lucide-react";
import Swal from "sweetalert2";
import { getMotoById } from "../../../services/Moto.service";
import { createSolicitud } from "../../../services/Solicitud.service";
import Loader from "../../../components/common/Loader";
import "./ModelDetail.css";

const isYouTubeUrl = (url) => /youtube\.com|youtu\.be/.test(url || "");

const getYouTubeEmbedUrl = (url) => {
  if (!url) return "";
  const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : "";
};

const isVideoFile = (url) => /\.(mp4|webm|ogg)$/i.test(url || "");

const ModelDetail = () => {
  const { id } = useParams();
  const [moto, setMoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nombres: "",
    telefono: "",
    email: "",
    mensaje: "",
  });

  useEffect(() => {
    const fetchMoto = async () => {
      try {
        const data = await getMotoById(id);
        setMoto(data);
      } catch (error) {
        console.error("Error cargando moto:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMoto();
  }, [id]);

  const media = useMemo(() => {
    if (!moto?.imagen_moto) return [];
    return moto.imagen_moto
      .map((item) => item.imagen)
      .filter((img) => img?.url_imagen)
      .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
  }, [moto]);

  const mainImage = media.find((img) => img.orden === 0) || media[0];
  const actionImage = media.find((img) => img.orden === 1) || media[1];
  const videoMedia = media.find((img) => img.orden === 2);

  const videoUrl = videoMedia?.url_imagen || "";
  const videoEmbed = isYouTubeUrl(videoUrl) ? getYouTubeEmbedUrl(videoUrl) : "";

  const specs = [
    { icon: <BadgeCheck size={18} />, label: "Velocidades", value: moto?.velocidades || "---" },
    { icon: <Gauge size={18} />, label: "Tanque", value: moto?.capacidad_tanque_l ? `${moto.capacidad_tanque_l} L` : "---" },
    { icon: <Gauge size={18} />, label: "Velocidad máx", value: moto?.maxima_velocidad_kmh ? `${moto.maxima_velocidad_kmh} km/h` : "---" },
    { icon: <Bike size={18} />, label: "Motor", value: moto?.motor_especificacion || "---" },
    { icon: <Gauge size={18} />, label: "Torque máx", value: moto?.torque_max_nm ? `${moto.torque_max_nm} Nm` : "---" },
    { icon: <Gauge size={18} />, label: "Cilindrada", value: moto?.cilindrada_cc ? `${moto.cilindrada_cc} cc` : "---" },
  ];

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await createSolicitud({
        nombres: formData.nombres,
        telefono: formData.telefono,
        email: formData.email || null,
        mensaje: formData.mensaje || null,
        tipo_interes: "moto",
        id_moto: moto?.id_moto,
      });

      Swal.fire({
        icon: "success",
        title: "Solicitud enviada",
        text: "Un asesor se pondrá en contacto contigo pronto.",
        timer: 2000,
        showConfirmButton: false,
      });

      setFormData({ nombres: "", telefono: "", email: "", mensaje: "" });
    } catch (error) {
      console.error("Error creando solicitud:", error);
      Swal.fire("Error", "No se pudo enviar la solicitud", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Loader />
      </div>
    );
  }

  if (!moto) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">No se encontró la motocicleta.</p>
        <Link to="/modelos" className="text-yellow-500 font-bold hover:text-yellow-600">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const hasVideo = Boolean(videoUrl);

  return (
    <div className="bg-gray-50 min-h-screen">
      {hasVideo ? (
        <section className="model-detail-hero model-detail-section">
          <div className="absolute top-6 left-6 z-20">
            <Link to="/modelos" className="inline-flex items-center gap-2 text-white/70 hover:text-yellow-400 transition-colors">
              <ArrowLeft size={18} />
              Volver a modelos
            </Link>
          </div>
          <div className="relative w-full h-[70vh] md:h-screen bg-black overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
            <div className="absolute bottom-10 left-6 md:left-16 z-20 text-white max-w-xl space-y-3">
              <h1 className="text-3xl md:text-5xl font-black italic tracking-tight">
                {moto.modelo}
              </h1>
              <p className="text-4xl md:text-6xl font-black text-yellow-400">
                Land Roys
              </p>
            </div>
            <div className="absolute inset-0">
              {isVideoFile(videoUrl) ? (
                <video
                  src={videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : videoEmbed ? (
                <iframe
                  title="Video Moto"
                  src={videoEmbed}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/60 text-sm">
                  Video no disponible
                </div>
              )}
            </div>
          </div>
        </section>
      ) : null}

      <section className="model-detail-hero model-detail-section">
        <div className="absolute top-6 left-6 z-20">
          <Link to="/modelos" className={`inline-flex items-center gap-2 ${hasVideo ? "text-white/70 hover:text-yellow-400" : "text-gray-500 hover:text-yellow-500"} transition-colors`}>
            <ArrowLeft size={18} />
            Volver a modelos
          </Link>
        </div>
        <div className="w-full min-h-screen flex items-center bg-white">
          <div className="w-full px-6 py-12 grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-10 items-center">
            <div className="relative slide-reveal">
              <img
                src={mainImage?.url_imagen || "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=1200&auto=format&fit=crop"}
                alt={moto.modelo}
                className="w-full h-[70vh] object-contain transition-transform duration-1000 hover:scale-[1.03]"
              />
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-yellow-500">
                <Bike size={24} className="icon-float" />
                <h3 className="text-xl font-black text-gray-900">Tu próxima moto</h3>
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-black italic tracking-tight text-gray-900">
                  {moto.modelo}
                </h2>
                <p className="text-gray-500 text-base md:text-lg leading-relaxed">
                  {moto.descripcion || "Potencia, estilo y tecnología en una moto diseñada para conquistar cada kilómetro."}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="bg-gray-900 text-white px-6 py-3 rounded-2xl">
                  <span className="text-xs uppercase text-white/60 tracking-widest">Precio</span>
                  <div className="text-2xl font-black">${moto.precio?.toLocaleString()}</div>
                </div>
                <div className="bg-yellow-100 text-yellow-700 px-6 py-3 rounded-2xl">
                  <span className="text-xs uppercase tracking-widest">Estado</span>
                  <div className="text-base font-black">{moto.estado}</div>
                </div>
                <button className="bg-black text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
                  Agendar prueba
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-white model-detail-section delay-3">
        <div className="max-w-7xl mx-auto px-6 py-16 min-h-[80vh] flex flex-col justify-center">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-black tracking-[0.2em] uppercase text-gray-900">Especificaciones</h3>
            <div className="w-12 h-1 bg-yellow-400 mx-auto mt-4" />
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {specs.map((spec) => (
              <div key={spec.label} className="flex flex-col items-center gap-3 bg-gray-50 p-6 rounded-3xl text-center border border-gray-100 w-[240px]">
                <div className="w-12 h-12 rounded-full bg-yellow-100 text-yellow-500 flex items-center justify-center">
                  {spec.icon}
                </div>
                <div>
                  <div className="text-xs uppercase text-gray-400 tracking-widest">{spec.label}</div>
                  <div className="text-lg font-black text-gray-900">{spec.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="model-detail-section delay-4">
        <div className="relative w-[80%] mx-auto rounded-[2.5rem] overflow-hidden shadow-2xl group">
          <img
            src={actionImage?.url_imagen || mainImage?.url_imagen || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1200&auto=format&fit=crop"}
            alt={`${moto.modelo} en acción`}
            className="w-full h-[80vh] object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent opacity-80" />
          <div className="absolute inset-0 flex items-end p-8">
            <div className="text-white max-w-md space-y-3">
              <span className="text-sm uppercase tracking-widest text-yellow-400">Diferencial</span>
              <h3 className="text-3xl font-black">Una experiencia que destaca</h3>
              <p className="text-sm text-white/70">
                Vive el desempeño y la estética que te harán sobresalir en cada ruta. Tecnología y diseño en perfecta armonía.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24 model-detail-section delay-5">
        <div className="bg-white rounded-[2.5rem] shadow-xl p-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-yellow-500">
              <PhoneCall size={24} className="icon-float" />
              <h3 className="text-2xl font-black text-gray-900">Cotiza con un asesor</h3>
            </div>
            <p className="text-gray-500 text-sm">
              Completa el formulario y recibe una atención personalizada con información de precios, financiación y disponibilidad.
            </p>
            <div className="bg-gray-50 rounded-2xl p-4 text-sm text-gray-600">
              <p className="font-bold text-gray-900">Respuesta rápida</p>
              <p>Te contactaremos en menos de 24 horas.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase text-gray-400">Nombre completo</label>
              <input
                type="text"
                name="nombres"
                required
                value={formData.nombres}
                onChange={handleInputChange}
                className="w-full mt-2 p-3 rounded-xl bg-gray-50 border border-transparent focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none"
                placeholder="Tu nombre"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-gray-400">Teléfono</label>
                <input
                  type="tel"
                  name="telefono"
                  required
                  value={formData.telefono}
                  onChange={handleInputChange}
                  className="w-full mt-2 p-3 rounded-xl bg-gray-50 border border-transparent focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none"
                  placeholder="(000) 000-0000"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-400">Correo</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full mt-2 p-3 rounded-xl bg-gray-50 border border-transparent focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none"
                  placeholder="correo@ejemplo.com"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-400">Mensaje</label>
              <textarea
                name="mensaje"
                rows="4"
                value={formData.mensaje}
                onChange={handleInputChange}
                className="w-full mt-2 p-3 rounded-xl bg-gray-50 border border-transparent focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none resize-none"
                placeholder="Quiero saber más sobre esta moto..."
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-yellow-400 text-black font-black py-3 rounded-xl hover:bg-yellow-500 transition-colors shadow-lg disabled:opacity-60"
            >
              {submitting ? "Enviando..." : "Solicitar cotización"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default ModelDetail;

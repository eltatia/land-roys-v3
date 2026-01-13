import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import "../../../styles/motos/MotoDetail.css";
import BrandLoader from "../../../components/ui/BrandLoader";
import { fetchMotoBySlug } from "../../../services/motosService";

const mapMotoData = (data) => {
  if (!data) return null;
  return {
    slug: data.slug,
    titulo: data.titulo ?? data.title ?? "",
    descripcion: data.descripcion ?? "",
    heroTagline: data.hero_tagline ?? data.heroTagline ?? "",
    heroTitle: data.hero_title ?? data.heroTitle ?? "",
    heroHighlight: data.hero_highlight ?? data.heroHighlight ?? "",
    heroDescription: data.hero_description ?? data.heroDescription ?? data.descripcion ?? "",
    priceSoles: data.price_soles ?? data.priceSoles ?? "",
    priceUsd: data.price_usd ?? data.priceUsd ?? "",
    precio: data.precio ?? null,
    power: data.power ?? "",
    torque: data.torque ?? "",
    weight: data.weight ?? "",
    displacement: data.displacement ?? data.cilindrada ?? "",
    engineType: data.engine_type ?? data.engineType ?? "",
    suspension: data.suspension ?? "",
    brakes: data.brakes ?? "",
    consumption: data.consumption ?? "",
    autonomy: data.autonomy ?? data.range ?? "",
    heroImage: data.hero_image ?? data.heroImage ?? "",
    bikeImage: data.bike_image ?? data.bikeImage ?? "",
    performanceImage: data.performance_image ?? data.performanceImage ?? "",
    imagen: data.imagen ?? "",
    galleryImages: Array.isArray(data.gallery_images)
      ? data.gallery_images
      : Array.isArray(data.galleryImages)
        ? data.galleryImages
        : [],
    videoUrls: Array.isArray(data.video_urls)
      ? data.video_urls
      : Array.isArray(data.videoUrls)
        ? data.videoUrls
        : [],
    marketingHighlights: Array.isArray(data.marketing_highlights)
      ? data.marketing_highlights
      : Array.isArray(data.marketingHighlights)
        ? data.marketingHighlights
        : [],
  };
};

const getEmbedUrl = (url) => {
  if (!url) return null;
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const videoId = url.includes("youtu.be")
      ? url.split("youtu.be/")[1]?.split(/[?&]/)[0]
      : url.split("v=")[1]?.split("&")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  }
  if (url.includes("vimeo.com")) {
    const videoId = url.split("vimeo.com/")[1]?.split(/[?&]/)[0];
    return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
  }
  return null;
};

const setMetaDescription = (description) => {
  if (!description) return;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) {
    meta.setAttribute("content", description);
  } else {
    const newMeta = document.createElement("meta");
    newMeta.name = "description";
    newMeta.content = description;
    document.head.appendChild(newMeta);
  }
};

const MotoDetail = () => {
  const { slug } = useParams();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [moto, setMoto] = useState(null);
  const motoFromState = location.state?.moto;

  useEffect(() => {
    const loadMoto = async () => {
      setIsLoading(true);
      const { data, error } = await fetchMotoBySlug(slug);
      const dataMoto = !error && data ? mapMotoData(data) : null;
      const stateMoto = mapMotoData(motoFromState);
      const combined = dataMoto || stateMoto || null;
      setMoto(combined);
      setIsLoading(false);
    };

    loadMoto();
  }, [slug, motoFromState]);

  useEffect(() => {
    if (moto?.titulo) {
      document.title = `Land Roys | ${moto.titulo}`;
      setMetaDescription(moto.heroDescription || moto.descripcion);
    }
  }, [moto]);

  if (!moto && !isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-black text-white">
        <p className="text-2xl font-bold">Modelo no encontrado</p>
        <Link className="text-primary underline" to="/motos">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const specs = useMemo(() => (moto ? [
    { label: "Potencia", value: moto.power },
    { label: "Torque", value: moto.torque },
    { label: "Peso", value: moto.weight },
    { label: "Cilindrada", value: moto.displacement },
    { label: "Tipo de motor", value: moto.engineType },
    { label: "Suspensión", value: moto.suspension },
    { label: "Frenos", value: moto.brakes },
    { label: "Consumo", value: moto.consumption },
    { label: "Autonomía", value: moto.autonomy },
  ].filter((item) => item.value) : []), [moto]);

  const highlights = moto?.marketingHighlights?.filter(Boolean) ?? [];
  const galleryImages = moto?.galleryImages?.filter(Boolean) ?? [];
  const videoUrls = moto?.videoUrls?.filter(Boolean) ?? [];
  const heroTitle = moto?.heroTitle || moto?.titulo || "";
  const heroHighlight = moto?.heroHighlight || "";
  const heroImage = moto?.heroImage || moto?.imagen || "";
  const bikeImage = moto?.bikeImage || moto?.heroImage || moto?.imagen || "";
  const performanceImage = moto?.performanceImage || moto?.heroImage || moto?.imagen || "";
  const motoNameSuffix = moto?.titulo ? moto.titulo.split(" ").pop() : "";
  const priceSoles = moto?.priceSoles || (moto?.precio ? `S/ ${moto.precio.toLocaleString("es-PE")}` : "");
  const priceUsd = moto?.priceUsd || "";

  if (isLoading) {
    return <BrandLoader />;
  }

  return (
    <div className="moto-detail-page bg-background-light dark:bg-background-dark text-white overflow-x-hidden">
      <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/40 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative size-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-accent-gold rounded-sm rotate-45 opacity-20"></div>
              <span className="material-symbols-outlined text-accent-gold text-3xl z-10" style={{ fontVariationSettings: "'FILL' 1" }}>
                shield
              </span>
              <span className="absolute z-20 text-[10px] font-black text-black mt-0.5">R</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white uppercase">
              Land <span className="text-accent-gold">Roys</span>
            </h1>
          </div>
          <nav className="hidden lg:flex items-center gap-8">
            <Link className="text-sm font-semibold text-white/90 hover:text-accent-gold transition-colors" to="/">
              Home
            </Link>
            <Link className="text-sm font-semibold text-white/90 hover:text-accent-gold transition-colors" to="/motos">
              Motos
            </Link>
            <Link className="text-sm font-semibold text-white/90 hover:text-accent-gold transition-colors" to="/repuestos">
              Repuestos
            </Link>
            <Link className="text-sm font-semibold text-white/90 hover:text-accent-gold transition-colors" to="/descuentos">
              Descuentos
            </Link>
            <Link className="text-sm font-semibold text-white/90 hover:text-accent-gold transition-colors" to="/nosotros">
              Nosotros
            </Link>
            <Link className="text-sm font-semibold text-white/90 hover:text-accent-gold transition-colors" to="/contacto">
              Contacto
            </Link>
          </nav>
          <div className="flex items-center">
            <Link
              className="bg-black text-accent-gold border border-accent-gold/50 px-8 py-2.5 rounded text-sm font-bold uppercase tracking-wider hover:bg-accent-gold hover:text-black transition-all duration-300"
              to="/contacto"
            >
              Consulta
            </Link>
          </div>
        </div>
      </header>

      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-background-dark z-10"></div>
          <div
            className="w-full h-full bg-cover bg-center scale-105"
            style={{ backgroundImage: `url('${heroImage}')` }}
          ></div>
        </div>
        <div className="relative z-20 text-center px-4 max-w-4xl">
          {moto.heroTagline && (
            <h2 className="text-primary text-lg font-bold tracking-[0.3em] uppercase mb-4">
              {moto.heroTagline}
            </h2>
          )}
          <h1 className="text-white text-6xl md:text-8xl font-black leading-none tracking-tighter uppercase mb-8">
            {heroTitle} {heroHighlight && <span className="text-stroke-gold">{heroHighlight}</span>}
          </h1>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="min-w-[200px] h-14 bg-primary text-black font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(244,192,37,0.4)] group">
              <span>Explorar {moto.titulo}</span>
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
            <button className="min-w-[200px] h-14 border border-white/30 backdrop-blur-md text-white font-bold uppercase tracking-widest rounded-lg transition-all duration-300 hover:bg-white/10 hover:border-white/50">
              Ver película
            </button>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <span className="material-symbols-outlined text-primary text-3xl">expand_more</span>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-20 bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-8 order-2 lg:order-1">
            <div>
              {moto.heroTagline && (
                <span className="text-primary font-bold tracking-widest uppercase text-sm">{moto.heroTagline}</span>
              )}
              <h2 className="text-5xl md:text-7xl font-black uppercase leading-[0.9] mt-2 mb-6">
                {moto.titulo}
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed max-w-lg">{moto.heroDescription}</p>
            </div>
            <div className="flex flex-col gap-1 p-6 border-l-4 border-primary bg-white/5 rounded-r-xl">
              <span className="text-gray-400 text-sm uppercase tracking-widest font-medium">Precio desde</span>
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-white">{priceSoles}</span>
                {priceUsd && (
                  <span className="text-xl text-primary/60 font-medium tracking-tight">{priceUsd}</span>
                )}
              </div>
            </div>
            {specs.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {specs.map((spec) => (
                  <div key={spec.label} className="p-4 rounded-lg bg-dark-gray border border-white/5 flex flex-col items-center text-center">
                    <span className="text-white text-2xl font-bold">{spec.value}</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">{spec.label}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-4 mt-4">
              <button className="px-8 py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(244,192,37,0.4)] hover:-translate-y-0.5">
                Configurar ahora
              </button>
              <button className="px-8 py-4 bg-white/10 text-white font-bold uppercase tracking-widest rounded-lg transition-all duration-300 hover:bg-white/20 hover:border-white/40 border border-white/10">
                Ficha técnica
              </button>
            </div>
          </div>
          <div className="relative order-1 lg:order-2">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-[100px] -z-10"></div>
            {motoNameSuffix && (
              <div className="absolute top-0 right-0 text-white/5 font-black text-[12rem] select-none leading-none -z-10">
                {motoNameSuffix}
              </div>
            )}
            <div
              className="w-full aspect-square md:aspect-video lg:aspect-square bg-center bg-no-repeat bg-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.6)]"
              style={{ backgroundImage: `url('${bikeImage}')` }}
            ></div>
            <div className="absolute bottom-10 right-0 glass-overlay p-4 border border-white/20 rounded-xl flex items-center gap-4">
              <div className="size-12 rounded-full bg-primary flex items-center justify-center text-black">
                <span className="material-symbols-outlined">shield</span>
              </div>
              <div>
                <p className="text-xs text-gray-300 uppercase font-bold tracking-widest">Land Roys Warranty</p>
                <p className="text-white font-bold">3 Years Coverage</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {highlights.length > 0 && (
        <section className="pb-24 px-6 lg:px-20">
          <div className="max-w-7xl mx-auto flex flex-wrap gap-6">
            {highlights.map((highlight, index) => (
              <div className="flex-1 min-w-[300px] group cursor-default" key={`${highlight}-${index}`}>
                <div className="relative flex flex-col gap-4 p-8 rounded-xl bg-dark-gray border border-white/5 hover:border-primary/40 transition-all">
                  <span className="material-symbols-outlined text-primary text-4xl">star</span>
                  <h3 className="text-xl font-bold uppercase">{highlight}</h3>
                  <p className="text-gray-400 text-sm">Detalle destacado del modelo.</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {(galleryImages.length > 0 || videoUrls.length > 0) && (
        <section className="bg-dark-gray/50 py-20 px-6">
          <div className="max-w-6xl mx-auto flex flex-col gap-12">
            {galleryImages.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold uppercase tracking-widest mb-8 text-center">
                  Galería <span className="text-primary">Land Roys</span>
                </h2>
                <div className="moto-gallery-grid">
                  {galleryImages.map((imageUrl, index) => (
                    <div key={`${imageUrl}-${index}`} className="moto-gallery-item">
                      <img src={imageUrl} alt={`${moto.titulo} ${index + 1}`} loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {videoUrls.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold uppercase tracking-widest mb-8 text-center">
                  Videos <span className="text-primary">Oficiales</span>
                </h2>
                <div className="moto-video-grid">
                  {videoUrls.map((url, index) => {
                    const embedUrl = getEmbedUrl(url);
                    return (
                      <div key={`${url}-${index}`} className="moto-video-card">
                        {embedUrl ? (
                          <iframe
                            src={embedUrl}
                            title={`${moto.titulo} video ${index + 1}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        ) : (
                          <a href={url} target="_blank" rel="noreferrer" className="moto-video-link">
                            Ver video {index + 1}
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <footer className="py-12 px-6 border-t border-white/10 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="material-symbols-outlined text-accent-gold" style={{ fontVariationSettings: "'FILL' 1" }}>
            shield
          </span>
          <span className="text-white font-bold uppercase tracking-widest">
            Land <span className="text-accent-gold">Roys</span>
          </span>
        </div>
        <p className="text-gray-500 text-xs uppercase tracking-widest">© 2024 Land Roys | High-End Excellence</p>
      </footer>
    </div>
  );
};

export default MotoDetail;

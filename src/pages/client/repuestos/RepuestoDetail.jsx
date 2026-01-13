import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import "../../../styles/repuestos/RepuestoDetail.css";
import BrandLoader from "../../../components/ui/BrandLoader";

const repuestosFallback = [
  {
    slug: "pastillas-freno-sinterizadas",
    title: "Pastillas de Freno Sinterizadas",
    heroTagline: "Performance Brake",
    heroTitle: "MAXIMUM",
    heroHighlight: "CONTROL.",
    heroDescription:
      "Pastillas sinterizadas de alto rendimiento para un frenado seguro y consistente en todo momento.",
    priceSoles: "S/ 289",
    priceUsd: "$ 75.99 USD",
    specPrimary: "Alta fricción",
    specSecondary: "Resistencia térmica",
    specTertiary: "Larga duración",
    heroImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBqD4mUPjQXP0dXUt0L_4FIqQlALrYJpJ9TgVtIQEAyvPCLYr_7PiIluoLxSblj_sao6_d4YRaDa8vEqhkHnWy3Z7059KQnVA0l6FTOtLDtZtjygYb9haX2uM8Co72cKcCudQ-PTwzdx4CB1_1li2Fz2gfkADP74BQ2LuOkgXln2-svKawh59C-bbdGgOlezRCdJwNDmblbupOIxiZ0jdTJqFO4qXv4Ao3E8MCw42Tk_lhadegjcl423Sm423PU32Q9kCewcw8Jj0A",
    performanceImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB0ns6Jhs7h91WgWOFKFl_YnkxGp_HZR7eJEOqN56uO_YNtukStiRf8Z9F51E1xPpusPJ9eYOXaEjeaghzwVKK4sJkvVbqfjnZp-QF1OgyH8kGsVaehKvYBs3Q-VVullqHvS-Dv7GLlK2Wwcb-e4FjLOeZKjEFlp6qXteOBrVAljZw1GISJzL03YA2j99d4t0hoWpg-r1bUWdLv53YoN7IkaIa3ThtfyX16f62526CEoz5HD4PGwrTx-oiGX5zra6zsYrHRTdzyrsA",
  },
  {
    slug: "filtro-aire-kn",
    title: "Filtro de Aire K&N",
    heroTagline: "High Flow Air",
    heroTitle: "PURE",
    heroHighlight: "POWER.",
    heroDescription:
      "Filtros de alto flujo que protegen el motor y mejoran la respuesta del acelerador en cada recorrido.",
    priceSoles: "S/ 205",
    priceUsd: "$ 55.00 USD",
    specPrimary: "Lavable",
    specSecondary: "Alto flujo",
    specTertiary: "Protección premium",
    heroImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCK54sE7XQqKfaXrj6o8hB9kB2UoN9lX5D9bV6y9pGSL9WUxgH3tV0vQfjZg9hECSBqKSm2m2y4m2sOonfG6Q1GODx1Qep2qZf_aq4D9Yx9r3pYADPjT9qVBScR7wqbK7oDg4nX2s8QYy6rU5zzv6f2X7oa9x2cSeN2myKpwbU8Q9t4J0R6kzQm8G4zM6kC2U2QmwbB7a5xZy2bQZmQW6a7x0EUc8pN2M2m9gPMUR0s4IKR9g",
    performanceImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC2O2S0oO7Q4R6phl8HZx7Q6q_0g0y84W6V3Z2g9gO7h8uO1b0pE9t2y2Z0wH2bK2Z5oXb4QW0R2z3w0c8G7O4y4c6s5y1p2p5g6a7b8c9d0e1f2g3h4i5j6k7l8m9n0",
  },
  {
    slug: "kit-arrastre-did",
    title: "Kit de Arrastre DID",
    heroTagline: "Drive System",
    heroTitle: "TOTAL",
    heroHighlight: "TRACTION.",
    heroDescription:
      "Kit completo de cadena y piñones para entregar la potencia de forma suave y segura.",
    priceSoles: "S/ 690",
    priceUsd: "$ 189.50 USD",
    specPrimary: "Acero reforzado",
    specSecondary: "Larga vida útil",
    specTertiary: "Compatibilidad amplia",
    heroImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCwXr9lOFn53oB0h2MTVwX8qH0wqE4dQol0ZxHk45vW6Kz8rwk1Jr3tLkq3O3l0F7Q6a3r0P1S4q9M3G8s8m4g9T4v2D2y5c1s4l7y8t4w9f4j6n1",
    performanceImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA6n7y2a1x8y7n7x4n3j2h1j5k7c8b7n6m5v4c3x2z1a0s9d8f7g6h5j4k3l2",
  },
];

const RepuestoDetail = () => {
  const { slug } = useParams();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const repuestoFromState = location.state?.repuesto;
  const fallbackRepuesto = repuestosFallback.find((item) => item.slug === slug);
  const repuesto = fallbackRepuesto || repuestoFromState ? { ...fallbackRepuesto, ...repuestoFromState } : null;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  if (!repuesto) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-black text-white">
        <p className="text-2xl font-bold">Repuesto no encontrado</p>
        <Link className="text-primary underline" to="/repuestos">
          Volver a repuestos
        </Link>
      </div>
    );
  }

  const features = [
    {
      icon: "engineering",
      title: "Calidad premium",
      description: "Componentes verificados para garantizar desempeño y durabilidad.",
    },
    {
      icon: "settings",
      title: "Compatibilidad",
      description: "Diseñado para trabajar con la línea Land Roys sin adaptaciones.",
    },
    {
      icon: "verified",
      title: "Garantía oficial",
      description: "Respaldo Land Roys y soporte técnico especializado.",
    },
  ];

  if (isLoading) {
    return <BrandLoader />;
  }

  return (
    <div className="repuesto-detail-page bg-background-light dark:bg-background-dark text-white overflow-x-hidden">
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
            style={{ backgroundImage: `url('${repuesto.heroImage}')` }}
          ></div>
        </div>
        <div className="relative z-20 text-center px-4 max-w-4xl">
          <h2 className="text-primary text-lg font-bold tracking-[0.3em] uppercase mb-4">
            {repuesto.heroTagline}
          </h2>
          <h1 className="text-white text-6xl md:text-8xl font-black leading-none tracking-tighter uppercase mb-8">
            {repuesto.heroTitle} <span className="text-stroke-gold">{repuesto.heroHighlight}</span>
          </h1>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="min-w-[200px] h-14 bg-primary text-black font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(244,192,37,0.4)] group">
              <span>Comprar ahora</span>
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
            <button className="min-w-[200px] h-14 border border-white/30 backdrop-blur-md text-white font-bold uppercase tracking-widest rounded-lg transition-all duration-300 hover:bg-white/10 hover:border-white/50">
              Ver disponibilidad
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
              <span className="text-primary font-bold tracking-widest uppercase text-sm">Accesorios oficiales</span>
              <h2 className="text-5xl md:text-7xl font-black uppercase leading-[0.9] mt-2 mb-6">{repuesto.title}</h2>
              <p className="text-gray-400 text-lg leading-relaxed max-w-lg">{repuesto.heroDescription}</p>
            </div>
            <div className="flex flex-col gap-1 p-6 border-l-4 border-primary bg-white/5 rounded-r-xl">
              <span className="text-gray-400 text-sm uppercase tracking-widest font-medium">Precio desde</span>
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-white">{repuesto.priceSoles}</span>
                <span className="text-xl text-primary/60 font-medium tracking-tight">{repuesto.priceUsd}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-dark-gray border border-white/5 flex flex-col items-center text-center gold-glow">
                <span className="text-primary text-2xl font-bold">{repuesto.specPrimary}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Benefit</span>
              </div>
              <div className="p-4 rounded-lg bg-dark-gray border border-white/5 flex flex-col items-center text-center">
                <span className="text-white text-2xl font-bold">{repuesto.specSecondary}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Performance</span>
              </div>
              <div className="p-4 rounded-lg bg-dark-gray border border-white/5 flex flex-col items-center text-center">
                <span className="text-white text-2xl font-bold">{repuesto.specTertiary}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Durabilidad</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              <button className="px-8 py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(244,192,37,0.4)] hover:-translate-y-0.5">
                Añadir al carrito
              </button>
              <button className="px-8 py-4 bg-white/10 text-white font-bold uppercase tracking-widest rounded-lg transition-all duration-300 hover:bg-white/20 hover:border-white/40 border border-white/10">
                Ver compatibilidad
              </button>
            </div>
          </div>
          <div className="relative order-1 lg:order-2">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-[100px] -z-10"></div>
            <div className="absolute top-0 right-0 text-white/5 font-black text-[12rem] select-none leading-none -z-10">
              PARTS
            </div>
            <div
              className="w-full aspect-square md:aspect-video lg:aspect-square bg-center bg-no-repeat bg-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.6)]"
              style={{ backgroundImage: `url('${repuesto.image || repuesto.heroImage}')` }}
            ></div>
            <div className="absolute bottom-10 right-0 glass-overlay p-4 border border-white/20 rounded-xl flex items-center gap-4">
              <div className="size-12 rounded-full bg-primary flex items-center justify-center text-black">
                <span className="material-symbols-outlined">verified</span>
              </div>
              <div>
                <p className="text-xs text-gray-300 uppercase font-bold tracking-widest">Land Roys Care</p>
                <p className="text-white font-bold">Garantía oficial</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-6">
          {features.map((feature) => (
            <div className="flex-1 min-w-[300px] group cursor-default" key={feature.title}>
              <div className="relative flex flex-col gap-4 p-8 rounded-xl bg-dark-gray border border-white/5 hover:border-primary/40 transition-all">
                <span className="material-symbols-outlined text-primary text-4xl">{feature.icon}</span>
                <h3 className="text-xl font-bold uppercase">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-dark-gray/50 py-20 px-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          <h2 className="text-3xl font-bold uppercase tracking-widest mb-10 text-center">
            Performance <span className="text-primary">In Motion</span>
          </h2>
          <div className="w-full relative group rounded-2xl overflow-hidden aspect-video gold-glow">
            <div
              className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
              style={{ backgroundImage: `url('${repuesto.performanceImage || repuesto.heroImage}')` }}
            ></div>
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <button className="size-24 rounded-full bg-primary flex items-center justify-center text-black hover:scale-110 transition-transform shadow-[0_0_30px_rgba(244,192,37,0.5)]">
                <span className="material-symbols-outlined !text-4xl fill-current" style={{ fontVariationSettings: "'FILL' 1" }}>
                  play_arrow
                </span>
              </button>
            </div>
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-white text-sm font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
              <span>{repuesto.title}: Feature Film</span>
              <span>02:10</span>
            </div>
          </div>
        </div>
      </section>

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

export default RepuestoDetail;

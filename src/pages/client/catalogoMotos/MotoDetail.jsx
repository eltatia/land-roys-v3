import { Link, useLocation, useParams } from "react-router-dom";
import "../../../styles/motos/MotoDetail.css";

const motosFallback = [
  {
    slug: "lr-scrambler-800",
    titulo: "LR-Scrambler 800",
    heroTagline: "The Legend Returns",
    heroTitle: "DOMINATE EVERY",
    heroHighlight: "TERRAIN.",
    heroDescription:
      "Diseñada para quienes buscan una moto versátil con alma exploradora. La Scrambler 800 combina potencia, estilo y control total.",
    priceSoles: "S/ 68,900",
    priceUsd: "$ 18,900 USD",
    power: "84 HP",
    torque: "78 Nm",
    weight: "198 kg",
    heroImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBqD4mUPjQXP0dXUt0L_4FIqQlALrYJpJ9TgVtIQEAyvPCLYr_7PiIluoLxSblj_sao6_d4YRaDa8vEqhkHnWy3Z7059KQnVA0l6FTOtLDtZtjygYb9haX2uM8Co72cKcCudQ-PTwzdx4CB1_1li2Fz2gfkADP74BQ2LuOkgXln2-svKawh59C-bbdGgOlezRCdJwNDmblbupOIxiZ0jdTJqFO4qXv4Ao3E8MCw42Tk_lhadegjcl423Sm423PU32Q9kCewcw8Jj0A",
    bikeImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBsK8i4EKg3VB8QA608j74lYMp8XYhowgEMAfJJvYoBR1rhy8GuePlp0djHoIgGJxj-F-FDrrjhZqx67p4-vJVceerJnAvEOUxIw-WKue_SymwxcDdqP9y6qYvCwHNY2rDxLHuj_m0bnfHpeqyUVEvJrBY3eUaktaRCjNvjJ4xCu1p9ZJ91yWkL_b-qfGQMidHuo3hQR0lwa4H5cGn7Lepafb2FlRnTZcrbYa2H4fJ4YGTh84CIzrvRgmCc1cW89xNLSKIXgMeD0k8",
    performanceImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB0ns6Jhs7h91WgWOFKFl_YnkxGp_HZR7eJEOqN56uO_YNtukStiRf8Z9F51E1xPpusPJ9eYOXaEjeaghzwVKK4sJkvVbqfjnZp-QF1OgyH8kGsVaehKvYBs3Q-VVullqHvS-Dv7GLlK2Wwcb-e4FjLOeZKjEFlp6qXteOBrVAljZw1GISJzL03YA2j99d4t0hoWpg-r1bUWdLv53YoN7IkaIa3ThtfyX16f62526CEoz5HD4PGwrTx-oiGX5zra6zsYrHRTdzyrsA",
  },
  {
    slug: "lr-tourer-1200",
    titulo: "LR-Tourer 1200",
    heroTagline: "Touring & Adventure",
    heroTitle: "THE ALL-NEW",
    heroHighlight: "TOURER.",
    heroDescription:
      "Una gran viajera pensada para rutas interminables. Ergonomía avanzada, electrónica de apoyo y potencia controlada.",
    priceSoles: "S/ 94,500",
    priceUsd: "$ 25,900 USD",
    power: "108 HP",
    torque: "112 Nm",
    weight: "236 kg",
    heroImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCK54sE7XQqKfaXrj6o8hB9kB2UoN9lX5D9bV6y9pGSL9WUxgH3tV0vQfjZg9hECSBqKSm2m2y4m2sOonfG6Q1GODx1Qep2qZf_aq4D9Yx9r3pYADPjT9qVBScR7wqbK7oDg4nX2s8QYy6rU5zzv6f2X7oa9x2cSeN2myKpwbU8Q9t4J0R6kzQm8G4zM6kC2U2QmwbB7a5xZy2bQZmQW6a7x0EUc8pN2M2m9gPMUR0s4IKR9g",
    bikeImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCovG1NBcp7xesFZr3HekOy2F34OCmSICyr-L-25XmqFoHd-QPlfWSI_EBvuObNsa9hZmqf69HGX9Vs9WUS2_MY2_Cu9rG8ZULj0zoPYfrRRCL5qnwJXv75qPPe7gTQ6MST0mjlgGJZVDX66nuaREkOAdqn5QltbuvPBa7DDeFNIidGoR8IZynsy60oYSqQ-0gOv6MVsUTb5Ldq5Um_dUsxOmoUGqpZkFRR7LkpRZ-LeGhZq1pOuiP5SXA3oBCQqxTR2kWwLyMhvQ",
    performanceImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC2O2S0oO7Q4R6phl8HZx7Q6q_0g0y84W6V3Z2g9gO7h8uO1b0pE9t2y2Z0wH2bK2Z5oXb4QW0R2z3w0c8G7O4y4c6s5y1p2p5g6a7b8c9d0e1f2g3h4i5j6k7l8m9n0",
  },
  {
    slug: "lr-cruiser-950",
    titulo: "LR-Cruiser 950",
    heroTagline: "Cruiser Icon",
    heroTitle: "RIDE WITH",
    heroHighlight: "STYLE.",
    heroDescription:
      "Diseño musculoso con un motor lleno de carácter. Perfecta para recorrer la ciudad y la carretera con autoridad.",
    priceSoles: "S/ 78,900",
    priceUsd: "$ 21,400 USD",
    power: "95 HP",
    torque: "96 Nm",
    weight: "220 kg",
    heroImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCwXr9lOFn53oB0h2MTVwX8qH0wqE4dQol0ZxHk45vW6Kz8rwk1Jr3tLkq3O3l0F7Q6a3r0P1S4q9M3G8s8m4g9T4v2D2y5c1s4l7y8t4w9f4j6n1",
    bikeImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD4ZQfC-3fSkG6H4Z2K7yC7s8qO5V5v7J7j9mJ3r1s3d7g6m7y7y8k2p6n4m6c5m2j6r3s2d9",
    performanceImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA6n7y2a1x8y7n7x4n3j2h1j5k7c8b7n6m5v4c3x2z1a0s9d8f7g6h5j4k3l2",
  },
];

const MotoDetail = () => {
  const { slug } = useParams();
  const location = useLocation();
  const motoFromState = location.state?.moto;
  const fallbackMoto = motosFallback.find((item) => item.slug === slug);
  const moto = fallbackMoto || motoFromState ? { ...fallbackMoto, ...motoFromState } : null;

  if (!moto) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-black text-white">
        <p className="text-2xl font-bold">Modelo no encontrado</p>
        <Link className="text-primary underline" to="/motos">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const features = [
    {
      icon: "earth_engine",
      title: "Motor de alto rendimiento",
      description: "Respuesta inmediata y entrega de potencia suave para cualquier superficie.",
    },
    {
      icon: "settings_input_component",
      title: "Control inteligente",
      description: "Asistencias electrónicas ajustables para una conducción segura.",
    },
    {
      icon: "landscape",
      title: "Suspensión reforzada",
      description: "Confort y estabilidad en rutas urbanas y off-road.",
    },
  ];

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
            style={{ backgroundImage: `url('${moto.heroImage}')` }}
          ></div>
        </div>
        <div className="relative z-20 text-center px-4 max-w-4xl">
          <h2 className="text-primary text-lg font-bold tracking-[0.3em] uppercase mb-4">
            {moto.heroTagline}
          </h2>
          <h1 className="text-white text-6xl md:text-8xl font-black leading-none tracking-tighter uppercase mb-8">
            {moto.heroTitle} <span className="text-stroke-gold">{moto.heroHighlight}</span>
          </h1>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="min-w-[200px] h-14 bg-primary text-black font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform group">
              <span>Explorar {moto.titulo}</span>
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
            <button className="min-w-[200px] h-14 border border-white/30 backdrop-blur-md text-white font-bold uppercase tracking-widest rounded-lg hover:bg-white/10 transition-colors">
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
              <span className="text-primary font-bold tracking-widest uppercase text-sm">Touring & Adventure</span>
              <h2 className="text-5xl md:text-7xl font-black uppercase leading-[0.9] mt-2 mb-6">
                {moto.titulo}
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed max-w-lg">{moto.heroDescription}</p>
            </div>
            <div className="flex flex-col gap-1 p-6 border-l-4 border-primary bg-white/5 rounded-r-xl">
              <span className="text-gray-400 text-sm uppercase tracking-widest font-medium">Precio desde</span>
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-white">{moto.priceSoles}</span>
                <span className="text-xl text-primary/60 font-medium tracking-tight">{moto.priceUsd}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-dark-gray border border-white/5 flex flex-col items-center text-center gold-glow">
                <span className="text-primary text-2xl font-bold">{moto.power}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Engine Power</span>
              </div>
              <div className="p-4 rounded-lg bg-dark-gray border border-white/5 flex flex-col items-center text-center">
                <span className="text-white text-2xl font-bold">{moto.torque}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Torque</span>
              </div>
              <div className="p-4 rounded-lg bg-dark-gray border border-white/5 flex flex-col items-center text-center">
                <span className="text-white text-2xl font-bold">{moto.weight}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Weight</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              <button className="px-8 py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-lg hover:shadow-[0_0_20px_rgba(244,192,37,0.4)] transition-all">
                Configurar ahora
              </button>
              <button className="px-8 py-4 bg-white/10 text-white font-bold uppercase tracking-widest rounded-lg hover:bg-white/20 transition-all border border-white/10">
                Ficha técnica
              </button>
            </div>
          </div>
          <div className="relative order-1 lg:order-2">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-[100px] -z-10"></div>
            <div className="absolute top-0 right-0 text-white/5 font-black text-[12rem] select-none leading-none -z-10">
              {moto.titulo.split(" ").pop()}
            </div>
            <div
              className="w-full aspect-square md:aspect-video lg:aspect-square bg-center bg-no-repeat bg-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.6)]"
              style={{ backgroundImage: `url('${moto.bikeImage || moto.heroImage}')` }}
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
              style={{ backgroundImage: `url('${moto.performanceImage || moto.heroImage}')` }}
            ></div>
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <button className="size-24 rounded-full bg-primary flex items-center justify-center text-black hover:scale-110 transition-transform shadow-[0_0_30px_rgba(244,192,37,0.5)]">
                <span className="material-symbols-outlined !text-4xl fill-current" style={{ fontVariationSettings: "'FILL' 1" }}>
                  play_arrow
                </span>
              </button>
            </div>
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-white text-sm font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
              <span>{moto.titulo}: Full Feature Film</span>
              <span>02:45</span>
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

export default MotoDetail;

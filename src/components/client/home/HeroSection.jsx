import { useState, useEffect } from "react";
import { supabase } from "../../../services/Supabase";
import "../../../styles/home/HeroSection.css";
import { Link } from "react-router-dom";

export default function HeroSection() {
  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(0);

  // ============================================
  // Cargar slides desde Supabase
  // ============================================
  useEffect(() => {
    const fetchSlides = async () => {
      const { data } = await supabase
        .from("slides_home")
        .select("*")
        .eq("visible", true)
        .order("order_index", { ascending: true });

      setSlides(data || []);
    };

    fetchSlides();
  }, []);

  const next = () => setIndex((i) => (i + 1) % slides.length);
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

  // ============================================
  // AUTOPLAY
  // ============================================
  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      setIndex(i => (i + 1) % slides.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [slides]);

  if (slides.length === 0) return null;

  return (
    <section className="relative w-full h-[90vh] overflow-hidden">

      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="w-full flex-shrink-0 relative h-full">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.img_url})` }}
            />

            <div className="absolute inset-0 bg-black/50" />

            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">{slide.title}</h1>
              <p className="max-w-xl text-lg md:text-xl opacity-90 mb-6">{slide.text}</p>

              {slide.hasbutton && (
                <Link
                  to={slide.buttonlink}
                  className="px-6 py-3 bg-[#D4AF37] hover:bg-[#b5952f] text-black rounded-md font-semibold transition-colors"
                >
                  {slide.buttontext}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      <button onClick={prev} className="hero-arrow hero-arrow-left">‹</button>
      <button onClick={next} className="hero-arrow hero-arrow-right">›</button>

    </section>
  );
}

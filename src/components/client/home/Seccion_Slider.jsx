import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { getSlides, getPublicImageUrl } from "../../../services/Slider.service";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const Seccion_Slider = () => {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const data = await getSlides();

        const slidesWithUrl = data.map((slide) => ({
          ...slide,
          url_image: getPublicImageUrl(slide.url_image),
        }));

        setSlides(slidesWithUrl);
      } catch (err) {
        console.error("Error al cargar slides:", err);
      }
    };

    fetchSlides();
  }, []);

  if (!slides.length) return null;

  return (
    <Swiper
      modules={[Autoplay, Pagination, EffectFade]}
      effect="fade"
      speed={1000}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      className="h-[600px] md:h-[85vh] w-full"
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.id}>
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.url_image})` }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Seccion_Slider;

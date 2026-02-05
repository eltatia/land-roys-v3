import React, { useEffect, useState } from "react";
import SliderList from "../../../components/admin/slider/Slider_list";
import Slider_preview from "../../../components/admin/slider/Slider_preview";
import { getSlides, addSlide, updateSlide, reorderSlides } from "../../../services/Slider.service";
import Swal from "sweetalert2";

const Slider = () => {
  const [slides, setSlides] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const data = await getSlides();
        setSlides(data);
        setSelectedId(data[0]?.id || null);
      } catch (err) {
        console.error("Error cargando slides:", err);
        Swal.fire({ icon: "error", title: "Error", text: "No se pudieron cargar los slides" });
      }
    };
    fetchSlides();
  }, []);

  const selectedSlide = slides.find(s => s.id === selectedId);

  const handleUpdateLocal = (updatedSlide) => {
    setSlides(slides.map(s => (s.id === updatedSlide.id ? updatedSlide : s)));
  };

  const handleReorder = (newSlides) => setSlides(newSlides);

  const handleSaveOrder = async (newSlides) => {
    try {
      await reorderSlides(newSlides);
      setSlides(newSlides);
      Swal.fire({ icon: "success", title: "Orden guardado", timer: 2000, showConfirmButton: false });
    } catch (err) {
      console.error("Error guardando orden:", err);
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo guardar el orden de los slides" });
    }
  };

  const handleAddSlide = async (slideData) => {
    try {
      const newSlide = {
        ...slideData,
        orden: slides.length > 0 ? Math.max(...slides.map(s => s.orden)) + 1 : 0,
      };

      const data = await addSlide(newSlide);
      setSlides([...slides, data]);
      setSelectedId(data.id);

      Swal.fire({ icon: "success", title: "¡Slide agregado!", timer: 1500, showConfirmButton: false });
    } catch (err) {
      console.error("Error creando slide:", err);
      Swal.fire({ icon: "error", title: "Error", text: err.message || "No se pudo crear el slide" });
    }
  };

  const handleSaveSlide = async (slideToSave) => {
    try {
      await updateSlide(slideToSave.id, {
        title: slideToSave.title,
        url_image: slideToSave.url_image || null,
        estado: slideToSave.estado,
      });

      setSlides(slides.map(s => (s.id === slideToSave.id ? slideToSave : s)));
      Swal.fire({ icon: "success", title: "Slide guardado", timer: 1500, showConfirmButton: false });
    } catch (err) {
      console.error("Error guardando slide:", err);
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo guardar el slide" });
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <SliderList
        slides={slides}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onReorder={handleReorder}
        onAddSlide={handleAddSlide}
        onSaveOrder={handleSaveOrder}
      />
      {selectedSlide && (
        <Slider_preview
          slide={selectedSlide}
          onSave={handleSaveSlide}
          onChange={handleUpdateLocal}
        />
      )}
    </div>
  );
};

export default Slider;

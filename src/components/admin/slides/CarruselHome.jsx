import React, { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

import {
  MdDragIndicator,
  MdVisibility,
  MdVisibilityOff,
  MdEdit,
  MdDelete,
  MdLink,
  MdSmartButton,
} from "react-icons/md";

import "./CarruselHome.css";

import {
  getSlides,
  updateSlide,
  deleteSlide,
} from "../../../services/slidesService";

import AddSlideModal from "./AddSlideModal";
import EditSlideModal from "./EditSlideModal";

export default function CarruselHome() {
  const [slides, setSlides] = useState([]);
  const [editTarget, setEditTarget] = useState(null);
  const [addOpen, setAddOpen] = useState(false);

  /* ----------------------------
     FETCH SLIDES (CORREGIDO)
  ----------------------------- */
  useEffect(() => {
    const loadSlides = async () => {
      const { data } = await getSlides();
      if (data) setSlides(data);
    };

    loadSlides();
  }, []);

  /* ----------------------------
     DRAG & DROP
  ----------------------------- */
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const reordered = [...slides];
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    setSlides(reordered);

    reordered.forEach(async (slide, idx) => {
      await updateSlide(slide.id, { order_index: idx });
    });
  };

  /* ----------------------------
     TOGGLE VISIBILITY
  ----------------------------- */
  const toggleVisible = async (slide) => {
    await updateSlide(slide.id, { visible: !slide.visible });

    const { data } = await getSlides();
    if (data) setSlides(data);
  };

  /* ----------------------------
     DELETE
  ----------------------------- */
  const handleDelete = async (slide) => {
    await deleteSlide(slide.id, slide.img_path);

    const { data } = await getSlides();
    if (data) setSlides(data);
  };

  return (
    <main className="flex-1 p-6 lg:p-8">

      <div className="flex items-center justify-between mb-8">
        <h1 className="title-admin">Gestión de Slides</h1>

        <button className="btn-add-slide" onClick={() => setAddOpen(true)}>
          Añadir Nueva Slide
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="slides">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex flex-col gap-4"
            >
              {slides.map((slide, index) => (
                <Draggable key={slide.id} draggableId={slide.id} index={index}>
                  {(drag) => (
                    <div
                      className={`slide-card ${!slide.visible ? "slide-hidden" : ""}`}
                      ref={drag.innerRef}
                      {...drag.draggableProps}
                    >
                      <div className="flex items-center gap-4">

                        {/* Handler */}
                        <button className="drag-btn" {...drag.dragHandleProps}>
                          <MdDragIndicator size={22} />
                        </button>

                        {/* Imagen */}
                        <div
                          className="slide-image"
                          style={{ backgroundImage: `url(${slide.img_url})` }}
                        />

                        {/* Texto */}
                        <div className="flex-1">
                          <p className="slide-title">{slide.title}</p>
                          <p className="slide-description">{slide.text}</p>

                          {/* Indicadores */}
                          <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                            {slide.hasbutton ? (
                              <>
                                <MdSmartButton size={18} />
                                <span>{slide.buttontext}</span>

                                <MdLink size={18} />
                                <span>{slide.buttonlink}</span>
                              </>
                            ) : (
                              <span className="italic opacity-60">Sin botón</span>
                            )}
                          </div>
                        </div>

                        {/* Botones */}
                        <div className="flex items-center gap-4">
                          <button onClick={() => toggleVisible(slide)}>
                            {slide.visible ? <MdVisibility /> : <MdVisibilityOff />}
                          </button>

                          <button onClick={() => setEditTarget(slide)}>
                            <MdEdit />
                          </button>

                          <button onClick={() => handleDelete(slide)}>
                            <MdDelete />
                          </button>
                        </div>

                      </div>
                    </div>
                  )}
                </Draggable>
              ))}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* MODALES */}
      {addOpen && (
        <AddSlideModal
          onClose={() => setAddOpen(false)}
          onCreated={async () => {
            const { data } = await getSlides();
            if (data) setSlides(data);
          }}
          orderIndex={slides.length}
        />
      )}

      {editTarget && (
        <EditSlideModal
          slide={editTarget}
          onClose={() => setEditTarget(null)}
          onUpdated={async () => {
            const { data } = await getSlides();
            if (data) setSlides(data);
          }}
        />
      )}

    </main>
  );
}


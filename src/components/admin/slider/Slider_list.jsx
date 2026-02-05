import React, { useEffect, useState } from "react";
import { Plus, GripVertical, CheckCircle2, Save } from "lucide-react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SlideModal from "./Slide_modal";
import { getPublicImageUrl } from "../../../util/images.js";

const SortableItem = ({ slide, selected, onSelect }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: slide.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`group flex items-center p-3 rounded-2xl border-2 cursor-pointer
        ${selected ? "border-yellow-400 bg-white" : "border-gray-50 bg-gray-50/30 hover:border-gray-200"}`}
    >
      <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
        {slide.url_image ? (
          <img src={getPublicImageUrl(slide.url_image)} alt={slide.title || "Slide"} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400 text-[10px]">Sin imagen</span>
        )}
      </div>
      <div className="ml-4 flex-1">
        <h3 className="text-sm font-bold text-slate-800">{slide.title}</h3>
        <p className="text-[10px] text-gray-400 font-medium uppercase">{slide.estado ? "Activo" : "Inactivo"}</p>
      </div>
      <div {...attributes} {...listeners}>
        {selected ? <CheckCircle2 size={18} className="text-yellow-400" /> : <GripVertical size={18} className="text-gray-300" />}
      </div>
    </div>
  );
};

const Slider_list = ({ slides, onReorder, onSaveOrder, onAddSlide, selectedId, onSelect }) => {
  const [localSlides, setLocalSlides] = useState(slides || []);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => setLocalSlides(slides || []), [slides]);

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = localSlides.findIndex(i => i.id === active.id);
    const newIndex = localSlides.findIndex(i => i.id === over.id);
    const newSlides = arrayMove(localSlides, oldIndex, newIndex);
    setLocalSlides(newSlides);
    if (onReorder) onReorder(newSlides);
  };

  const handleAddSlide = () => {
    if (localSlides.length >= 5) return;
    setModalOpen(true);
  };

  const handleSaveSlide = (slideData) => {
    if (onAddSlide) onAddSlide(slideData);
    setModalOpen(false);
  };

  return (
    <div className="p-6 bg-white border-r border-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Active Slides</h2>
          <p className="text-xs text-gray-400">Solo se podrán crear 5 carruseles de anuncio</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAddSlide}
            disabled={localSlides.length >= 5}
            className={`flex items-center gap-1 text-[10px] font-black px-3 py-2 rounded-full
              ${localSlides.length >= 5 ? "bg-gray-300 text-gray-700 cursor-not-allowed" : "bg-yellow-400 text-black"}`}
          >
            <Plus size={14} /> New Slide
          </button>
          <button onClick={() => onSaveOrder(localSlides)} className="flex items-center gap-1 bg-green-500 text-white text-[10px] font-black px-3 py-2 rounded-full">
            <Save size={14} /> Guardar Orden
          </button>
        </div>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={localSlides.map(s => s.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {localSlides.map(slide => (
              <SortableItem key={slide.id} slide={slide} selected={slide.id === selectedId} onSelect={() => onSelect(slide.id)} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {modalOpen && <SlideModal onClose={() => setModalOpen(false)} onSave={handleSaveSlide} />}
    </div>
  );
};

export default Slider_list;

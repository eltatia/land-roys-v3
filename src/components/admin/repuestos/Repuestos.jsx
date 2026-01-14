import React, { useEffect, useState } from "react";
import { supabase } from "../../../services/Supabase";
import { uploadRepuestoImage, uploadRepuestoImages } from "../../../services/repuestosService";
import { MdAdd, MdEdit, MdDelete, MdClose, MdImage, MdUploadFile } from "react-icons/md";
import Swal from "sweetalert2";

const emptyForm = {
  title: "",
  slug: "",
  description: "",
  price: "",
  priceSoles: "",
  priceUsd: "",
  specPrimary: "",
  specSecondary: "",
  specTertiary: "",
  heroTagline: "",
  heroTitle: "",
  heroHighlight: "",
  heroDescription: "",
  heroImage: "",
  performanceImage: "",
  videoUrls: "",
  marketingHighlights: "",
  active: true,
};

const buildSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");

const RepuestosAdmin = () => {
  const [repuestos, setRepuestos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [heroFile, setHeroFile] = useState(null);
  const [performanceFile, setPerformanceFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryUrls, setGalleryUrls] = useState([]);

  useEffect(() => {
    fetchRepuestos();
  }, []);

  const fetchRepuestos = async () => {
    try {
      const { data, error } = await supabase
        .from("repuestos")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setRepuestos(data || []);
    } catch (error) {
      console.error("Error fetching repuestos:", error);
      Swal.fire("Error", "No se pudieron cargar los repuestos", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleHeroFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setHeroFile(selectedFile);
      setFormData((prev) => ({ ...prev, heroImage: URL.createObjectURL(selectedFile) }));
    }
  };

  const handlePerformanceFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setPerformanceFile(selectedFile);
      setFormData((prev) => ({ ...prev, performanceImage: URL.createObjectURL(selectedFile) }));
    }
  };

  const handleGalleryFilesChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length) {
      setGalleryFiles(selectedFiles);
      setGalleryUrls(selectedFiles.map((item) => URL.createObjectURL(item)));
    }
  };

  const openModal = (repuesto = null) => {
    if (repuesto) {
      setEditingId(repuesto.id);
      setFormData({
        title: repuesto.title ?? "",
        slug: repuesto.slug ?? "",
        description: repuesto.description ?? "",
        price: repuesto.price ?? "",
        priceSoles: repuesto.price_soles ?? "",
        priceUsd: repuesto.price_usd ?? "",
        specPrimary: repuesto.spec_primary ?? "",
        specSecondary: repuesto.spec_secondary ?? "",
        specTertiary: repuesto.spec_tertiary ?? "",
        heroTagline: repuesto.hero_tagline ?? "",
        heroTitle: repuesto.hero_title ?? "",
        heroHighlight: repuesto.hero_highlight ?? "",
        heroDescription: repuesto.hero_description ?? "",
        heroImage: repuesto.hero_image ?? "",
        performanceImage: repuesto.performance_image ?? "",
        videoUrls: Array.isArray(repuesto.video_urls) ? repuesto.video_urls.join("\n") : "",
        marketingHighlights: Array.isArray(repuesto.marketing_highlights)
          ? repuesto.marketing_highlights.join("\n")
          : "",
        active: repuesto.active,
      });
      setPreviewUrl(repuesto.image ?? "");
      setGalleryUrls(Array.isArray(repuesto.gallery_images) ? repuesto.gallery_images : []);
    } else {
      setEditingId(null);
      setFormData(emptyForm);
      setPreviewUrl("");
      setGalleryUrls([]);
    }
    setFile(null);
    setHeroFile(null);
    setPerformanceFile(null);
    setGalleryFiles([]);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData(emptyForm);
    setFile(null);
    setHeroFile(null);
    setPerformanceFile(null);
    setGalleryFiles([]);
    setGalleryUrls([]);
    setPreviewUrl("");
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      Swal.fire("Error", "El título es obligatorio.", "error");
      return false;
    }
    if (!formData.description.trim()) {
      Swal.fire("Error", "La descripción es obligatoria.", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      Swal.showLoading();

      let imageUrl = previewUrl;
      let heroImageUrl = formData.heroImage;
      let performanceImageUrl = formData.performanceImage;
      let galleryImageUrls = galleryUrls;

      if (file) {
        const { data, error } = await uploadRepuestoImage(file);
        if (error) throw new Error("Error al subir la imagen principal.");
        imageUrl = data.url;
      }

      if (heroFile) {
        const { data, error } = await uploadRepuestoImage(heroFile);
        if (error) throw new Error("Error al subir la imagen hero.");
        heroImageUrl = data.url;
      }

      if (performanceFile) {
        const { data, error } = await uploadRepuestoImage(performanceFile);
        if (error) throw new Error("Error al subir la imagen de performance.");
        performanceImageUrl = data.url;
      }

      if (galleryFiles.length) {
        const { data, error } = await uploadRepuestoImages(galleryFiles);
        if (error) throw new Error("Error al subir la galería.");
        galleryImageUrls = data.map((item) => item.url);
      }

      const payload = {
        title: formData.title,
        slug: formData.slug || buildSlug(formData.title),
        description: formData.description,
        price: formData.price ? parseFloat(formData.price) : null,
        image: imageUrl,
        hero_tagline: formData.heroTagline,
        hero_title: formData.heroTitle,
        hero_highlight: formData.heroHighlight,
        hero_description: formData.heroDescription,
        price_soles: formData.priceSoles,
        price_usd: formData.priceUsd,
        spec_primary: formData.specPrimary,
        spec_secondary: formData.specSecondary,
        spec_tertiary: formData.specTertiary,
        hero_image: heroImageUrl,
        performance_image: performanceImageUrl,
        gallery_images: galleryImageUrls,
        video_urls: formData.videoUrls
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
        marketing_highlights: formData.marketingHighlights
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
        active: formData.active,
      };

      if (editingId) {
        const { error } = await supabase.from("repuestos").update(payload).eq("id", editingId);
        if (error) throw error;
        Swal.fire("Actualizado", "Repuesto actualizado correctamente", "success");
      } else {
        const { error } = await supabase.from("repuestos").insert([payload]);
        if (error) throw error;
        Swal.fire("Creado", "Repuesto creado correctamente", "success");
      }

      closeModal();
      fetchRepuestos();
    } catch (error) {
      console.error("Error saving repuesto:", error);
      Swal.fire("Error", error.message || "No se pudo guardar el repuesto", "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar repuesto?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const { error } = await supabase.from("repuestos").delete().eq("id", id);
        if (error) throw error;
        setRepuestos((prev) => prev.filter((item) => item.id !== id));
        Swal.fire("Eliminado", "El repuesto ha sido eliminado", "success");
      } catch (error) {
        console.error("Error deleting repuesto:", error);
        Swal.fire("Error", "No se pudo eliminar", "error");
      }
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-display font-bold text-gray-900 tracking-tight">Repuestos</h1>
          <p className="text-gray-500 mt-2">Gestiona el catálogo de repuestos</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <MdAdd size={20} />
          Nuevo Repuesto
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      ) : repuestos.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-400 text-lg">No hay repuestos registrados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {repuestos.map((repuesto) => (
            <div
              key={repuesto.id}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-64 overflow-hidden bg-gray-100">
                {repuesto.image ? (
                  <img
                    src={repuesto.image}
                    alt={repuesto.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <MdImage size={48} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-sm">
                  <button
                    onClick={() => openModal(repuesto)}
                    className="bg-white text-black p-3 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
                    title="Editar"
                  >
                    <MdEdit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(repuesto.id)}
                    className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    title="Eliminar"
                  >
                    <MdDelete size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{repuesto.title}</h3>
                  <span className="font-mono text-lg font-medium text-gray-600">
                    ${repuesto.price?.toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                  {repuesto.description}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${repuesto.active ? "bg-green-500" : "bg-gray-300"}`}></span>
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {repuesto.active ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden transform transition-all scale-100 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">
                {editingId ? "Editar Repuesto" : "Nuevo Repuesto"}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <MdClose size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Repuesto</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none text-gray-900 placeholder-gray-400"
                  placeholder="Ej. Pastillas de freno"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none text-gray-900 placeholder-gray-400"
                  placeholder="pastillas-freno"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Precio</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none text-gray-900 placeholder-gray-400"
                  placeholder="0.00"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Precio en soles</label>
                  <input
                    type="text"
                    name="priceSoles"
                    value={formData.priceSoles}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none text-gray-900 placeholder-gray-400"
                    placeholder="S/ 289"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Precio en USD</label>
                  <input
                    type="text"
                    name="priceUsd"
                    value={formData.priceUsd}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none text-gray-900 placeholder-gray-400"
                    placeholder="$ 75.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Spec 1</label>
                  <input
                    type="text"
                    name="specPrimary"
                    value={formData.specPrimary}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none text-gray-900 placeholder-gray-400"
                    placeholder="Alta fricción"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Spec 2</label>
                  <input
                    type="text"
                    name="specSecondary"
                    value={formData.specSecondary}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none text-gray-900 placeholder-gray-400"
                    placeholder="Resistencia térmica"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Spec 3</label>
                  <input
                    type="text"
                    name="specTertiary"
                    value={formData.specTertiary}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none text-gray-900 placeholder-gray-400"
                    placeholder="Larga duración"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Imagen principal</label>
                <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-4 hover:border-black/20 transition-colors bg-gray-50/50">
                  {previewUrl ? (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          setPreviewUrl("");
                        }}
                        className="absolute top-2 right-2 bg-white/90 p-1 rounded-full text-red-500 shadow-sm hover:bg-white"
                      >
                        <MdClose size={20} />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                        <MdUploadFile size={24} />
                      </div>
                      <p className="text-sm text-gray-500 font-medium">Click para subir imagen</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG hasta 5MB</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer ${previewUrl ? "hidden" : ""}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Imagen Hero</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeroFileChange}
                  className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-700"
                />
                {formData.heroImage && <p className="text-xs text-gray-500 mt-1">Imagen hero cargada</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Imagen Performance</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePerformanceFileChange}
                  className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-700"
                />
                {formData.performanceImage && (
                  <p className="text-xs text-gray-500 mt-1">Imagen performance cargada</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Galería (múltiples imágenes)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryFilesChange}
                  className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-700"
                />
                {galleryUrls.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">{galleryUrls.length} imágenes cargadas</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none text-gray-900 placeholder-gray-400 resize-none"
                  placeholder="Descripción del repuesto"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hero Tagline</label>
                <input
                  type="text"
                  name="heroTagline"
                  value={formData.heroTagline}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none text-gray-900 placeholder-gray-400"
                  placeholder="Performance Brake"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hero Title</label>
                  <input
                    type="text"
                    name="heroTitle"
                    value={formData.heroTitle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none text-gray-900 placeholder-gray-400"
                    placeholder="MAXIMUM"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hero Highlight</label>
                  <input
                    type="text"
                    name="heroHighlight"
                    value={formData.heroHighlight}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none text-gray-900 placeholder-gray-400"
                    placeholder="CONTROL"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hero Description</label>
                <textarea
                  name="heroDescription"
                  value={formData.heroDescription}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none text-gray-900 placeholder-gray-400 resize-none"
                  placeholder="Descripción principal"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Highlights de marketing (uno por línea)</label>
                <textarea
                  name="marketingHighlights"
                  value={formData.marketingHighlights}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none text-gray-900 placeholder-gray-400 resize-none"
                  placeholder="Resistencia premium\nCompatibilidad total"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Videos (uno por línea)</label>
                <textarea
                  name="videoUrls"
                  value={formData.videoUrls}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none text-gray-900 placeholder-gray-400 resize-none"
                  placeholder="https://youtu.be/..."
                ></textarea>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-black rounded border-gray-300 focus:ring-black"
                  id="activeRepuestoCheck"
                />
                <label htmlFor="activeRepuestoCheck" className="text-sm text-gray-600 cursor-pointer select-none">
                  Repuesto visible en catálogo
                </label>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-900 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                >
                  {editingId ? "Guardar Cambios" : "Crear Repuesto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepuestosAdmin;

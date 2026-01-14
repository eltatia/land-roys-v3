import React, { useState, useEffect } from 'react';
import { supabase } from '../../../services/Supabase';
import { uploadMotoImage, uploadMotoImages } from '../../../services/motosService';
import { MdAdd, MdEdit, MdDelete, MdClose, MdImage, MdUploadFile } from 'react-icons/md';
import Swal from 'sweetalert2';

const Modelos = () => {
    const [motos, setMotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Form States
    const [formData, setFormData] = useState({
        titulo: '',
        slug: '',
        descripcion: '',
        precio: '',
        priceSoles: '',
        priceUsd: '',
        power: '',
        torque: '',
        weight: '',
        displacement: '',
        engineType: '',
        suspension: '',
        brakes: '',
        consumption: '',
        autonomia: '',
        heroTagline: '',
        heroTitle: '',
        heroHighlight: '',
        heroDescription: '',
        heroImage: '',
        bikeImage: '',
        performanceImage: '',
        videoUrls: '',
        marketingHighlights: '',
        active: true
    });
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [heroFile, setHeroFile] = useState(null);
    const [bikeFile, setBikeFile] = useState(null);
    const [performanceFile, setPerformanceFile] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [galleryUrls, setGalleryUrls] = useState([]);

    useEffect(() => {
        fetchMotos();
    }, []);

    const fetchMotos = async () => {
        try {
            const { data, error } = await supabase
                .from('motos')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setMotos(data);
        } catch (error) {
            console.error('Error fetching motos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleHeroFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setHeroFile(selectedFile);
            setFormData((prev) => ({ ...prev, heroImage: URL.createObjectURL(selectedFile) }));
        }
    };

    const handleBikeFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setBikeFile(selectedFile);
            setFormData((prev) => ({ ...prev, bikeImage: URL.createObjectURL(selectedFile) }));
        }
    };

    const handlePerformanceFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setPerformanceFile(selectedFile);
            setFormData((prev) => ({ ...prev, performanceImage: URL.createObjectURL(selectedFile) }));
        }
    };

    const handleGalleryFilesChange = (e) => {
        const selectedFiles = Array.from(e.target.files || []);
        if (selectedFiles.length) {
            setGalleryFiles(selectedFiles);
            setGalleryUrls(selectedFiles.map((file) => URL.createObjectURL(file)));
        }
    };

    const openModal = (moto = null) => {
        if (moto) {
            setEditingId(moto.id);
            setFormData({
                titulo: moto.titulo,
                slug: moto.slug || '',
                descripcion: moto.descripcion || '',
                precio: moto.precio || '',
                priceSoles: moto.price_soles || '',
                priceUsd: moto.price_usd || '',
                power: moto.power || '',
                torque: moto.torque || '',
                weight: moto.weight || '',
                displacement: moto.displacement || moto.cilindrada || '',
                engineType: moto.engine_type || '',
                suspension: moto.suspension || '',
                brakes: moto.brakes || '',
                consumption: moto.consumption || '',
                autonomia: moto.autonomia || '',
                heroTagline: moto.hero_tagline || '',
                heroTitle: moto.hero_title || '',
                heroHighlight: moto.hero_highlight || '',
                heroDescription: moto.hero_description || '',
                heroImage: moto.hero_image || '',
                bikeImage: moto.bike_image || '',
                performanceImage: moto.performance_image || '',
                videoUrls: Array.isArray(moto.video_urls) ? moto.video_urls.join('\n') : '',
                marketingHighlights: Array.isArray(moto.marketing_highlights) ? moto.marketing_highlights.join('\n') : '',
                active: moto.active
            });
            setPreviewUrl(moto.imagen || '');
            setFile(null);
            setHeroFile(null);
            setBikeFile(null);
            setPerformanceFile(null);
            setGalleryFiles([]);
            setGalleryUrls(Array.isArray(moto.gallery_images) ? moto.gallery_images : []);
        } else {
            setEditingId(null);
            setFormData({
                titulo: '',
                slug: '',
                descripcion: '',
                precio: '',
                priceSoles: '',
                priceUsd: '',
                power: '',
                torque: '',
                weight: '',
                displacement: '',
                engineType: '',
                suspension: '',
                brakes: '',
                consumption: '',
                autonomia: '',
                heroTagline: '',
                heroTitle: '',
                heroHighlight: '',
                heroDescription: '',
                heroImage: '',
                bikeImage: '',
                performanceImage: '',
                videoUrls: '',
                marketingHighlights: '',
                active: true
            });
            setPreviewUrl('');
            setFile(null);
            setHeroFile(null);
            setBikeFile(null);
            setPerformanceFile(null);
            setGalleryFiles([]);
            setGalleryUrls([]);
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingId(null);
        setFile(null);
        setHeroFile(null);
        setBikeFile(null);
        setPerformanceFile(null);
        setGalleryFiles([]);
        setGalleryUrls([]);
        setPreviewUrl('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!formData.titulo.trim()) {
                Swal.fire('Error', 'El nombre del modelo es obligatorio', 'error');
                return;
            }
            if (!formData.descripcion.trim()) {
                Swal.fire('Error', 'La descripción es obligatoria', 'error');
                return;
            }
            Swal.showLoading();

            let imageUrl = previewUrl;
            let heroImageUrl = formData.heroImage;
            let bikeImageUrl = formData.bikeImage;
            let performanceImageUrl = formData.performanceImage;
            let galleryImageUrls = galleryUrls;

            // 1. Subir imagen si hay archivo nuevo
            if (file) {
                const { data, error } = await uploadMotoImage(file);
                if (error) {
                    throw new Error("Error al subir la imagen. Verifica que el bucket 'motos' exista y sea público.");
                }
                imageUrl = data.url;
            }

            if (heroFile) {
                const { data, error } = await uploadMotoImage(heroFile);
                if (error) {
                    throw new Error("Error al subir la imagen hero.");
                }
                heroImageUrl = data.url;
            }

            if (bikeFile) {
                const { data, error } = await uploadMotoImage(bikeFile);
                if (error) {
                    throw new Error("Error al subir la imagen de la moto.");
                }
                bikeImageUrl = data.url;
            }

            if (performanceFile) {
                const { data, error } = await uploadMotoImage(performanceFile);
                if (error) {
                    throw new Error("Error al subir la imagen de performance.");
                }
                performanceImageUrl = data.url;
            }

            if (galleryFiles.length) {
                const { data, error } = await uploadMotoImages(galleryFiles);
                if (error) {
                    throw new Error("Error al subir la galería de imágenes.");
                }
                galleryImageUrls = data.map((item) => item.url);
            }

            const motoData = {
                titulo: formData.titulo,
                slug: formData.slug || formData.titulo.toLowerCase().replace(/\s+/g, "-"),
                descripcion: formData.descripcion,
                precio: formData.precio ? parseFloat(formData.precio) : null,
                imagen: imageUrl, // Guardamos la URL (nueva o existente)
                hero_tagline: formData.heroTagline,
                hero_title: formData.heroTitle,
                hero_highlight: formData.heroHighlight,
                hero_description: formData.heroDescription,
                price_soles: formData.priceSoles,
                price_usd: formData.priceUsd,
                power: formData.power,
                torque: formData.torque,
                weight: formData.weight,
                displacement: formData.displacement,
                engine_type: formData.engineType,
                suspension: formData.suspension,
                brakes: formData.brakes,
                consumption: formData.consumption,
                autonomia: formData.autonomia,
                hero_image: heroImageUrl,
                bike_image: bikeImageUrl,
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
                active: formData.active
            };

            if (editingId) {
                const { error } = await supabase
                    .from('motos')
                    .update(motoData)
                    .eq('id', editingId);
                if (error) throw error;
                Swal.fire('Actualizado', 'Modelo actualizado correctamente', 'success');
            } else {
                const { error } = await supabase
                    .from('motos')
                    .insert([motoData]);
                if (error) throw error;
                Swal.fire('Creado', 'Modelo creado correctamente', 'success');
            }

            closeModal();
            fetchMotos();
        } catch (error) {
            console.error('Error saving moto:', error);
            Swal.fire('Error', error.message || 'No se pudo guardar el modelo', 'error');
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Eliminar modelo?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#000',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                const { error } = await supabase
                    .from('motos')
                    .delete()
                    .eq('id', id);

                if (error) throw error;

                setMotos(prev => prev.filter(m => m.id !== id));
                Swal.fire('Eliminado', 'El modelo ha sido eliminado', 'success');
            } catch (error) {
                console.error('Error deleting moto:', error);
                Swal.fire('Error', 'No se pudo eliminar', 'error');
            }
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header Minimalista */}
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="text-4xl font-display font-bold text-gray-900 tracking-tight">Modelos</h1>
                    <p className="text-gray-500 mt-2">Gestiona el catálogo de motocicletas</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    <MdAdd size={20} />
                    Nuevo Modelo
                </button>
            </div>

            {/* Grid de Tarjetas */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                </div>
            ) : motos.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-400 text-lg">No hay modelos registrados</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {motos.map((moto) => (
                        <div key={moto.id} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                            {/* Imagen con Overlay de Acciones */}
                            <div className="relative h-64 overflow-hidden bg-gray-100">
                                {moto.imagen ? (
                                    <img
                                        src={moto.imagen}
                                        alt={moto.titulo}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <MdImage size={48} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-sm">
                                    <button
                                        onClick={() => openModal(moto)}
                                        className="bg-white text-black p-3 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
                                        title="Editar"
                                    >
                                        <MdEdit size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(moto.id)}
                                        className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                        title="Eliminar"
                                    >
                                        <MdDelete size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Contenido */}
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">{moto.titulo}</h3>
                                    <span className="font-mono text-lg font-medium text-gray-600">
                                        ${moto.precio?.toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                                    {moto.descripcion}
                                </p>
                                <div className="mt-4 flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${moto.active ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        {moto.active ? 'Activo' : 'Inactivo'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Minimalista */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden transform transition-all scale-100 max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingId ? 'Editar Modelo' : 'Nuevo Modelo'}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <MdClose size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Modelo</label>
                                <input
                                    type="text"
                                    name="titulo"
                                    value={formData.titulo}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none text-gray-900 placeholder-gray-400"
                                    placeholder="Ej. LR-Scrambler 800"
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
                                    placeholder="lr-scrambler-800"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Precio</label>
                                <input
                                    type="number"
                                    name="precio"
                                    value={formData.precio}
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
                                        placeholder="S/ 68,900"
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
                                        placeholder="$ 18,900 USD"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Potencia</label>
                                    <input
                                        type="text"
                                        name="power"
                                        value={formData.power}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none text-gray-900 placeholder-gray-400"
                                        placeholder="84 HP"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Torque</label>
                                    <input
                                        type="text"
                                        name="torque"
                                        value={formData.torque}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none text-gray-900 placeholder-gray-400"
                                        placeholder="78 Nm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Peso</label>
                                    <input
                                        type="text"
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none text-gray-900 placeholder-gray-400"
                                        placeholder="198 kg"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Cilindrada</label>
                                    <input
                                        type="text"
                                        name="displacement"
                                        value={formData.displacement}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none text-gray-900 placeholder-gray-400"
                                        placeholder="798 cc"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de motor</label>
                                    <input
                                        type="text"
                                        name="engineType"
                                        value={formData.engineType}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none text-gray-900 placeholder-gray-400"
                                        placeholder="Bicilíndrico, 4 tiempos"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Suspensión</label>
                                    <input
                                        type="text"
                                        name="suspension"
                                        value={formData.suspension}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none text-gray-900 placeholder-gray-400"
                                        placeholder="Horquilla invertida"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Frenos</label>
                                    <input
                                        type="text"
                                        name="brakes"
                                        value={formData.brakes}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none text-gray-900 placeholder-gray-400"
                                        placeholder="ABS, doble disco"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Consumo</label>
                                    <input
                                        type="text"
                                        name="consumption"
                                        value={formData.consumption}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none text-gray-900 placeholder-gray-400"
                                        placeholder="4.8 L/100 km"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Autonomía</label>
                                    <input
                                        type="text"
                                        name="autonomia"
                                        value={formData.autonomia}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none text-gray-900 placeholder-gray-400"
                                        placeholder="350 km"
                                    />
                                </div>
                            </div>

                            {/* Upload de Imagen */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Imagen</label>
                                <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-4 hover:border-black/20 transition-colors bg-gray-50/50">
                                    {previewUrl ? (
                                        <div className="relative w-full h-48 rounded-lg overflow-hidden">
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => { setFile(null); setPreviewUrl(''); }}
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
                                        className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer ${previewUrl ? 'hidden' : ''}`}
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
                                {formData.heroImage && (
                                    <p className="text-xs text-gray-500 mt-1">Imagen hero cargada</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Imagen de Moto</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleBikeFileChange}
                                    className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-700"
                                />
                                {formData.bikeImage && (
                                    <p className="text-xs text-gray-500 mt-1">Imagen de moto cargada</p>
                                )}
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
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none text-gray-900 placeholder-gray-400 resize-none"
                                    placeholder="Breve descripción..."
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
                                    placeholder="The Legend Returns"
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
                                        placeholder="DOMINATE EVERY"
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
                                        placeholder="TERRAIN."
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
                                    placeholder="Descripción principal del hero."
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
                                    placeholder="Tecnología Adventure\nControl total en ruta\nDiseño premium"
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
                                    id="activeCheck"
                                />
                                <label htmlFor="activeCheck" className="text-sm text-gray-600 cursor-pointer select-none">
                                    Modelo visible en catálogo
                                </label>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-900 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                                >
                                    {editingId ? 'Guardar Cambios' : 'Crear Modelo'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Modelos;

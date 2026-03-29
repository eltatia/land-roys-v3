import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Search, Link as LinkIcon, Image as ImageIcon, Upload } from 'lucide-react';
import { BlogService } from '../../../services/Blog.service';
import Swal from 'sweetalert2';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const BlogGestion = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);

    const [heroImage, setHeroImage] = useState('');
    const [uploadingHero, setUploadingHero] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isDraggingHero, setIsDraggingHero] = useState(false);
    const heroFileInputRef = useRef(null);
    const coverFileInputRef = useRef(null);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        category: 'Noticias',
        excerpt: '',
        content: '',
        cover_image: '',
        is_published: true
    });

    const categorias = ['Noticias', 'Eventos', 'Tips & Guías', 'Mantenimiento'];

    useEffect(() => {
        fetchPosts();
        fetchHeroImage();
    }, []);

    const fetchHeroImage = async () => {
        const url = await BlogService.getHeroImage();
        if (url) setHeroImage(url);
    };

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const data = await BlogService.getAllPosts();
            setPosts(data);
        } catch (error) {
            Swal.fire('Error', 'No se pudieron cargar los posts', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (post = null) => {
        if (post) {
            setCurrentPost(post);
            setFormData({
                title: post.title,
                slug: post.slug || '',
                category: post.category,
                excerpt: post.excerpt || '',
                content: post.content || '',
                cover_image: post.cover_image || '',
                is_published: post.is_published
            });
        } else {
            setCurrentPost(null);
            setFormData({
                title: '',
                slug: '',
                category: 'Noticias',
                excerpt: '',
                content: '',
                cover_image: '',
                is_published: true
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentPost(null);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.content) {
            Swal.fire('Atención', 'El título y contenido son obligatorios', 'warning');
            return;
        }

        try {
            if (currentPost) {
                await BlogService.updatePost(currentPost.id, formData);
                Swal.fire('Éxito', 'Post actualizado correctamente', 'success');
            } else {
                await BlogService.createPost(formData);
                Swal.fire('Éxito', 'Post creado correctamente', 'success');
            }
            handleCloseModal();
            fetchPosts();
        } catch {
            Swal.fire('Error', 'Hubo un problema al guardar el post', 'error');
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await BlogService.deletePost(id);
                Swal.fire('Eliminado!', 'El post ha sido eliminado.', 'success');
                fetchPosts();
            } catch {
                Swal.fire('Error', 'Hubo un problema al eliminar el post', 'error');
            }
        }
    };

    const handleHeroImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploadingHero(true);
        try {
            const url = await BlogService.uploadImage(file, true);
            await BlogService.setHeroImage(url);
            setHeroImage(url);
            Swal.fire('Éxito', 'Imagen principal (Hero) actualizada', 'success');
        } catch (error) {
            Swal.fire('Error', 'No se pudo actualizar la imagen principal', 'error');
        } finally {
            setUploadingHero(false);
            if (heroFileInputRef.current) heroFileInputRef.current.value = '';
        }
    };

    const handleHeroDragOver = (e) => {
        e.preventDefault();
        setIsDraggingHero(true);
    };

    const handleHeroDragLeave = (e) => {
        e.preventDefault();
        setIsDraggingHero(false);
    };

    const handleHeroDrop = async (e) => {
        e.preventDefault();
        setIsDraggingHero(false);
        const file = e.dataTransfer.files[0];
        if (!file) return;
        setUploadingHero(true);
        try {
            const url = await BlogService.uploadImage(file, true);
            await BlogService.setHeroImage(url);
            setHeroImage(url);
            Swal.fire('Éxito', 'Imagen principal (Hero) actualizada', 'success');
        } catch (error) {
            Swal.fire('Error', 'No se pudo actualizar la imagen principal', 'error');
        } finally {
            setUploadingHero(false);
            if (heroFileInputRef.current) heroFileInputRef.current.value = '';
        }
    };

    const handleCoverImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploadingCover(true);
        try {
            const url = await BlogService.uploadImage(file, false);
            setFormData(prev => ({ ...prev, cover_image: url }));
        } catch (error) {
            Swal.fire('Error', 'No se pudo subir la imagen', 'error');
        } finally {
            setUploadingCover(false);
            if (coverFileInputRef.current) coverFileInputRef.current.value = '';
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (!file) return;
        setUploadingCover(true);
        try {
            const url = await BlogService.uploadImage(file, false);
            setFormData(prev => ({ ...prev, cover_image: url }));
        } catch (error) {
            Swal.fire('Error', 'No se pudo subir la imagen', 'error');
        } finally {
            setUploadingCover(false);
            if (coverFileInputRef.current) coverFileInputRef.current.value = '';
        }
    };

    // Filter posts
    const filteredPosts = posts.filter(post =>
        post.slug !== 'config-hero-image-system' &&
        (post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="p-8 space-y-10 bg-gray-50/50 min-h-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Gestión de Blog</h1>
                    <p className="text-gray-500 mt-2 font-medium">Administra publicaciones y contenido de tu sitio.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-black text-white p-3 md:px-6 md:py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-lg shadow-black/20"
                >
                    <Plus size={20} />
                    <span className="hidden md:inline">Nuevo Post</span>
                </button>
            </div>

            {/* Configuración del Hero Image */}
            <div 
                className={`bg-white p-8 rounded-[2rem] shadow-sm flex flex-col md:flex-row items-center gap-8 group transition-all duration-300 border-2 ${isDraggingHero ? 'border-dashed border-black bg-gray-50' : 'border-gray-100 hover:shadow-xl'}`}
                onDragOver={handleHeroDragOver}
                onDragLeave={handleHeroDragLeave}
                onDrop={handleHeroDrop}
            >
                <div className="flex-1 space-y-2">
                    <h2 className="text-xl font-black text-gray-900">Imagen Principal del Blog</h2>
                    <p className="text-sm font-medium text-gray-500">Esta es la imagen de fondo que aparece en la parte superior de la página principal del blog. <strong>Puedes arrastrar una imagen hacia este recuadro para subirla.</strong></p>
                    <div className="flex gap-4 mt-6">
                        <input
                            type="file"
                            accept="image/*"
                            ref={heroFileInputRef}
                            onChange={handleHeroImageChange}
                            className="hidden"
                        />
                        <button
                            onClick={() => heroFileInputRef.current?.click()}
                            disabled={uploadingHero}
                            className="bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
                        >
                            <Upload size={18} />
                            {uploadingHero ? 'Subiendo...' : 'Subir Nueva Imagen'}
                        </button>
                    </div>
                </div>
                {heroImage && (
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Imagen Actual</span>
                        <div className="w-full md:w-72 h-40 rounded-2xl border-4 border-white shadow-xl overflow-hidden shrink-0">
                            <img src={heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
                        </div>
                    </div>
                )}
            </div>

            {/* Buscador */}
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 max-w-xl">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por título o categoría..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-50 text-gray-900 border border-transparent rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-black font-medium transition-all"
                    />
                </div>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-gray-600">
                        <thead className="bg-gray-50 text-gray-400 font-bold uppercase text-xs tracking-wider border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-5">Portada</th>
                                <th className="px-8 py-5">Título</th>
                                <th className="px-8 py-5">Categoría</th>
                                <th className="px-8 py-5">Estado</th>
                                <th className="px-8 py-5">Fecha</th>
                                <th className="px-8 py-5 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 font-medium">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-12 text-center text-gray-400">
                                        <div className="flex justify-center items-center gap-3">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-400"></div>
                                            Cargando posts...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredPosts.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-12 text-center text-gray-400 border-2 border-dashed border-gray-50 m-4 rounded-xl">
                                        No se encontraron posts
                                    </td>
                                </tr>
                            ) : (
                                filteredPosts.map(post => (
                                    <tr key={post.id} className="hover:bg-gray-50/80 transition-colors group">
                                        <td className="px-8 py-4">
                                            {post.cover_image ? (
                                                <img src={post.cover_image} alt={post.title} className="w-20 h-14 object-cover rounded-xl shadow-sm" />
                                            ) : (
                                                <div className="w-20 h-14 bg-gray-100 rounded-xl flex items-center justify-center">
                                                    <ImageIcon size={20} className="text-gray-300" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-8 py-4 text-gray-900 font-bold max-w-xs truncate" title={post.title}>
                                            {post.title}
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-yellow-100/50">
                                                {post.category}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${post.is_published ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                                                {post.is_published ? 'Publicado' : 'Borrador'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 text-sm text-gray-400">
                                            {new Date(post.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center justify-end gap-2 transition-opacity">
                                                <button
                                                    onClick={() => handleOpenModal(post)}
                                                    className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors font-medium flex items-center gap-1"
                                                    title="Editar"
                                                >
                                                    <Edit2 size={16} /> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(post.id)}
                                                    className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Crear/Editar */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
                        <div className="sticky top-0 bg-white/90 backdrop-blur-md p-8 border-b border-gray-100 flex justify-between items-center z-20">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">
                                    {currentPost ? 'Editar Post' : 'Nuevo Post'}
                                </h2>
                                <p className="text-gray-500 text-sm font-medium mt-1">Completa los datos del artículo.</p>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                className="w-10 h-10 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-full flex items-center justify-center transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Título */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Título del Post *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-medium"
                                        placeholder="Ej: Gran Rodada Nocturna 2024"
                                        required
                                    />
                                </div>

                                {/* Categoría */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Categoría *</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-medium"
                                        required
                                    >
                                        {categorias.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Slug */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Slug (URL amigable)</label>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-medium text-sm"
                                        placeholder="Se autogenerará a partir del título si lo dejas en blanco"
                                    />
                                    <p className="text-xs text-gray-400 font-medium ml-1 mt-1">Ejemplo: gran-rodada-nocturna-2024</p>
                                </div>
                            </div>

                            {/* Imagen URL o File */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Imagen de Portada</label>
                                <div 
                                    className={`flex flex-col gap-4 p-6 border-2 border-dashed rounded-[1.5rem] transition-colors ${isDragging ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    <div className="flex gap-3">
                                        <div className="relative flex-1">
                                            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="url"
                                                name="cover_image"
                                                value={formData.cover_image}
                                                onChange={handleInputChange}
                                                className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-medium pointer-events-auto"
                                                placeholder="https://ejemplo.com/imagen.jpg o arrastra aquí"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            ref={coverFileInputRef}
                                            onChange={handleCoverImageUpload}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => coverFileInputRef.current?.click()}
                                            disabled={uploadingCover}
                                            className="bg-black hover:bg-gray-800 flex items-center justify-center px-6 rounded-xl text-white transition-colors disabled:opacity-50 font-bold"
                                            title="Subir Archivo"
                                        >
                                            <Upload size={18} className="mr-2" />
                                            Subir
                                        </button>
                                        {formData.cover_image && (
                                            <div className="w-16 h-12 rounded-lg border-2 border-white shadow overflow-hidden shrink-0 hidden md:block">
                                                <img src={formData.cover_image} alt="Preview" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-center pointer-events-none mt-2">
                                        <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-50 rounded-full mb-3 text-gray-400">
                                            <ImageIcon size={24} />
                                        </div>
                                        <p className="text-sm text-gray-500 font-medium">Arrastra una imagen desde tu computadora hacia este recuadro o pega la URL.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Resumen */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Resumen (Excerpt)</label>
                                <textarea
                                    name="excerpt"
                                    value={formData.excerpt}
                                    onChange={handleInputChange}
                                    rows="2"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none font-medium"
                                    placeholder="Breve descripción que aparecerá en la tarjeta..."
                                ></textarea>
                            </div>

                            {/* Contenido (HTML) */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Contenido del Post *</label>
                                <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm [&_.ql-toolbar]:border-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-gray-200 [&_.ql-toolbar]:bg-gray-50 [&_.ql-container]:border-0 [&_.ql-editor]:text-gray-900 [&_.ql-editor]:min-h-[300px] [&_.ql-editor]:text-base [&_.ql-editor]:font-medium [&_.ql-picker-options]:shadow-xl [&_.ql-picker-options]:rounded-xl [&_.ql-picker-options]:border-gray-100">
                                    <ReactQuill 
                                        theme="snow" 
                                        value={formData.content} 
                                        onChange={(content) => setFormData(prev => ({...prev, content}))} 
                                        placeholder="Escribe el contenido aquí..."
                                    />
                                </div>
                            </div>

                            {/* Publicado checkbox */}
                            <div className="flex items-center gap-3 bg-gray-50 p-5 rounded-xl border border-gray-200">
                                <input
                                    type="checkbox"
                                    id="is_published"
                                    name="is_published"
                                    checked={formData.is_published}
                                    onChange={handleInputChange}
                                    className="w-5 h-5 accent-black cursor-pointer rounded border-gray-300"
                                />
                                <label htmlFor="is_published" className="text-sm font-bold text-gray-700 cursor-pointer select-none">
                                    Publicar inmediatamente (Visible para los usuarios)
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-8">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-6 py-3 rounded-xl text-gray-600 hover:bg-gray-50 font-bold transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-3 rounded-xl bg-black text-white hover:bg-gray-800 transition-colors font-bold shadow-lg shadow-black/20"
                                >
                                    Guardar Post
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogGestion;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BlogService } from '../../../services/Blog.service';

const BlogCard = ({ post }) => {
    const defaultImage = "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2070&auto=format&fit=crop";
    const date = new Date(post.created_at).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    return (
        <article className="group bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden flex flex-col hover:border-yellow-400/50 transition-colors">
            <div className="relative aspect-[16/10] overflow-hidden">
                <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={post.title}
                    src={post.cover_image || defaultImage}
                />
                <span className="absolute top-4 left-4 bg-yellow-400 text-black text-[10px] font-black uppercase px-2 py-1">
                    {post.category}
                </span>
            </div>

            <div className="p-6 flex-1 flex flex-col">
                <div className="text-yellow-500 text-xs font-bold mb-2 uppercase tracking-tighter">
                    {date}
                </div>
                <h3 className="text-xl font-bold mb-3 uppercase tracking-tight group-hover:text-yellow-400 text-slate-900 dark:text-white transition-colors line-clamp-2">
                    {post.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed">
                    {post.excerpt || post.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...'}
                </p>

                <div className="mt-auto pt-6 border-t border-slate-100 dark:border-gray-800 flex justify-between items-center">
                    <Link to={`/blog/${post.slug}`} className="text-xs font-black uppercase tracking-widest flex items-center gap-2 group/link text-slate-900 dark:text-white">
                        Leer más
                        <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </article>
    );
};

const BlogSkeletonCard = () => (
    <article className="bg-[#e5e5e5] dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden flex flex-col animate-pulse">
        {/* Imagen placeholder */}
        <div className="relative aspect-[16/10] bg-slate-300 dark:bg-slate-700 w-full"></div>

        <div className="p-6 flex-1 flex flex-col">
            {/* Fecha placeholder */}
            <div className="h-3 w-24 bg-slate-300 dark:bg-slate-700 rounded mb-4 mt-1"></div>

            {/* Título placeholder (2 lineas) */}
            <div className="h-6 w-full bg-slate-300 dark:bg-slate-700 rounded mb-2"></div>
            <div className="h-6 w-3/4 bg-slate-300 dark:bg-slate-700 rounded mb-6"></div>

            {/* Excerpt placeholder (3 lineas) */}
            <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
            <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
            <div className="h-3 w-4/5 bg-slate-200 dark:bg-slate-800 rounded mb-8"></div>

            {/* Botón placeholder */}
            <div className="mt-auto pt-6 border-t border-slate-100 dark:border-gray-800">
                <div className="h-4 w-20 bg-slate-300 dark:bg-slate-700 rounded"></div>
            </div>
        </div>
    </article>
);

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('Todos');

    const categorias = ['Todos', 'Noticias', 'Eventos', 'Tips & Guías', 'Mantenimiento'];

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await BlogService.getPublishedPosts();
                setPosts(response.data || []);
            } catch (error) {
                console.error("Error cargando posts", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const filteredPosts = selectedCategory === 'Todos'
        ? posts
        : posts.filter(post => post.category === selectedCategory);

    return (
        <main className="font-display bg-[#f8f8f5] dark:bg-[#121212] min-h-screen">
            {/* Hero Section */}
            <section className="relative w-full h-[70vh] min-h-[500px] overflow-hidden">
                <div className="absolute inset-0">
                    <img className="w-full h-full object-cover" alt="Hero background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-8a9VGFcGEqG5-p3LX-I7rzNV1oLkSNMHbSGH7hD_aJUvkjsa1uVWZBwuG2N7Tz0lJTBjd3Dp44JbnZHtcFFg1bg2NA_2JDbX0h8Jq7ar6iJA8e8eS4KnItXEBnPt47XCtoHxjIalKfEuApN4XnxuGE5xZi7ynahDGQ6I4p4ApVeJNvEoN1MUcN5QHyt3R6YH4yqv1dH-Ki-AA7wreJzM999EwLNn0Fdi3_FfC6DHLmzRsPXH-ryc6VS-q7Q0OGR_rWeRjuDQ1zE" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/40 to-transparent"></div>
                </div>
                <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-400 text-black text-xs font-black uppercase tracking-widest mb-4">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
                            </span>
                            Nuevo Lanzamiento
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter uppercase mb-6">
                            Novedades y Eventos <br /><span className="text-yellow-400 italic">de Land Roys</span>
                        </h2>
                        <p className="text-slate-300 text-lg md:text-xl max-w-2xl mb-8 font-light">
                            Descubre las últimas tendencias, lanzamientos exclusivos y guías técnicas para los apasionados de la velocidad y las dos ruedas.
                        </p>
                    </div>
                </div>
            </section>

            {/* Category Filter */}
            <section className="py-8 bg-slate-100 dark:bg-[#1e1e1e] border-b border-slate-200 dark:border-gray-800 sticky top-20 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-nowrap overflow-x-auto pb-2 gap-4 items-center scrollbar-hide">
                        <span className="text-sm font-bold uppercase tracking-widest text-yellow-500 min-w-fit">Filtrar por:</span>
                        {categorias.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-5 py-2 rounded font-bold text-xs uppercase tracking-widest whitespace-nowrap transition-colors
                                    ${selectedCategory === cat
                                        ? 'bg-yellow-400 text-black'
                                        : 'bg-slate-200 dark:bg-[#2d2d2d] text-slate-900 dark:text-white hover:bg-yellow-400/20'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[50vh]">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <BlogSkeletonCard key={i} />
                        ))}
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <div className="text-center py-20">
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">No hay artículos disponibles</h3>
                        <p className="text-slate-500 dark:text-slate-400">Pronto publicaremos nuevo contenido en esta categoría.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map(post => (
                            <BlogCard key={post.id} post={post} />
                        ))}
                    </div>
                )}
            </section>

            {/* Newsletter Section */}
            <section className="bg-yellow-400 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                        <div className="max-w-xl text-black">
                            <h2 className="text-4xl font-black uppercase tracking-tighter leading-none mb-4 italic">No te pierdas <br />ninguna novedad</h2>
                            <p className="font-medium text-black/80">Suscríbete a nuestro newsletter y recibe lanzamientos exclusivos, tips de mantenimiento y las próximas rodadas directo en tu correo.</p>
                        </div>
                        <form className="w-full max-w-md flex gap-2" onSubmit={(e) => e.preventDefault()}>
                            <input
                                className="flex-1 bg-white border-none rounded px-4 py-4 focus:ring-2 focus:ring-black text-black placeholder:text-slate-400 outline-none"
                                placeholder="Tu correo electrónico"
                                type="email"
                                required
                            />
                            <button
                                className="bg-black text-yellow-400 px-8 py-4 rounded font-black uppercase tracking-widest hover:bg-gray-900 transition-colors"
                                type="submit"
                            >
                                Unirme
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Blog;

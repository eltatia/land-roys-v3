import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import DOMPurify from 'dompurify';
import { BlogService } from '../../../services/Blog.service';
import { ArrowLeft } from 'lucide-react';

const BlogPost = () => {
    // Obtenemos el slug de los parámetros en lugar del id
    const { id: slug } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                // Fetch using the new slug method
                const data = await BlogService.getPostBySlug(slug);
                // Si no está publicado y no somos admin, no deberíamos mostrarlo (por RLS de Supabase el cliente normal no lo verá igual)
                setPost(data);
            } catch (error) {
                console.error("Error cargando post", error);
                navigate('/blog');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8f8f5] dark:bg-[#121212] flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-[#f8f8f5] dark:bg-[#121212] flex flex-col justify-center items-center text-center p-4">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Post no encontrado</h1>
                <Link to="/blog" className="text-yellow-500 hover:text-yellow-600 font-bold flex items-center gap-2">
                    <ArrowLeft size={20} />
                    Volver al Blog
                </Link>
            </div>
        );
    }

    const defaultImage = "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2070&auto=format&fit=crop";
    const date = new Date(post.created_at).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    const sanitizedContent = DOMPurify.sanitize(post.content);
    const seoDescription = post.excerpt || post.content.replace(/<[^>]*>?/gm, '').substring(0, 160);

    return (
        <main className="min-h-screen bg-white dark:bg-[#121212] font-display">
            {/* Dynamic SEO Meta Tags */}
            <Helmet>
                <title>{post.title} | Land Roys Blog</title>
                <meta name="description" content={seoDescription} />
                <meta property="og:title" content={`${post.title} | Land Roys`} />
                <meta property="og:description" content={seoDescription} />
                <meta property="og:image" content={post.cover_image || defaultImage} />
                <meta property="og:type" content="article" />
            </Helmet>

            {/* Header Image */}
            <div className="w-full h-[50vh] min-h-[400px] relative">
                <img
                    src={post.cover_image || defaultImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/60 to-transparent"></div>

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 max-w-4xl mx-auto right-0">
                    <Link to="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-yellow-400 font-bold uppercase tracking-widest text-xs mb-6 transition-colors">
                        <ArrowLeft size={16} /> Volver
                    </Link>
                    <div className="flex items-center gap-4 mb-4">
                        <span className="bg-yellow-400 text-black text-[10px] font-black uppercase px-2 py-1">
                            {post.category}
                        </span>
                        <span className="text-white/60 text-sm font-bold uppercase tracking-widest border-l border-white/20 pl-4">
                            {date}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter uppercase mb-4">
                        {post.title}
                    </h1>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-black uppercase">
                            LR
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm uppercase tracking-widest">{post.author || 'Administrador'}</p>
                            <p className="text-white/50 text-xs">Equipo Land Roys</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Post Content */}
            <article className="max-w-4xl mx-auto px-6 py-16 md:py-24">
                {post.excerpt && (
                    <div className="text-xl md:text-2xl font-light text-slate-600 dark:text-slate-300 mb-12 leading-relaxed border-l-4 border-yellow-400 pl-6">
                        {post.excerpt}
                    </div>
                )}

                <div
                    className="prose prose-lg md:prose-xl dark:prose-invert max-w-none
                    prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight
                    prose-a:text-yellow-500 hover:prose-a:text-yellow-400
                    prose-strong:text-slate-900 dark:prose-strong:text-white
                    prose-img:rounded-xl prose-img:shadow-xl prose-img:w-full"
                    dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                />
            </article>

            {/* Share & actions foot */}
            <div className="max-w-4xl mx-auto px-6 pb-24 border-t border-slate-200 dark:border-gray-800 pt-8 flex justify-between items-center">
                <Link to="/blog" className="px-6 py-3 border-2 border-slate-200 dark:border-gray-800 rounded font-bold uppercase tracking-widest text-sm text-slate-900 dark:text-white hover:border-yellow-400 transition-colors">
                    Siguiente Artículo
                </Link>
                <div className="flex gap-4">
                    <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-gray-800 flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-colors text-slate-500 dark:text-gray-400">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                    </button>
                    <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-gray-800 flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-colors text-slate-500 dark:text-gray-400">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </main>
    );
};

export default BlogPost;

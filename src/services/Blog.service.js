import { supabase } from '../api/Supabase.provider';

// Utilidad para generar slugs a partir del título
const generateSlug = (title) => {
    return title
        .toLowerCase()
        .normalize("NFD") // Elimina tildes
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, '-') // Reemplaza espacios y caracteres raros por guiones
        .replace(/^-+|-+$/g, ''); // Elimina guiones al principio o final
};

export const BlogService = {
    // Obtener todos los posts (para el panel de admin)
    async getAllPosts() {
        try {
            const { data, error } = await supabase
                .from('blog_posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching all posts:', error);
            throw error;
        }
    },

    // Obtener solo posts publicados (para la vista de cliente) con paginación
    async getPublishedPosts(from = 0, to = 9) {
        try {
            const { data, error, count } = await supabase
                .from('blog_posts')
                .select('*', { count: 'exact' })
                .eq('is_published', true)
                .order('created_at', { ascending: false })
                .range(from, to);

            if (error) throw error;
            return { data, count }; // Retornamos los datos y el total de posts
        } catch (error) {
            console.error('Error fetching published posts:', error);
            throw error;
        }
    },

    // Obtener un post por ID (usado por Admin)
    async getPostById(id) {
        try {
            const { data, error } = await supabase
                .from('blog_posts')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error(`Error fetching post ${id}:`, error);
            throw error;
        }
    },

    // Obtener un post por slug (usado por Cliente para SEO)
    async getPostBySlug(slug) {
        try {
            const { data, error } = await supabase
                .from('blog_posts')
                .select('*')
                .eq('slug', slug)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error(`Error fetching post with slug ${slug}:`, error);
            throw error;
        }
    },

    // Crear un post
    async createPost(postData) {
        try {
            // Generar slug si no viene uno o si es crear
            const slug = postData.slug || generateSlug(postData.title);

            // Check si el slug existe (agregar sufijo aleatorio dsi ya existe para no fallar)
            const { data: existingPost } = await supabase.from('blog_posts').select('id').eq('slug', slug).single();
            const finalSlug = existingPost ? `${slug}-${Math.floor(Math.random() * 1000)}` : slug;

            const { data, error } = await supabase
                .from('blog_posts')
                .insert([{ ...postData, slug: finalSlug }])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }
    },

    // Actualizar un post
    async updatePost(id, postData) {
        try {
            // Generar o usar el slug provisto
            let finalSlug = postData.slug || generateSlug(postData.title);

            // TODO: Podríamos chequear unicidad si el título cambió mucho, pero por simplicidad de admin lo omitiremos aquí 
            // a menos que dé error Unique Constraint.

            const { data, error } = await supabase
                .from('blog_posts')
                .update({
                    ...postData,
                    slug: finalSlug,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error(`Error updating post ${id}:`, error);
            throw error;
        }
    },

    // Eliminar un post
    async deletePost(id) {
        try {
            const { error } = await supabase
                .from('blog_posts')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error(`Error deleting post ${id}:`, error);
            throw error;
        }
    }
};

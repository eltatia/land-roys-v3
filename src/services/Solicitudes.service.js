import { supabase } from "../api/Supabase.provider";

export const createSolicitud = async (data) => {
    const { error } = await supabase.from("solicitudes").insert([data]);
    if (error) {
        console.error("Error creating solicitud:", error);
        throw error;
    }
    return true;
};

export const getSolicitudes = async () => {
    const { data, error } = await supabase
        .from("solicitudes")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching solicitudes:", error);
        throw error;
    }
    return data;
};

export const updateSolicitud = async (id, updates) => {
    const { error } = await supabase
        .from("solicitudes")
        .update(updates)
        .eq("id", id);
    if (error) {
        console.error("Error updating solicitud:", error);
        throw error;
    }
    return true;
};

export const updateSolicitudEstado = async (id, estado) => {
    return updateSolicitud(id, { estado });
};

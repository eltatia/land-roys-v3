import { supabase } from "../api/Supabase.provider";

export const getVentas = async () => {
    const { data, error } = await supabase
        .from("ventas")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching ventas:", error);
        throw error;
    }
    return data;
};

export const createVenta = async (venta) => {
    const { error } = await supabase.from("ventas").insert([venta]);
    if (error) {
        console.error("Error creating venta:", error);
        throw error;
    }
    return true;
}

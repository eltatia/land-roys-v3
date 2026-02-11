import { supabase } from "../api/Supabase.provider";

export const getGeneralStats = async (dateRange = {}) => {
    try {
        const { startDate, endDate } = dateRange;

        // Base query builder
        const buildQuery = (table) => {
            let query = supabase.from(table).select("*", { count: "exact", head: true });
            if (startDate) query = query.gte(table === 'ventas' ? 'fecha_venta' : 'created_at', startDate);
            if (endDate) query = query.lte(table === 'ventas' ? 'fecha_venta' : 'created_at', endDate);
            return query;
        };

        // Get total sales count
        const { count: ventasCount, error: ventasError } = await buildQuery("ventas");
        if (ventasError) throw ventasError;

        // Get total requests count
        const { count: solicitudesCount, error: solicitudesError } = await buildQuery("solicitudes");
        if (solicitudesError) throw solicitudesError;

        // Calculate total revenue
        let revenueQuery = supabase.from("ventas").select("monto");
        if (startDate) revenueQuery = revenueQuery.gte('fecha_venta', startDate);
        if (endDate) revenueQuery = revenueQuery.lte('fecha_venta', endDate);

        const { data: ventasData, error: ventasDataError } = await revenueQuery;
        if (ventasDataError) throw ventasDataError;

        const totalRevenue = ventasData.reduce((acc, curr) => acc + (Number(curr.monto) || 0), 0);

        return {
            totalVentas: ventasCount || 0,
            totalSolicitudes: solicitudesCount || 0,
            ingresosTotales: totalRevenue,
        };
    } catch (error) {
        console.error("Error fetching stats:", error);
        return {
            totalVentas: 0,
            totalSolicitudes: 0,
            ingresosTotales: 0,
        };
    }
};

export const getSalesTimeline = async (dateRange = {}) => {
    try {
        const { startDate, endDate } = dateRange;
        let query = supabase
            .from("ventas")
            .select("fecha_venta, monto")
            .order("fecha_venta", { ascending: true });

        if (startDate) query = query.gte('fecha_venta', startDate);
        if (endDate) query = query.lte('fecha_venta', endDate);

        const { data, error } = await query;
        if (error) throw error;

        // Group logic (Auto-adapt granularity could go here, but keeping monthly/daily simple for now)
        // If range is small (e.g. week), maybe group by day? For now sticking to existing logic or enhancing slightly.
        const grouped = data.reduce((acc, curr) => {
            const date = new Date(curr.fecha_venta);
            // If range is < 32 days, group by Day. Else Month.
            const isShortRange = startDate && endDate && (new Date(endDate) - new Date(startDate)) < 2800000000; // approx 32 days

            const key = date.toLocaleString('default', { month: 'short' });
            // For now, let's keep it simple and just return the filtered data's aggregation
            if (!acc[key]) acc[key] = 0;
            acc[key] += Number(curr.monto);
            return acc;
        }, {});

        return Object.entries(grouped).map(([name, total]) => ({ name, total }));
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const getLeadsDistribution = async (dateRange = {}) => {
    try {
        const { startDate, endDate } = dateRange;
        let query = supabase.from("solicitudes").select("estado");

        if (startDate) query = query.gte('created_at', startDate);
        if (endDate) query = query.lte('created_at', endDate);

        const { data, error } = await query;
        if (error) throw error;

        const counts = data.reduce((acc, curr) => {
            const status = (curr.estado || "pendiente").toLowerCase();
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        return [
            { name: "Pendientes", value: counts["pendiente"] || 0, color: "#FACC15" },
            { name: "Contactados", value: counts["contactado"] || 0, color: "#3B82F6" },
            { name: "Vendidos", value: counts["vendido"] || 0, color: "#22C55E" },
            { name: "Perdidos", value: counts["cerrado"] || 0, color: "#EF4444" },
        ].filter(item => item.value > 0);
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const getAllSales = async (dateRange = {}) => {
    try {
        const { startDate, endDate } = dateRange;
        let query = supabase
            .from("ventas")
            .select(`
                *,
                solicitud:solicitud_id (
                    nombre,
                    email,
                    telefono,
                    ciudad
                )
            `)
            .order("fecha_venta", { ascending: false });

        if (startDate) query = query.gte('fecha_venta', startDate);
        if (endDate) query = query.lte('fecha_venta', endDate);

        const { data, error } = await query;
        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error fetching all sales:", error);
        return [];
    }
};

export const getInventoryReport = async () => {
    try {
        const { data, error } = await supabase
            .from("motos")
            .select("id, nombre, modelo_codigo, precio, stock, estado, categoria")
            .order("stock", { ascending: true });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error fetching inventory:", error);
        return [];
    }
};

export const getAllLeads = async (dateRange = {}) => {
    try {
        const { startDate, endDate } = dateRange;
        let query = supabase
            .from("solicitudes")
            .select("*")
            .order("created_at", { ascending: false });

        if (startDate) query = query.gte('created_at', startDate);
        if (endDate) query = query.lte('created_at', endDate);

        const { data, error } = await query;
        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error fetching all leads:", error);
        return [];
    }
};

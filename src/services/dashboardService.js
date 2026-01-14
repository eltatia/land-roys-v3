import { supabase } from "./Supabase";

const buildMonthlySeries = (rows, months) => {
  const series = Array.from({ length: months }, () => 0);
  const labels = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(date.toLocaleDateString("es-PE", { month: "short" }));
  }

  rows.forEach((row) => {
    const createdAt = new Date(row.created_at);
    const monthIndex = (now.getFullYear() - createdAt.getFullYear()) * 12 + (now.getMonth() - createdAt.getMonth());
    if (monthIndex >= 0 && monthIndex < months) {
      const targetIndex = months - 1 - monthIndex;
      series[targetIndex] += row.total ?? 0;
    }
  });

  return { labels, series };
};

export const fetchDashboardMetrics = async () => {
  const [pedidosCount, consultasCount, consultasPendientesCount, usuariosCount, pedidosRows] = await Promise.all([
    supabase.from("pedidos").select("id", { count: "exact", head: true }),
    supabase.from("consultas").select("id", { count: "exact", head: true }),
    supabase
      .from("consultas")
      .select("id", { count: "exact", head: true })
      .eq("estado", "Pendiente"),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase
      .from("pedidos")
      .select("total, created_at")
      .gte("created_at", new Date(new Date().setMonth(new Date().getMonth() - 5)).toISOString()),
  ]);

  if (pedidosCount.error) throw pedidosCount.error;
  if (consultasCount.error) throw consultasCount.error;
  if (consultasPendientesCount.error) throw consultasPendientesCount.error;
  if (usuariosCount.error) throw usuariosCount.error;
  if (pedidosRows.error) throw pedidosRows.error;

  const { labels, series } = buildMonthlySeries(pedidosRows.data || [], 6);
  const totalVentasMes = series[series.length - 1] ?? 0;

  return {
    totals: {
      totalPedidos: pedidosCount.count ?? 0,
      nuevosUsuarios: usuariosCount.count ?? 0,
      consultasPendientes: consultasPendientesCount.count ?? 0,
      ventasMes: totalVentasMes,
      totalConsultas: consultasCount.count ?? 0,
    },
    charts: {
      labels,
      ventas: series,
      pedidos: series.map((value) => Math.round(value / 100)),
    },
  };
};

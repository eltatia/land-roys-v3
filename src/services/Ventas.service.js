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
};

const isMissingRpc = (error) => {
  const msg = error?.message || "";
  return msg.includes("Could not find the function") || msg.includes("PGRST202");
};

const closeSaleFallback = async ({ ventaPayload, motoId, stockActual, solicitudId, solicitudPayload }) => {
  const { data: ventaData, error: ventaError } = await supabase
    .from("ventas")
    .insert([ventaPayload])
    .select("id")
    .single();

  if (ventaError) throw ventaError;

  const { data: motoUpdated, error: stockError } = await supabase
    .from("motos")
    .update({ stock: stockActual - 1 })
    .eq("id", motoId)
    .eq("stock", stockActual)
    .gt("stock", 0)
    .select("id, stock")
    .single();

  if (stockError || !motoUpdated) {
    await supabase.from("ventas").delete().eq("id", ventaData.id);
    throw stockError || new Error("No se pudo actualizar stock de forma segura");
  }

  const { error: solicitudError } = await supabase
    .from("solicitudes")
    .update(solicitudPayload)
    .eq("id", solicitudId);

  if (solicitudError) {
    await supabase.from("motos").update({ stock: stockActual }).eq("id", motoId);
    await supabase.from("ventas").delete().eq("id", ventaData.id);
    throw solicitudError;
  }

  return { ok: true, mode: "fallback" };
};

export const closeSaleTransaction = async ({
  ventaPayload,
  motoId,
  stockActual,
  solicitudId,
  solicitudPayload,
}) => {
  const rpcParams = {
    p_solicitud_id: solicitudId,
    p_moto_id: motoId,
    p_stock_actual: stockActual,
    p_venta: ventaPayload,
    p_solicitud_updates: solicitudPayload,
  };

  const { data, error } = await supabase.rpc("registrar_venta_atomica", rpcParams);

  if (!error) return { ok: true, mode: "rpc", data };
  if (!isMissingRpc(error)) throw error;

  return closeSaleFallback({ ventaPayload, motoId, stockActual, solicitudId, solicitudPayload });
};

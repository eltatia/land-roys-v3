import { useEffect, useState } from "react";
import { supabase } from "../../../services/Supabase";
import "./ConsultasTable.css";

const formatRelative = (dateString) => {
  const createdAt = new Date(dateString);
  const diffMs = Date.now() - createdAt.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "hoy";
  if (diffDays === 1) return "hace 1 día";
  return `hace ${diffDays} días`;
};

export default function ConsultasTable() {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConsultas = async () => {
      try {
        const { data, error } = await supabase
          .from("consultas")
          .select("nombre,email,telefono,asunto,mensaje,created_at")
          .order("created_at", { ascending: false })
          .limit(5);

        if (error) throw error;
        setConsultas(data || []);
      } catch (error) {
        console.error("Error loading consultas:", error);
      } finally {
        setLoading(false);
      }
    };

    loadConsultas();
  }, []);

  return (
    <div className="mt-8">
      <h2 className="chart-title">Consultas Recientes</h2>

      <div className="table-wrapper">
        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nombre completo</th>
                <th>Contacto</th>
                <th>Asunto y Mensaje</th>
                <th>Fecha</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4">Cargando consultas...</td>
                </tr>
              ) : consultas.length === 0 ? (
                <tr>
                  <td colSpan="4">No hay consultas recientes.</td>
                </tr>
              ) : (
                consultas.map((row, index) => (
                  <tr key={`${row.email}-${index}`}>
                    <td>{row.nombre}</td>

                    <td>
                      {row.email}
                      <br />
                      {row.telefono}
                    </td>

                    <td>
                      <strong>{row.asunto}</strong> — "{row.mensaje}"
                    </td>

                    <td>{formatRelative(row.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}

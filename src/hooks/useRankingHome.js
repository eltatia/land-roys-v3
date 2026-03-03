import { useAuth } from "../context/useAuth";
import { getRankingHomePublic, saveRankingHome } from "../services/rankingHome.service";
import { getRankingBucketName, subirImagen } from "../services/upload.service";
import { supabase } from "../api/Supabase.provider"; // cliente Supabase
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export const useRankingHome = () => {
  const { role } = useAuth(); // role debe ser "admin" o "asistente"
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===============================
  // Obtener ranking público al cargar
  // ===============================
  useEffect(() => {
    const fetchRanking = async () => {
      setLoading(true);
      try {
        const data = await getRankingHomePublic();
        setProductos(
          data.map(p => ({
            id: p.id,
            rank: p.rank,
            tag: p.tag,
            name: p.name,
            desc: p.description,
            price: p.price,
            image: p.image_url,
            btn_primary_url: p.btn_primary_url,
          }))
        );
      } catch (err) {
        console.error("Error obteniendo ranking:", err);
        Swal.fire("Error", "No se pudo cargar el ranking", "error");
      }
      setLoading(false);
    };
    fetchRanking();
  }, []);

  // ===============================
  // Actualizar campo del producto
  // ===============================
  const updateProducto = (index, field, value) => {
    setProductos(prev => {
      const copia = [...prev];
      copia[index][field] = value;
      return copia;
    });
  };

  // ===============================
  // Subir imagen y actualizar producto
  // ===============================
  const handleUploadImage = async (index, file) => {
    if (!file) return;

    Swal.fire({ title: "Subiendo imagen...", didOpen: () => Swal.showLoading() });

    try {
      const productoActual = productos[index];

      // 1️⃣ Eliminar imagen anterior si existe en Supabase
      if (productoActual.image && productoActual.image.startsWith("https://")) {
        try {
          const url = new URL(productoActual.image);
          const marker = `/object/public/${getRankingBucketName()}/`;
          const bucketPath = url.pathname.includes(marker)
            ? url.pathname.split(marker)[1]
            : url.pathname.split("/").slice(-2).join("/");
          const { error } = await supabase.storage.from(getRankingBucketName()).remove([bucketPath]);
          if (error) console.warn("No se pudo eliminar imagen anterior:", error.message);
        } catch (err) {
          console.warn("Error parseando URL de la imagen anterior:", err);
        }
      }

      // 2️⃣ Subir nueva imagen
      const urlNueva = await subirImagen(file);
      Swal.close();

      if (urlNueva) {
        updateProducto(index, "image", urlNueva);
        Swal.fire("Éxito", "Imagen subida correctamente", "success");
      } else {
        Swal.fire("Error", "No se pudo subir la imagen", "error");
      }
    } catch (err) {
      Swal.close();
      console.error("Error al subir imagen:", err);
      Swal.fire("Error", "Error inesperado al subir la imagen", "error");
    }
  };

  // ===============================
  // Guardar ranking (solo admin o asistente)
  // ===============================
  const guardarRanking = async () => {
    try {
      await saveRankingHome(productos, role);
      Swal.fire("Éxito", "Ranking guardado correctamente", "success");
    } catch (err) {
      console.error("Error guardando ranking_home:", err);
      Swal.fire("Error", err.message || "No se pudo guardar el ranking", "error");
    }
  };

  return { productos, loading, updateProducto, guardarRanking, handleUploadImage };
};

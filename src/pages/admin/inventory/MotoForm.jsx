import React, { useState, useEffect } from "react";
import { X, Upload, Save, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import { supabase } from "../../../api/Supabase.provider";
import { createMoto, updateMoto } from "../../../services/Moto.service";
import { useAuth } from "../../../context/AuthContext";

const MotoForm = ({ onClose, onSave, initialData }) => {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imageIdsByOrder, setImageIdsByOrder] = useState({});
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        marca: "",
        modelo: "",
        anio: new Date().getFullYear(),
        cilindrada: "",
        precio: "",
        descripcion: "",
        estado: "disponible",
        imagen_url: null,
        imagen_accion_url: null,
        video_url: null,
        use_video: true,
    });

    useEffect(() => {
        if (initialData) {
            const images = (initialData.imagen_moto || [])
                .map((item) => item.imagen)
                .filter(Boolean)
                .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));

            const mainImage = images.find((img) => img.orden === 0) || images[0];
            const actionImage = images.find((img) => img.orden === 1) || images[1];
            const videoImage = images.find((img) => img.orden === 2) || images[2];

            setFormData({
                marca: initialData.marca || "",
                modelo: initialData.modelo || "",
                anio: initialData.anio || new Date().getFullYear(),
                cilindrada: initialData.cilindrada || "",
                precio: initialData.precio || "",
                descripcion: initialData.descripcion || "",
                estado: initialData.estado || "disponible",
                imagen_url: mainImage?.url_imagen || null,
                imagen_accion_url: actionImage?.url_imagen || null,
                video_url: videoImage?.url_imagen || null,
                use_video: Boolean(videoImage?.url_imagen),
            });

            setImageIdsByOrder({
                0: mainImage?.id_imagen,
                1: actionImage?.id_imagen,
                2: videoImage?.id_imagen,
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleToggleVideo = () => {
        setFormData((prev) => ({
            ...prev,
            use_video: !prev.use_video,
            video_url: prev.use_video ? null : prev.video_url,
        }));
    };

    const handleMediaUpload = async (e, field, folder) => {
        try {
            setUploading(true);
            const file = e.target.files[0];
            if (!file) return;

            const fileExt = file.name.split(".").pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${folder}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("motos")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from("motos").getPublicUrl(filePath);

            setFormData((prev) => ({ ...prev, [field]: data.publicUrl }));

        } catch (error) {
            console.error("Error subiendo archivo:", error);
            Swal.fire("Error", "No se pudo subir el archivo", "error");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Guardar la Moto
            const motoData = {
                marca: formData.marca,
                modelo: formData.modelo,
                anio: parseInt(formData.anio),
                cilindrada: formData.cilindrada,
                precio: parseFloat(formData.precio),
                descripcion: formData.descripcion,
                estado: formData.estado,
            };

            let motoId;

            if (initialData) {
                // Actualizar
                const updated = await updateMoto(initialData.id_moto, motoData);
                motoId = updated.id_moto;
            } else {
                // Crear
                const created = await createMoto({
                    ...motoData,
                    id_usuario: user?.id || null,
                });
                motoId = created.id_moto;
            }

            const upsertImageForOrder = async (order, url) => {
                if (!url) return;

                const existingId = imageIdsByOrder[order];
                if (existingId) {
                    const { error: updateError } = await supabase
                        .from("imagen")
                        .update({ url_imagen: url, estado: "activo", orden: order })
                        .eq("id_imagen", existingId);

                    if (updateError) throw updateError;
                    return;
                }

                const { data: imgData, error: imgError } = await supabase
                    .from("imagen")
                    .insert([{ url_imagen: url, estado: "activo", orden: order }])
                    .select()
                    .single();

                if (imgError) throw imgError;

                await supabase
                    .from("imagen_moto")
                    .insert([{ id_moto: motoId, id_imagen: imgData.id_imagen }]);
            };

            await upsertImageForOrder(0, formData.imagen_url);
            await upsertImageForOrder(1, formData.imagen_accion_url);
            if (formData.use_video) {
                await upsertImageForOrder(2, formData.video_url);
            } else if (imageIdsByOrder[2]) {
                const { error: deactivateError } = await supabase
                    .from("imagen")
                    .update({ url_imagen: null, estado: "inactivo", orden: 2 })
                    .eq("id_imagen", imageIdsByOrder[2]);

                if (deactivateError) throw deactivateError;
            }

            Swal.fire({
                icon: "success",
                title: initialData ? "Moto actualizada" : "Moto creada",
                showConfirmButton: false,
                timer: 1500
            });

            onSave(); // Recargar lista
            onClose();

        } catch (error) {
            console.error("Error guardando moto:", error);
            Swal.fire("Error", error.message || "Ocurrió un error al guardar", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
                    <h2 className="text-xl font-black text-slate-800">
                        {initialData ? "Editar Motocicleta" : "Nueva Motocicleta"}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Media Uploads */}
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Medios principales</h3>
                        <button
                            type="button"
                            onClick={handleToggleVideo}
                            className={`text-[10px] font-bold px-3 py-1 rounded-full border transition-colors ${formData.use_video ? "bg-yellow-100 text-yellow-700 border-yellow-200" : "bg-gray-100 text-gray-500 border-gray-200"}`}
                        >
                            {formData.use_video ? "Video activo" : "Sin video"}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="relative group w-full h-48 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden hover:border-yellow-400 transition-colors cursor-pointer">
                            {formData.imagen_url ? (
                                <img src={formData.imagen_url} alt="Principal" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center text-gray-400">
                                    <Upload size={32} className="mb-2" />
                                    <span className="text-sm font-medium">Imagen principal</span>
                                </div>
                            )}

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleMediaUpload(e, "imagen_url", "motos")}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                disabled={uploading}
                            />
                        </div>

                        <div className="relative group w-full h-48 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden hover:border-yellow-400 transition-colors cursor-pointer">
                            {formData.imagen_accion_url ? (
                                <img src={formData.imagen_accion_url} alt="Acción" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center text-gray-400">
                                    <Upload size={32} className="mb-2" />
                                    <span className="text-sm font-medium">Imagen en acción</span>
                                </div>
                            )}

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleMediaUpload(e, "imagen_accion_url", "motos")}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                disabled={uploading}
                            />
                        </div>

                        {formData.use_video && (
                            <div className="relative group w-full h-48 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden hover:border-yellow-400 transition-colors cursor-pointer">
                                {formData.video_url ? (
                                    <video src={formData.video_url} className="w-full h-full object-cover" muted />
                                ) : (
                                    <div className="flex flex-col items-center text-gray-400">
                                        <Upload size={32} className="mb-2" />
                                        <span className="text-sm font-medium text-center px-3">Video (archivo)</span>
                                    </div>
                                )}

                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => handleMediaUpload(e, "video_url", "motos/videos")}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    disabled={uploading}
                                />
                            </div>
                        )}
                    </div>

                    {formData.use_video && (
                        <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">URL de video (opcional)</label>
                        <input
                            type="text"
                            name="video_url"
                            className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-yellow-400 outline-none"
                            value={formData.video_url || ""}
                            onChange={handleChange}
                            placeholder="https://... (YouTube o MP4)"
                        />
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Marca</label>
                            <input
                                type="text"
                                name="marca"
                                required
                                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-yellow-400 outline-none"
                                value={formData.marca}
                                onChange={handleChange}
                                placeholder="Ej. Yamaha"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Modelo</label>
                            <input
                                type="text"
                                name="modelo"
                                required
                                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-yellow-400 outline-none"
                                value={formData.modelo}
                                onChange={handleChange}
                                placeholder="Ej. MT-09"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Año</label>
                            <input
                                type="number"
                                name="anio"
                                required
                                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-yellow-400 outline-none"
                                value={formData.anio}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Cilindrada</label>
                            <input
                                type="text"
                                name="cilindrada"
                                required
                                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-yellow-400 outline-none"
                                value={formData.cilindrada}
                                onChange={handleChange}
                                placeholder="Ej. 890cc"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Precio</label>
                            <input
                                type="number"
                                name="precio"
                                required
                                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-yellow-400 outline-none"
                                value={formData.precio}
                                onChange={handleChange}
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Descripción</label>
                        <textarea
                            name="descripcion"
                            rows="3"
                            className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-yellow-400 outline-none resize-none"
                            value={formData.descripcion}
                            onChange={handleChange}
                            placeholder="Detalles adicionales..."
                        ></textarea>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Estado</label>
                        <select
                            name="estado"
                            className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-yellow-400 outline-none"
                            value={formData.estado}
                            onChange={handleChange}
                        >
                            <option value="disponible">Disponible</option>
                            <option value="reservado">Reservado</option>
                            <option value="vendido">Vendido</option>
                            <option value="inactivo">Inactivo</option>
                        </select>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading || uploading}
                            className="px-8 py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            Guardar Moto
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MotoForm;

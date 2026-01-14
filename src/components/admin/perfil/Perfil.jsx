import React, { useEffect, useState } from "react";
import { supabase } from "../../../services/Supabase";
import Swal from "sweetalert2";

const Perfil = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        const userId = sessionData.session?.user?.id;
        if (!userId) return;

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("username, email")
          .eq("id", userId)
          .single();
        if (profileError) throw profileError;

        setFormData({
          username: profile?.username ?? "",
          email: profile?.email ?? sessionData.session?.user?.email ?? "",
        });
      } catch (error) {
        console.error("Error loading profile:", error);
        Swal.fire("Error", "No se pudo cargar el perfil", "error");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      Swal.fire("Error", "El nombre es obligatorio.", "error");
      return false;
    }
    if (!formData.email.trim()) {
      Swal.fire("Error", "El correo es obligatorio.", "error");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      Swal.fire("Error", "Ingresa un correo válido.", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      if (!userId) throw new Error("No hay sesión activa");

      if (formData.email !== sessionData.session?.user?.email) {
        const { error: authError } = await supabase.auth.updateUser({ email: formData.email });
        if (authError) throw authError;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          username: formData.username,
          email: formData.email,
        })
        .eq("id", userId);

      if (error) throw error;

      Swal.fire("Guardado", "Perfil actualizado correctamente", "success");
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire("Error", error.message || "No se pudo actualizar el perfil", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Cargando perfil...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Perfil</h1>
      <p className="text-gray-500 mb-8">Actualiza tus datos personales de administrador.</p>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none text-gray-900"
            placeholder="Nombre y apellido"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Correo</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none text-gray-900"
            placeholder="admin@landroys.com"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition"
            disabled={saving}
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Perfil;

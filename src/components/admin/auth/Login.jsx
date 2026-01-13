import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../../services/Supabase.js";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [portalType, setPortalType] = useState("admin"); // 'admin' | 'assistant'

  async function handleLogin(e) {
    e.preventDefault();
    setErrorMsg("");

    if (!username || !password) {
      setErrorMsg("Ingrese su usuario y contraseña.");
      return;
    }

    setLoading(true);

    // 1️⃣ Buscar email y datos del usuario por username
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, username, email, role")
      .eq("username", username)
      .single();

    if (profileError || !profile) {
      setLoading(false);
      setErrorMsg("El usuario no existe.");
      return;
    }

    if (!profile.email) {
      setLoading(false);
      setErrorMsg("El usuario no tiene un correo asociado.");
      return;
    }

    // 2️⃣ Iniciar sesión con el email encontrado
    const { data: loginData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email: profile.email,
        password,
      });

    if (loginError) {
      setLoading(false);
      setErrorMsg("Credenciales inválidas.");
      return;
    }

    const user = loginData.user;

    if (!user) {
      setLoading(false);
      setErrorMsg("Error iniciando sesión. Intente nuevamente.");
      return;
    }

    // 3️⃣ Volver a obtener rol para asegurar consistencia
    const { data: fullProfile, error: roleError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    // VALIDACIÓN DE ROLES SEGÚN PORTAL
    let allowed = false;
    const userRole = fullProfile?.role;

    if (portalType === "admin") {
      // Solo admin puede entrar al portal de admin
      if (userRole === "admin") allowed = true;
    } else {
      // Admin y Assistant pueden entrar al portal de asistente
      if (userRole === "admin" || userRole === "assistant") allowed = true;
    }

    if (roleError || !allowed) {
      setLoading(false);
      setErrorMsg(`No tienes permisos para acceder al portal de ${portalType === 'admin' ? 'Administrador' : 'Asistente'}.`);
      await supabase.auth.signOut();
      return;
    }

    // 4️⃣ Redirigir al dashboard admin
    navigate("/admin");
    setLoading(false);
  }

  return (
    <main className="login-wrapper">
      <div className="login-container">

        <div className="login-logo">
          <h1 className="login-title">
            Land<span className="login-title-accent">Roys</span>
          </h1>
        </div>

        <div className="login-card">

          {/* SWITCHER DE PORTAL */}
          <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
            <button
              type="button"
              onClick={() => setPortalType("admin")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${portalType === "admin"
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
                }`}
            >
              Administrador
            </button>
            <button
              type="button"
              onClick={() => setPortalType("assistant")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${portalType === "assistant"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
                }`}
            >
              Asistente
            </button>
          </div>

          <div className="login-header">
            <p className="login-header-title">
              Portal de {portalType === "admin" ? "Admin" : "Asistente"}
            </p>

            <p className="login-header-subtitle">
              Bienvenido de nuevo, por favor inicia sesión.
              <br />
              {portalType === "admin" && (
                <span className="login-header-text">
                  ¿No tienes una cuenta?
                  <Link className="login-link" to="/admin/register">
                    Registrarse
                  </Link>
                </span>
              )}
            </p>
          </div>

          {errorMsg && <p className="login-error">{errorMsg}</p>}

          <form className="login-form" onSubmit={handleLogin}>
            <label className="login-label">
              <p className="login-label-text">Usuario</p>
              <input
                className="login-input"
                placeholder="Ingrese su nombre de usuario"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>

            <label className="login-label">
              <p className="login-label-text">Contraseña</p>
              <input
                className="login-input"
                placeholder="Ingrese su contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <div className="login-forgot">
              <a className="login-forgot-link" href="#">
                ¿Olvidó su contraseña?
              </a>
            </div>

            <button
              className={`login-button ${portalType === "assistant" ? "!bg-blue-600 hover:!bg-blue-700" : ""}`}
              disabled={loading}
            >
              {loading ? "Ingresando..." : "Iniciar sesión"}
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}

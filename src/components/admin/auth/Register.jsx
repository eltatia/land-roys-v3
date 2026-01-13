import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../../services/Supabase.js";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    setErrorMsg("");

    // VALIDACIONES
    if (!username || !email || !password || !password2) {
      setErrorMsg("Completa todos los campos.");
      return;
    }

    if (password !== password2) {
      setErrorMsg("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Registrar en Supabase Auth
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        setLoading(false);
        setErrorMsg(authError.message);
        return;
      }

      const user = data.user;

      if (!user) {
        setLoading(false);
        setErrorMsg("No se pudo crear el usuario.");
        return;
      }

      // 2️⃣ Insertar perfil asociado al ID del usuario registrado
      const { error: profileError } = await supabase.from("profiles").insert({
        id: user.id,
        username: username,
        email: email,
        role: "admin",
      });

      if (profileError) {
        setLoading(false);
        setErrorMsg("Error al crear perfil: " + profileError.message);
        return;
      }

      // 3️⃣ Redirigir al login
      navigate("/admin/login");

    } catch (err) {
      setErrorMsg("Error inesperado: " + err.message);
    }

    setLoading(false);
  }

  return (
    <main className="register-wrapper">
      <div className="register-container">

        <div className="register-logo">
          <h1 className="register-title">
            Land <span className="register-title-accent">Roys</span>
          </h1>
        </div>

        <div className="register-card">

          <div className="register-header">
            <p className="register-header-title">Crear cuenta Admin</p>
            <p className="register-header-subtitle">
              Rellene los datos para registrar un nuevo administrador.
            </p>
          </div>

          {errorMsg && <p className="register-error">{errorMsg}</p>}

          <form className="register-form" onSubmit={handleRegister}>

            <label className="register-label">
              <p className="register-label-text">Nombre de usuario</p>
              <input
                className="register-input"
                type="text"
                placeholder="Ingresa tu nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>

            <label className="register-label">
              <p className="register-label-text">Email</p>
              <input
                className="register-input"
                type="email"
                placeholder="Ingresa tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label className="register-label">
              <p className="register-label-text">Contraseña</p>
              <input
                className="register-input"
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <label className="register-label">
              <p className="register-label-text">Confirmar contraseña</p>
              <input
                className="register-input"
                type="password"
                placeholder="Confirma tu contraseña"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
              />
            </label>

            <button className="register-button" disabled={loading}>
              {loading ? "Registrando..." : "Registrar"}
            </button>

          </form>

          <div className="register-footer">
            <p className="register-footer-text">
              ¿Ya tienes una cuenta?
              <Link className="register-footer-link" to="/admin/login">
                Iniciar sesión
              </Link>
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}

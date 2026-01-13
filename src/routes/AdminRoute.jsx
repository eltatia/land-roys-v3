import { Navigate } from "react-router-dom";
import { supabase } from "../services/Supabase.js";
import { useEffect, useState } from "react";
import Loading from "../components/ui/Loading.jsx";

export default function AdminRoute({ children }) {
  const [session, setSession] = useState(undefined); // undefined = aún cargando
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1️⃣ Escuchar sesión en tiempo real
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // 2️⃣ Cuando session cambie, verificar rol
  useEffect(() => {
    async function verifyRole() {
      // aún no se ha cargado session → mostrar loading
      if (session === undefined) return;

      // no hay sesión → NO permitir
      if (session === null) {
        setAllowed(false);
        setLoading(false);
        return;
      }

      // hay sesión → verificar rol
      const user = session.user;

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "admin" || profile?.role === "assistant") {
        setAllowed(true);
      } else {
        setAllowed(false);
      }

      setLoading(false);
    }

    verifyRole();
  }, [session]);

  // 3️⃣ Loading real mientras session === undefined
  if (loading || session === undefined) return <Loading />;

  // 4️⃣ Si no está permitido → login
  if (!allowed) return <Navigate to="/admin/login" replace />;

  return children;
}

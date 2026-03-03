import React, { useCallback, useEffect, useState } from "react";
import { supabase } from "../api/Supabase.provider";
import Landing from "../components/ui/Landing";

import { AuthContext } from "./AuthContextBase";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadRole = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from("usuario_rol")
        .select("rol(nombre_rol)")
        .eq("id_usuario", userId)
        .single();

      if (!error && data?.rol?.nombre_rol) {
        setRole(data.rol.nombre_rol);
      } else {
        setRole(null);
      }
    } catch (err) {
      console.error("Error cargando rol:", err);
      setRole(null);
    }
  }, []);

  const initAuth = useCallback(async () => {
    setLoading(true);
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) throw error;

      if (session?.user) {
        setUser(session.user);
        await loadRole(session.user.id);
      } else {
        setUser(null);
        setRole(null);
      }
    } catch (err) {
      console.error("Error inicializando sesión:", err);
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  }, [loadRole]);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const loggedUser = data.user || data.session?.user;
    if (!loggedUser) throw new Error("No se pudo iniciar sesión");

    setUser(loggedUser);
    await loadRole(loggedUser.id);
    return loggedUser;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    setUser(null);
    setRole(null);
  };

  useEffect(() => {
    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        loadRole(session.user.id);
      } else {
        setUser(null);
        setRole(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [initAuth, loadRole]);

  return (
    <AuthContext.Provider value={{ user, role, login, logout, loading }}>
      {loading ? <Landing /> : children}
    </AuthContext.Provider>
  );
};

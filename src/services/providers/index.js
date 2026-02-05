import { AuthSupabaseProvider } from "../../api/auth.supabase";
// import { AuthFirebaseProvider } from "./auth.firebase";

const provider = import.meta.env.VITE_AUTH_PROVIDER || "supabase";

export function getAuthProvider() {
  if (provider === "supabase") return AuthSupabaseProvider;
  // if (provider === "firebase") return AuthFirebaseProvider;

  throw new Error("Proveedor de auth no soportado");
}

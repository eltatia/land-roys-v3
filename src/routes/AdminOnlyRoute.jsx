import { Navigate } from "react-router-dom";
import { supabase } from "../services/Supabase.js";
import { useEffect, useState } from "react";
import Loading from "../components/ui/Loading.jsx";

export default function AdminOnlyRoute({ children }) {
    const [session, setSession] = useState(undefined);
    const [allowed, setAllowed] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, newSession) => {
                setSession(newSession);
            }
        );

        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    useEffect(() => {
        async function verifyRole() {
            if (session === undefined) return;

            if (session === null) {
                setAllowed(false);
                setLoading(false);
                return;
            }

            const user = session.user;

            const { data: profile } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", user.id)
                .single();

            // ESTRICTAMENTE ADMIN
            if (profile?.role === "admin") {
                setAllowed(true);
            } else {
                setAllowed(false);
            }

            setLoading(false);
        }

        verifyRole();
    }, [session]);

    if (loading || session === undefined) return <Loading />;

    if (!allowed) return <Navigate to="/admin" replace />;

    return children;
}

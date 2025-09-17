import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

// ProtectedRoute supports a development bypass flag. To skip auth checks locally,
// set localStorage.setItem('DEV_BYPASS_AUTH', 'true') (or use the landing "Skip login" button).
export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    // Developer bypass: if DEV_BYPASS_AUTH is set to 'true', treat user as authenticated
    const devBypass = localStorage.getItem("DEV_BYPASS_AUTH") === "true";
    if (devBypass) {
      setAuthed(true);
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setAuthed(false);
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!mounted) return;
        if (res.ok) {
          setAuthed(true);
        } else {
          setAuthed(false);
          localStorage.removeItem("token");
        }
      } catch (e) {
        setAuthed(false);
        localStorage.removeItem("token");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return null;
  if (!authed)
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  return <>{children}</>;
}

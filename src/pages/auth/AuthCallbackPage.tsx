import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { clearAuth, ensureAuth } from "../../shared/authReady";

export default function AuthCallbackPage() {
  const nav = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    (async () => {
      try {
        await ensureAuth();
        const next = new URLSearchParams(loc.search).get("next") || "/home";
        nav(next, { replace: true });

      } catch {
        clearAuth();
        nav("/login", { replace: true });
      }
    })();
  }, [loc.search, nav]);

  return null;
}

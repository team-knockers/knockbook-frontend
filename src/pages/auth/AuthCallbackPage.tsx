import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthService } from "../../service/AuthService";
import { useSession } from "../../hooks/useSession";

export default function AuthCallbackPage() {
  const nav = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    (async () => {
      try {
        const { accessToken } = await AuthService.refreshAccessToken();
        const payload = JSON.parse(atob(accessToken.split(".")[1]));
        const userId = String(payload.sub);
        console.log(userId);
        useSession.setState({ userId });
        
        const next = new URLSearchParams(loc.search).get("next") || "/home";
        nav(next, { replace: true });
      } catch {
        try { useSession.getState().clear?.(); } catch {}
        nav("/login", { replace: true });
      }
    })();
  }, [loc.search, nav]);

  return null;
}

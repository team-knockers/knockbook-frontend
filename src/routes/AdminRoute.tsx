import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { ensureUser } from "../shared/authReady";

export default function AdminRoute({ children }: { children: JSX.Element }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const me = await ensureUser();
        setUser(me);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) { 
    return null;
  }

  if (!user) { 
    return <Navigate to="/login" replace />;
  }

  const role = user.role;
  const isStaff = role === "ADMIN" || role === "MODERATOR";

  return isStaff ? children : <Navigate to="/" replace />;
}


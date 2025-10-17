import { Outlet, redirect, useRouteLoaderData } from "react-router-dom";
import { UserService } from "../features/account/services/UserService";
import { ApiError } from "../types/http";
import { useSession } from "../hooks/useSession";
import { AuthService } from "../service/AuthService";

export const AUTH_LOADER_ID = "auth";

export async function authLoader() {
  try {
    const me = await UserService.getMyProfile();
    return me;
  } catch (e: any) {
    const isApiErr = e instanceof ApiError;
    const status = isApiErr ? e.problem?.status : undefined;
    const codeOrMsg = isApiErr ? e.problem?.title || e.problem?.detail : e?.message;

    const isUnauthed = status === 401 || status === 403 || codeOrMsg === "NO_USER";

    if (!isUnauthed) {
      throw e;
    }

    try {
      await AuthService.refreshAccessToken();
      const me = await UserService.getMyProfile();
      return me;
    } catch {
      try { useSession.getState().clear?.(); } catch {}
      throw redirect("/login");
    }
  }
}

export default function AuthLayout() {
  useRouteLoaderData(AUTH_LOADER_ID);
  return <Outlet />;
}

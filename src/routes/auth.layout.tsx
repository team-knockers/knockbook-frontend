import { Outlet, redirect, useRouteLoaderData } from "react-router-dom";
import { UserService } from "../features/account/services/UserService";
import { ApiError } from "../types/http";
import { AuthService } from "../features/onboarding/services/AuthService";

export const AUTH_LOADER_ID = "auth";

export async function authLoader() {
  try {
    return await UserService.getMyProfile();
  } catch (e: any) {
    if (e?.message === "NO_USER") {
      await AuthService.logout();
      throw redirect("/login");
    }
    if (e instanceof ApiError && 
      (e.problem?.status === 401 || e.problem?.status === 403)) {
      await AuthService.logout();
      throw redirect("/login");
    }
    throw e;
  }
}

export default function AuthLayout() {
  useRouteLoaderData(AUTH_LOADER_ID);
  return <Outlet />;
}


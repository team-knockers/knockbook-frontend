import { apiPublicJson, apiAuthJson } from '../../../shared/api';
import { tokenStore } from '../../../types/tokenStore';
import type { LoginRequest, LoginResponse } from '../types';

export const AuthService = {
  // Receive accessToken and store in memory
  // refresh cookie is managed by the server
  async localLogin(req: LoginRequest) {
    const res = await apiPublicJson<LoginResponse, LoginRequest>(
      "/auth/local/login", {
        method: "POST",
        json: req,
      });
      tokenStore.set(res.accessToken);
      return res;
  },

  // Invalidate refresh token on server
  // ans remove access token on client
  async logout() {
    try {
      await apiAuthJson<void>(
        "/auth/token/logout", { method: "POST" });
    } finally {
      tokenStore.clear();
    }
  }
};
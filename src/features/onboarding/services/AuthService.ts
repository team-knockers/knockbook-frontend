import { apiPublicJson } from '../../../shared/api';
import { sessionStore } from '../../../types/sessionStore';
import type { LoginRequest, LoginResponse } from '../types';
import type { SendCodeRequest, SendCodeResponse } from '../types';
import type { GetCodeRequest, GetCodeResponse } from '../types'

export const AuthService = {

  async getCode(email: string) {
    const req = { email: email } as GetCodeRequest;
    const res = await apiPublicJson<GetCodeResponse, GetCodeRequest>(
      "/auth/local/register/email", { method: "POST", json: req });
    return res;
  },

  async sendCode(code: string) {
    const token = sessionStore.getEmailVarificationToken();
    const req = { code: code, EmailVerificationToken: token } as SendCodeRequest;
    const res = await apiPublicJson<SendCodeResponse, SendCodeRequest>(
    req.EmailVerificationToken = 
      "/auth/local/register/email/verify", { method: "POST", json: req });
    return res;
  },

  // Receive accessToken and store in memory
  // refresh cookie is managed by the server
  async localLogin(req: LoginRequest) {
    const res = await apiPublicJson<LoginResponse, LoginRequest>(
      "/auth/local/login", { method: "POST", json: req });
      sessionStore.init(res.accessToken, res.userId);
      return res;
  },

  // Invalidate refresh token on server
  // ans remove access token on client
  async logout() {
    try {
      await apiPublicJson<void>("/auth/token/logout", { method: "POST" });
    } finally {
      sessionStore.clear();
    }
  }
};

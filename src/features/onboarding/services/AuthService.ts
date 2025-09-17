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
    sessionStore.setEmailVerificationToken(res.emailVerificationToken);
    console.log(res);
    return res;
  },

  async sendCode(code: string) {
    const token = sessionStore.getEmailVerificationToken();
    const req = { code: code, emailVerificationToken: token } as SendCodeRequest;
    console.log(req);
    const res = await apiPublicJson<SendCodeResponse, SendCodeRequest>(
      "/auth/local/register/email/verify", { method: "POST", json: req });
    sessionStore.setRegistrationToken(res.registrationToken);
    console.log(res);
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

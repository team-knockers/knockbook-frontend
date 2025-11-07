import { apiPublicJson } from "../shared/api";
import { useSignupFlow } from "../features/onboarding/hooks/useSignupFlow";
import type {
  LoginRequest, LoginResponse,
  GetCodeRequest, GetCodeResponse,
  SendCodeRequest, SendCodeResponse,
  CompleteRegistrationRequest, CompleteRegistrationResponse,
} from "../features/onboarding/types";
import { clearAuth, resetAuthCacheForLogin } from "../shared/authReady";

export const AuthService = {
  async getCode(email: string) {
    const req: GetCodeRequest = { email };
    const res = await apiPublicJson<GetCodeResponse, GetCodeRequest>(
      "/auth/local/register/email",
      { method: "POST", json: req }
    );
    useSignupFlow.getState().setEmail(email);
    useSignupFlow.getState().setVerificationToken(res.emailVerificationToken);
    return res;
  },

  async sendCode(code: string) {
    const { emailVerificationToken } = useSignupFlow.getState();

    if (!emailVerificationToken) {
      throw new Error("Has no email verification token");
    }
    if (!/^\d{6}$/.test(code)) {
      throw new Error("Expected 6 digit code");
    }

    const req: SendCodeRequest = { code, emailVerificationToken };
    const res = await apiPublicJson<SendCodeResponse, SendCodeRequest>(
      "/auth/local/register/email/verify",
      { method: "POST", json: req }
    );
    useSignupFlow.getState().setRegistrationToken(res.registrationToken);
    return res;
  },

  async completeRegistration() {
    const { registrationToken, password, displayName } = useSignupFlow.getState();

    if (!registrationToken) {
      throw new Error("Has no registration token");
    }
    if (!password || !displayName) {
      throw new Error("Expected both password and displayname");
    }

    const req: CompleteRegistrationRequest = { registrationToken, password, displayName };
    const res = await apiPublicJson<CompleteRegistrationResponse, CompleteRegistrationRequest>(
      "/auth/local/register/complete",
      { method: "POST", json: req }
    );
    resetAuthCacheForLogin(res.accessToken, res.userId);
    useSignupFlow.getState().reset();
    return res;
  },

  async localLogin(req: LoginRequest) {
    const res = await apiPublicJson<LoginResponse, LoginRequest>(
      "/auth/local/login",
      { method: "POST", json: req }
    );
    resetAuthCacheForLogin(res.accessToken, res.userId);    
    return res;
  },

  async logout() {
    try {
      await apiPublicJson<void>("/auth/token/logout", { method: "POST" });
    } finally {
      clearAuth();
    }
  },

  async refreshAccessToken() {
    const res = await apiPublicJson<{ accessToken: string, userId: string }>(
      "/auth/token/refresh",
      { method: "POST" }
    );
    resetAuthCacheForLogin(res.accessToken, res.userId);
    return res;
  },
};

import { apiPublicJson } from '../../../shared/api';
import { useSession } from '../../../hooks/useSession';
import { useSignupFlow } from '../hooks/useSignupFlow';
import type { LoginRequest, LoginResponse } from '../types';
import type { CompleteRegistrationRequest, CompleteRegistrationResponse } from '../types';
import type { SendCodeRequest, SendCodeResponse } from '../types';
import type { GetCodeRequest, GetCodeResponse } from '../types'

export const AuthService = {

  async getCode(email: string) {
    const req = { email: email } as GetCodeRequest;
    const res = await apiPublicJson<GetCodeResponse, GetCodeRequest>(
      "/auth/local/register/email",
      { method: "POST", json: req });
    useSession.setState({ emailVerificationToken: res.emailVerificationToken });
    console.log(res);
    return res;
  },

  async sendCode(code: string) {
    const { emailVerificationToken } = useSession.getState();
    const req = { 
      code: code,
      emailVerificationToken: emailVerificationToken
    } as SendCodeRequest;
    console.log(req);
    const res = await apiPublicJson<SendCodeResponse, SendCodeRequest>(
      "/auth/local/register/email/verify",
      { method: "POST", json: req });
    useSession.setState({ registrationToken: res.registrationToken });
    console.log(res);
    return res;
  },

  async completeRegistration() {
    const { password, displayName } = useSignupFlow.getState();
    const { registrationToken } = useSession.getState();
    const req = {
      registrationToken: registrationToken,
      password: password,
      displayName: displayName,
    } as CompleteRegistrationRequest;
    console.log(req);
    const res = await apiPublicJson<CompleteRegistrationResponse, CompleteRegistrationRequest>(
      "/auth/local/register/complete",
      { method: "POST", json: req });
    console.log(res);
    useSession.setState({ 
      accessToken: res.accessToken,
      userId: res.userId,
    });
    useSignupFlow.getState().reset();
  },

  // Receive accessToken and store in memory
  // refresh cookie is managed by the server
  async localLogin(req: LoginRequest) {
    const res = await apiPublicJson<LoginResponse, LoginRequest>(
      "/auth/local/login",
      { method: "POST", json: req });
      useSession.setState({
        accessToken: res.accessToken,
        userId: res.userId });
      return res;
  },

  // Invalidate refresh token on server
  // ans remove access token on client
  async logout() {
    try {
      await apiPublicJson<void>(
        "/auth/token/logout",
        { method: "POST" });
    } finally {
      useSession.getState().clear();
    }
  }
};

import { apiAuthPath, apiAuthPathWithJson } from "../../../shared/api";
import { useSession } from "../../../hooks/useSession";
import type { ChangePasswordRequest, VerifyPasswordRequest, GetMyProfileResponse } from "../types";

export const UserService = {
  
  async getMyProfile() {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }
    return await apiAuthPath<GetMyProfileResponse>(
      "/users/{userId}",
      { userId : userId },
      { method: "GET" }
    )
  },

  async changePassword(password: string) {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }
    const req = { password : password } as ChangePasswordRequest;
    console.log(req);
    return await apiAuthPathWithJson<void, ChangePasswordRequest>(
      "/users/{userId}/password",
      { userId : userId },
      { method: "PUT", json: req });
  },

  async verifyPassword(password : string) {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }
    const req = { password : password } as VerifyPasswordRequest;
    console.log(req);
    return await apiAuthPathWithJson<void, VerifyPasswordRequest>(
      "/users/{userId}/password/verify",
      { userId : userId },
      { method: "POST", json: req });
  },
}

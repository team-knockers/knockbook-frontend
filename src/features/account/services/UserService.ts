import { apiAuthPath } from "../../../shared/api";
import { sessionStore } from "../../../types/sessionStore";
import type { GetMyProfileResponse } from "../types";

export const UserService = {
  
  async getMyProfile() {
    const userId = sessionStore.getUserId();

    if (!userId) {
      throw new Error("NO_USER");
    }

    return await apiAuthPath<GetMyProfileResponse>(
      "/users/{userId}",
      { userId : userId }
    )
  },
}

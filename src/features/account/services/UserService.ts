import { apiAuthPath } from "../../../shared/api";
import { useSession } from "../../../hooks/useSession";
import type { GetMyProfileResponse } from "../types";

export const UserService = {
  
  async getMyProfile() {
    const { userId } = useSession.getState();

    if (!userId) {
      throw new Error("NO_USER");
    }

    return await apiAuthPath<GetMyProfileResponse>(
      "/users/{userId}",
      { userId : userId }
    )
  },
}

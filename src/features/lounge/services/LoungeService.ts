import { apiAuthPath, apiAuthPathAndQuery } from "../../../shared/api";
import { useSession } from "../../../hooks/useSession";
import type { LoungePostDetails, LoungePostsSummaryApiResponse } from "../types";

export const LoungeService = {

  // API-LOUNGE-01 : Fetch paginated lounge post summaries
  async getPaginatedLoungePostSummaries(
    page: number,
    size: number,
    sortBy?: string,

  ): Promise<LoungePostsSummaryApiResponse> {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }
    if (page == null) { throw new Error("NO_PAGE"); }
    if (size == null) { throw new Error("NO_SIZE"); }

    return apiAuthPathAndQuery<LoungePostsSummaryApiResponse>(
      "/lounge/{userId}",
      { userId: userId },
      { page, size, sortBy },
      { method: "GET" }
    );
  },

  // API-LOUNGE-02 : Fetch detailed information for a single lounge post
  async getLoungePostDetails(
    postId: string
  ): Promise<LoungePostDetails> {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }

    return apiAuthPath<LoungePostDetails>(
      "/lounge/{userId}/{postId}",
      { userId, postId },
      { method: "GET" }
    );
  },
};

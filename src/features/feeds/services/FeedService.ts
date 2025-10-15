import { useSession } from "../../../hooks/useSession";
import type { FeedPostList, FeedProfile } from "../types";
import {  apiAuthPathAndQuery } from "../../../shared/api";

export const FeedService = {

  async getFeedPostList(
    size: number,
    after: string | null,
    searchKeyword?: string
  ): Promise<FeedPostList> {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }

    const q = {
      size,
      ...(after ? { after } : {}),
      ...(searchKeyword && searchKeyword.trim() ? { searchKeyword: searchKeyword.trim() } : {}),
    };

    return apiAuthPathAndQuery<FeedPostList>(
      "/feeds/{userId}",
      { userId },
      q,
      { method: "GET" }
    );
  },

  async getFeedProfile(
    size: number,
    after: string | null
  ): Promise<FeedProfile> {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }

    const q = {
      size,
      ...(after ? { after } : {}),
    };

    return apiAuthPathAndQuery<FeedProfile>(
      "/feeds/profile/{userId}",
      { userId },
      q,
      { method: "GET" }
    );
  },
  
}

import { useSession } from "../../../hooks/useSession";
import type { FeedPostList, FeedPostCommentList, FeedPostDetail, FeedPostComment, FeedProfileThumbnail, FeedProfileThumbnailList } from "../types";
import { apiAuthMultipartPath, apiAuthPathAndQuery } from "../../../shared/api";

export const FeedService = {

  async getFeedPostList(
    size: number,
    after: string | null,
    searchKeyword?: string,
    mbti?: string
  ): Promise<FeedPostList> {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }

    const q = {
      size,
      ...(after ? { after } : {}),
      ...(searchKeyword && searchKeyword.trim() ? { searchKeyword: searchKeyword.trim() } : {}),
      ...(mbti && mbti.trim() ? { mbti: mbti.trim().toUpperCase() } : {}),
    };

    return apiAuthPathAndQuery<FeedPostList>(
      "/feeds/{userId}",
      { userId },
      q,
      { method: "GET" }
    );
  },

  async getProfilePostThumbnails(
    size: number,
    after: string | null
  ): Promise<FeedProfileThumbnailList> {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }

    const q = {
      size,
      ...(after ? { after } : {}),
    };

    return apiAuthPathAndQuery<FeedProfileThumbnailList>(
      "/feeds/profile/post/{userId}",
      { userId },
      q,
      { method: "GET" }
    );
  },

  async getProfileSavedThumbnails(
    size: number,
    after: string | null
  ): Promise<FeedProfileThumbnailList> {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }

    const q = {
      size,
      ...(after ? { after } : {}),
    };

    return apiAuthPathAndQuery<FeedProfileThumbnailList>(
      "/feeds/profile/saved/{userId}",
      { userId },
      q,
      { method: "GET" }
    );
  },

  async getFeedPostCommentList(
    postId: string
  ): Promise<FeedPostCommentList> {
      const { userId } = useSession.getState();
      if (!userId) { throw new Error("NO_USER"); }

    return apiAuthPathAndQuery<FeedPostCommentList>(
      "/feeds/post/{postId}/comments/{userId}",
      { postId, userId },
      undefined,
      { method: "GET" }
    );
  },
  
  async getFeedPostWithCommentList(
    postId: string
  ): Promise<FeedPostDetail> {
      const { userId } = useSession.getState();
      if (!userId) { throw new Error("NO_USER"); }

    return apiAuthPathAndQuery<FeedPostDetail>(
      "/feeds/post/{postId}/{userId}",
      { postId, userId },
      undefined,
      { method: "GET" }
    );
  },

  async likePost(
    postId: string
  ): Promise<void> {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }
    
    return apiAuthPathAndQuery<void>(
      "/feeds/post/{postId}/likes/{userId}",
      { postId, userId },
      undefined,
      { method: "PUT" }
    );
  },

  async unlikePost(
    postId: string
  ): Promise<void> {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }

    return apiAuthPathAndQuery<void>(
      "/feeds/post/{postId}/likes/{userId}",
      { postId, userId },
      undefined,
      { method: "DELETE" }
    );
  },

  async likeComment(commentId: string): Promise<void> {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }

    return apiAuthPathAndQuery<void>(
      "/feeds/comment/{commentId}/likes/{userId}",
      { commentId, userId },
      undefined,
      { method: "PUT" }
    );
  },

  async unlikeComment(commentId: string): Promise<void> {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }

    return apiAuthPathAndQuery<void>(
      "/feeds/comment/{commentId}/likes/{userId}",
      { commentId, userId },
      undefined,
      { method: "DELETE" }
    );
  },

  async createComment(postId: string, body: string): Promise<FeedPostComment> {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }

    return apiAuthPathAndQuery<FeedPostComment>(
      "/feeds/comment/{postId}/{userId}",
      { postId, userId },
      undefined,
      { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentBody: body.trim().slice(0, 500) }),
      }
    );
  },

  async createPost(
    content: string,
    files: File[]
  ): Promise<FeedProfileThumbnail> {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }

    const form = new FormData();
    form.append("content", content);
    files.forEach((f: File) => form.append("files", f));

    return apiAuthMultipartPath<FeedProfileThumbnail>(
      "/feeds/post/{userId}",
      { userId },
      form,
      { method: "POST" }
    );
  },

  async deleteComment(
    commentId: string
  ): Promise<void> {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }

    return apiAuthPathAndQuery(
      "/feeds/comment/{commentId}/{userId}",
      { commentId, userId },
      undefined,
      { method: "DELETE" }
    );
  },

  async deletePost(
    postId: string
  ): Promise<void> {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }

    return apiAuthPathAndQuery(
      "/feeds/post/{postId}/{userId}",
      { postId, userId },
      undefined,
      { method: "DELETE" }
    );
  }
}

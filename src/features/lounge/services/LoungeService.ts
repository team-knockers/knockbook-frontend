import { apiAuthMultipartPath, apiAuthPath, apiAuthPathAndQuery, apiAuthPathWithJson } from "../../../shared/api";
import { useSession } from "../../../hooks/useSession";
import type { CreateCommentRequest, LoungePostDetails, LoungePostsSummaryApiResponse, 
  CreateLoungePostCommentResponse, GetLoungePostCommentsResponse , GetLoungePostCommentResponse, 
  UpdateLoungePostCommentResponse, UpdateCommentRequest, LoungePostLikeStatusResponse, 
  LoungePostCreateResponse} from "../types";

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

  // API-LOUNGE-03: Create a comment and return the updated page of comments
  async createComment(
    postId: string,
    content: string
  ): Promise<CreateLoungePostCommentResponse> {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }

    const req : CreateCommentRequest = { content };
    return await apiAuthPathWithJson<CreateLoungePostCommentResponse, CreateCommentRequest>(
      "/lounge/{userId}/{postId}/comments",
      { userId, postId },
      { method: "POST", json: req }
    );
  },

  // API-LOUNGE-04: Get multiple comments with pagination (1-based page)
  async getCommentsByPost(
    postId: string, 
    page = 1, 
    size = 20
  ): Promise<GetLoungePostCommentsResponse> {
    const { userId } = useSession.getState();
    if (!userId) throw new Error("NO_USER");

    return await apiAuthPathAndQuery<GetLoungePostCommentsResponse>(
      "/lounge/{userId}/{postId}/comments",
      { userId, postId },
      { page, size },
      { method: "GET" }
    );
  },

  // API-LOUNGE-05: Get a single comment (for edit preview)
  async getCommentById(
    commentId: string
  ):Promise<GetLoungePostCommentResponse> {
    const { userId } = useSession.getState();
    if (!userId) throw new Error("NO_USER");

    return await apiAuthPath<GetLoungePostCommentResponse>(
      "/lounge/{userId}/comments/{commentId}",
      { userId, commentId },
      { method: "GET" }
    );
  },

  // API-LOUNGE-06: Update a comment and return the updated page
  async updateComment(
    commentId: string,
    content: string
  ): Promise<UpdateLoungePostCommentResponse> {
    const { userId } = useSession.getState();
    if (!userId) throw new Error("NO_USER");

    const req: UpdateCommentRequest = { content };
    return await apiAuthPathWithJson<UpdateLoungePostCommentResponse, UpdateCommentRequest>(
      "/lounge/{userId}/comments/{commentId}",
      { userId, commentId },
      { method: "PUT", json: req }
    );
  },

  // API-LOUNGE-07: Delete a comment and return the updated page
  async deleteComment(
    commentId: string
  ): Promise<void> {
    const { userId } = useSession.getState();
    if (!userId) throw new Error("NO_USER");

    return await apiAuthPath<void>(
      "/lounge/{userId}/comments/{commentId}",
      { userId, commentId },
      { method: "DELETE" }
    );
  },

  // API-LOUNGE-08: Like post
  async likePost(
    postId: string
  ): Promise<void>  {
    const { userId } = useSession.getState();
    if (!userId) throw new Error("NO_USER");

    return await apiAuthPath<void>(
      "/lounge/{userId}/{postId}/likes",
      { userId, postId },
      { method: "PUT" }
    );
  },

  // API-LOUNGE-09: Unike post
  async unlikePost(
    postId: string
  ): Promise<void>  {
    const { userId } = useSession.getState();
    if (!userId) throw new Error("NO_USER");

    return await apiAuthPath<void>(
      "/lounge/{userId}/{postId}/likes",
      { userId, postId },
      { method: "DELETE" }
    );
  },

  // API-LOUNGE-10: Check if the current user has liked a post
  async isPostLiked(
    postId: string
  ): Promise<LoungePostLikeStatusResponse> {
    const { userId } = useSession.getState();
    if (!userId) throw new Error("NO_USER");

    return await apiAuthPath<LoungePostLikeStatusResponse>(
      "/lounge/{userId}/{postId}/likes",
      { userId, postId },
      { method: "GET" }
    );
  },

  // API-LOUNGE-11: Register a new lounge post with optional images
  async registerLoungePost(
    title: string,
    subtitle: string | null,
    content: string,
    images?: File[]
  ) {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }

    const form = new FormData();
    form.append("post", new Blob([JSON.stringify({ title, subtitle, content })], { type: "application/json" }));

    images?.forEach((f: File) => form.append("images", f));

    return apiAuthMultipartPath<LoungePostCreateResponse>(
      "/lounge/{userId}/posts",
      { userId },
      form,
      { method: "POST" }
    );
  }
};

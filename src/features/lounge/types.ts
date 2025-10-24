export type LoungePostsSummary = {
  id: string;
  displayName: string;
  title: string;
  previewImageUrl: string;
  likeCount: number;
  createdAt: string;
};

export type LoungePostsSummaryApiResponse = {
  posts: LoungePostsSummary[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
};

export type LoungePostDetails = {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  title: string;
  subtitle: string;
  content: string;
  likeCount: number;
  createdAt: string;
};

export type LoungePostPageState = {
  page: number;
  size: number;
  sortBy: 'newest' | 'popular';
};

export type CreateCommentRequest = {
  content: string;
}

export type UpdateCommentRequest = {
  content: string;
}

export type LoungePostComment = {
  id: string;
  postId: string;
  userId: string;
  displayName: string;
  avatarUrl: string;
  content: string;
  createdAt: string;
  editStatus?: string | null;
};

export type LoungePostCommentsPageResponse = {
  comments: LoungePostComment[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
};

export type CurrentUserInfo = {
  id: string;
  displayName: string;
  avatarUrl: string;
};

// API-LOUNGE-03: Create a comment → Returns the created comment after creation
export type CreateLoungePostCommentResponse = LoungePostComment;

// API-LOUNGE-04: Get multiple comments
export type GetLoungePostCommentsResponse = LoungePostCommentsPageResponse;

// API-LOUNGE-05: Get a single comment
export type GetLoungePostCommentResponse = LoungePostComment;

// API-LOUNGE-06: Update comment → Returns the updated comment after modification
export type UpdateLoungePostCommentResponse = LoungePostComment;

// API-LOUNGE-10: Check if the current user has liked a post → Returns the like status of the post
export type LoungePostLikeStatusResponse = {
  liked: boolean;
}

// API-LOUNGE-11: Create a lounge post → Returns the created post's ID and creation timestamp
export type LoungePostCreateResponse = {
  id: string;
  createdAt: string;
}

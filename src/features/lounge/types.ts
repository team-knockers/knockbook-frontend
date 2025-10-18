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

export type LoungePostComment = {
  id: string;
  postId: string;
  userId: string;
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

// API-LOUNGE-03: Create a comment → 댓글 생성 후 전체 댓글 페이지 반환
export type CreateLoungePostCommentResponse = LoungePostCommentsPageResponse;

// API-LOUNGE-04: Get multiple comments
export type GetLoungePostCommentsResponse = LoungePostCommentsPageResponse;

// API-LOUNGE-05: Get a single comment
export type GetLoungePostCommentResponse = LoungePostComment;

// API-LOUNGE-06: Update comment → 수정 후 전체 댓글 페이지 반환
export type UpdateLoungePostCommentResponse = LoungePostCommentsPageResponse;

// API-LOUNGE-07: Delete comment → 삭제 후 전체 댓글 페이지 반환
export type DeleteLoungePostCommentResponse = LoungePostCommentsPageResponse;

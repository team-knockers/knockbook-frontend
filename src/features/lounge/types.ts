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

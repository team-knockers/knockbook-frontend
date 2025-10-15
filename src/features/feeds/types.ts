export type FeedImages = {
  id: string;
  url: string;
};

export type FeedPost = {
  postId: string; 
  userId: string; 
  displayName: string; 
  avatarUrl: string | null;
  content: string; 
  images: string[]; 
  likesCount: number; 
  commentsCount: number;
  likedByMe: boolean; 
  createdAt: string;
};

export type FeedPostList = {
  feedPosts: FeedPost[];
  nextAfter: string | null;
};

export type FeedProfileThumbnail = { 
  postId: string; 
  thumbnailUrl: string 
};

export type FeedProfile = {
  userId: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  postsCount: number;
  profileThumbnails: FeedProfileThumbnail[];
  nextAfter: string | null;
};

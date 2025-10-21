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
  savedByMe: boolean;
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

export type FeedProfileThumbnailList = {
  postsCount: number;
  nextAfter: string | null;
  profileThumbnails: FeedProfileThumbnail[];
};

export type FeedPostComment = {
  commentId: string;
  userId: string;
  displayName: string | null;
  avatarUrl: string | null;
  body: string;
  createdAt: string;
  likedByMe: boolean;
  likesCount: number;
}

export type FeedPostCommentList = {
  postId: string;
  feedComments: FeedPostComment[];
}

export type FeedPostDetail = {
  feedPost: FeedPost;
  feedComments: FeedPostComment[];
}

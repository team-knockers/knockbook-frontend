import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { useLoaderData } from 'react-router-dom';
import s from './LoungePostPage.module.css'
import type { LoungePostLoaderData } from './LoungePost.loader';
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io"
import { TfiCommentAlt } from "react-icons/tfi";
import { useState } from 'react';

export default function LoungePostPage() {
  const { postDetails } = useLoaderData() as LoungePostLoaderData;
  const [isLiked, setIsLiked] = useState(false); // Post like status

  const onPostLikeToggled = () => {
    setIsLiked(prev => !prev);
  };

  return (
    <div className={s['page-layout']}>
      <div className={s['lounge-post-header']}>
        <div className={s['header-content']}>
          <h1 className={s['header-title']}>{postDetails.title}</h1>
          <p className={s['header-subtitle']}>{postDetails.subtitle}</p>
        </div>

        <div className={s['post-meta']}>
          <span className={s['ico-by']}>by</span>
          <span className={s['author-name']}>{postDetails.displayName}</span>
          <span className={s['separator']}>·</span>
          <span className={s['post-date']}>{postDetails.createdAt}</span>
        </div>
      </div>
      <div className={s['post-content']}>
        <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
          {postDetails.content}
        </ReactMarkdown>

      </div>
      <div className={s['post-interaction']}>
        <button className={s['like-btn']} onClick={onPostLikeToggled}>
          {isLiked ? (
            <IoMdHeart
              color="#f73936ff"
            />
          ) : (
            <IoMdHeartEmpty
            />
          )}
          {postDetails.likeCount}
        </button>
        <button className={s['comment-btn']}>
          <TfiCommentAlt />
          댓글
        </button>
      </div>
      <div className={s['author-info']}>
        <img
          className={s['profile-picture']}
          src={postDetails.avatarUrl}
          alt={`${postDetails.displayName}의 프로필 사진`} 
        />          
        <p>{postDetails.displayName}</p>
        <span>{postDetails.bio}</span>
      </div>
    </div>
  )
}
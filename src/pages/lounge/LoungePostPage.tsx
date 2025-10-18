import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { useLoaderData } from 'react-router-dom';
import s from './LoungePostPage.module.css'
import type { LoungePostLoaderData } from './LoungePost.loader';
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io"
import { TfiCommentAlt } from "react-icons/tfi";
import { useState } from 'react';
import { TfiMoreAlt } from "react-icons/tfi";

export default function LoungePostPage() {
  const { postDetails } = useLoaderData() as LoungePostLoaderData;
  const [isLiked, setIsLiked] = useState(false); // Post like status
  const [isCommentOpen, setIsCommentOpen] = useState(false); // Post comment status

  const [openCommentMenuId, setOpenCommentMenuId] = useState<string | null>(null);

  const toggleCommentMenu = (commentId: string) => {
    setOpenCommentMenuId(prev => (prev === commentId ? null : commentId));
  };

  const onPostLikeToggled = () => {
    setIsLiked(prev => !prev);
  };

  const onPostCommentToggled = () => {
    setIsCommentOpen(prev => !prev);
  };

  const handleSubmitComment = () => {
    console.log('댓글이 제출되었습니다.');
  }

  const handleReportComment = (commentId: string) => {
    console.log('신고', commentId);
    setOpenCommentMenuId(null);
  };

  const handleEditComment = (commentId: string) => {
    console.log('수정', commentId);
    setOpenCommentMenuId(null);
  };

  const handleDeleteComment = (commentId: string) => {
    console.log('삭제', commentId);
    setOpenCommentMenuId(null);
  };

  // 데이터 연결 전 임시데이터
  const comments = [
    { id: '1', postId: '1', userid: '7', displayName: '호랭이', avatarUrl: 'https://i.pinimg.com/200x/ca/2a/ef/ca2aef5cd009f9811790d559f5d4e3d2.jpg', content: '좋은 글이에요!', createdAt: '2025-10-15', editStatus: null },
    { id: '2', postId: '1', userid: '8', displayName: '강아지', avatarUrl: 'https://i.pinimg.com/200x/ca/2a/ef/ca2aef5cd009f9811790d559f5d4e3d2.jpg', content: '정말 감사합니다.', createdAt: '2025-10-16', editStatus: '수정됨' },
    { id: '3', postId: '1', userid: '9', displayName: '고양이', avatarUrl: 'https://i.pinimg.com/200x/23/43/9e/23439e5b75335092d8e10af4776f44e7.jpg', content: '정말 유익했어요.', createdAt: '2025-10-16', editStatus: null },
    { id: '4', postId: '1', userid: '15', displayName: '토끼', avatarUrl: 'https://i.pinimg.com/200x/19/fd/a7/19fda7fd1edc919b5d887b319f0db00d.jpg', content: '항상 잘 보고 있어요.', createdAt: '2025-10-16', editStatus: null }
  ];

  const myInfo = {
    id: '8', displayName: '강아지', avatarUrl: 'https://i.pinimg.com/200x/ca/2a/ef/ca2aef5cd009f9811790d559f5d4e3d2.jpg', bio: '안녕하세요! 저는 호랭이입니다.'
};

  return (
    <main className={s['lounge-post-main']}>

      <header className={s['post-header']}>
        <div className={s['post-header__content']}>
          <h1 className={s['post-header__title']}>{postDetails.title}</h1>
          <p className={s['post-header__subtitle']}>{postDetails.subtitle}</p>
        </div>
        <div className={s['post-header__meta']}>
          <span className={s['post-header__meta-label']}>by</span>
          <span className={s['post-header__author-name']}>{postDetails.displayName}</span>
          <span className={s['post-header__separator']}>·</span>
          <span className={s['post-header__date']}>{postDetails.createdAt}</span>
        </div>
      </header>

      {/* Post Body */}
      <section className={s['post-body']}>
        <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
          {postDetails.content}
        </ReactMarkdown>
      </section>

      {/* Post Actions */}
      <section className={s['post-actions']}>
        <button className={s['post-actions__like-btn']} onClick={onPostLikeToggled}>
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
        <button className={s['post-actions__comment-btn']} onClick={onPostCommentToggled}>
          <TfiCommentAlt />
          댓글
        </button>
      </section>

      {/* Comments Section */}
      {isCommentOpen && (
        <section className={s['comments-section']}>
          <ul className={s['comments-section__list']}>
            {comments.map((comment) => (
              <li key={comment.id} className={s['comments-section__item']}>
                <div className={s['comments-section__item-container']}>
                  <img className={s['comments-section__item-author-avatar']}
                    src={comment.avatarUrl}
                    alt={`${comment.displayName}의 프로필 사진`} />
                  <div className={s['comments-section__item-body']}>
                    <div className={s['comments-section__item-meta']}>
                      <div className={s['comments-section__item-author-name-container']}>
                        <span className={s['comments-section__item-author-name']}>{comment.displayName}</span>
                      </div>
                      <span className={s['comments-section__item-date']}>{comment.createdAt}</span>
                      <span className={s['comments-section__item-edit-status']}>{comment.editStatus}</span>
                    </div>
                    <p className={s['comments-section__item-content']}>{comment.content}</p>
                  </div>
                  <div className={s['comments-section__item-menu']}>
                    <button
                      type="button"
                      className={s['comments-section__item-menu-btn']}
                      aria-expanded={openCommentMenuId === comment.id}
                      onClick={() => toggleCommentMenu(comment.id)}
                    >
                      <TfiMoreAlt />
                    </button>

                    {openCommentMenuId === comment.id && (
                      <div className={s['comments-section__item-menu-list']}>
                        {comment.userid === myInfo.id ? (
                          <>
                            <button
                              type="button"
                              className={s['comments-section__item-menu-option']}
                              onClick={() => handleEditComment(comment.id)}
                            >
                              수정
                            </button>
                            <button
                              type="button"
                              className={s['comments-section__item-menu-option']}
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              삭제
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            className={s['comments-section__item-menu-option']}
                            onClick={() => handleReportComment(comment.id)}
                          >
                            신고
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Comment Editor */}
          <div className={s['comment-editor']}>
            <div className={s['comment-editor__box']}>
              <div className={s['comment-editor__user']}>
                <img className={s['comment-editor__user-avatar']}
                  src={myInfo.avatarUrl}
                  alt={`${myInfo.displayName}의 프로필 사진`} />
                <span className={s['comment-editor__user-name']}>{myInfo.displayName}</span>
              </div>
              <input
                type="text"
                className={s['comment-editor__input']}
                placeholder="댓글을 작성해 주세요."
              />
              <div className={s['comment-editor__footer']}>
                <button
                  className={s['comment-editor__submit-btn']}
                  onClick={handleSubmitComment}
                >
                  등록
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Author Info */}
      <section className={s['post-author']}>
        <img
          className={s['post-author__avatar']}
          src={postDetails.avatarUrl}
          alt={`${postDetails.displayName}의 프로필 사진`} 
        />          
        <p className={s['post-author__name']}>{postDetails.displayName}</p>
        <span className={s['post-author__bio']}>{postDetails.bio}</span>
      </section>
    </main>
  )
}
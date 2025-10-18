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
    <div className={s['lounge-post-main']}>
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
        <button className={s['comment-btn']} onClick={onPostCommentToggled}>
          <TfiCommentAlt />
          댓글
        </button>
      </div>
      {isCommentOpen && (
        <div className={s['comments-section-container']}>
          <ul className={s['comment-section']}>
            {comments.map((comment) => (
              <li key={comment.id} className={s['comment-item']}>
                <div className={s['comment-container']}>
                  <img className={s['comment-user-profile-image']}
                    src={comment.avatarUrl}
                    alt={`${comment.displayName}의 프로필 사진`} />
                  <div className={s['comment-wrapper']}>
                    <div className={s['info-wrapper']}>
                      <div className={s['comment-user-name']}>
                        <span className={s['comment-user']}>{comment.displayName}</span>
                      </div>
                      <span className={s['comment-date']}>{comment.createdAt}</span>
                      <span className={s['comment-edit-status']}>{comment.editStatus}</span>
                    </div>
                    <p className={s['comment-content']}>{comment.content}</p>
                  </div>
                  <div className={s['comment-setting']}>
                    <button
                      type="button"
                      className={s['more-btn']}
                      aria-expanded={openCommentMenuId === comment.id}
                      onClick={() => toggleCommentMenu(comment.id)}
                    >
                      <TfiMoreAlt />
                    </button>

                    {openCommentMenuId === comment.id && (
                      <div className={s['comment-menu']}>
                        {comment.userid === myInfo.id ? (
                          <>
                            <button
                              type="button"
                              className={s['comment-menu-item']}
                              onClick={() => handleEditComment(comment.id)}
                            >
                              수정
                            </button>
                            <button
                              type="button"
                              className={s['comment-menu-item']}
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              삭제
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            className={s['comment-menu-item']}
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
          <div className={s['comment-writer-container']}>
            <div className={s['comment-write-box']}>
              <div className={s['current-user-info']}>
                <img className={s['current-user-profile-image']}
                  src={myInfo.avatarUrl}
                  alt={`${myInfo.displayName}의 프로필 사진`} />
                <span className={s['current-user-name']}>{myInfo.displayName}</span>
              </div>
              <input
                type="text"
                className={s['comment-input']}
                placeholder="댓글을 작성해 주세요."
              />
              <div className={s['editor-footer']}>
                <button
                  className={s['submit-button']}
                  onClick={handleSubmitComment}
                >
                  등록
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { useLoaderData, useNavigate } from 'react-router-dom';
import s from './LoungePostPage.module.css'
import type { LoungePostLoaderData } from './LoungePost.loader';
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io"
import { TfiCommentAlt } from "react-icons/tfi";
import { useEffect, useState, useRef } from 'react';
import { TfiMoreAlt } from "react-icons/tfi";
import { LoungeService } from '../../features/lounge/services/LoungeService';
import type { LoungePostComment, LoungePostCommentsPageResponse } from '../../features/lounge/types';
import { PATHS } from '../../routes/paths';

export default function LoungePostPage() {
// 1. navigate & Loader data
  const navigate = useNavigate();
  const { postDetails, currentUserInfo } = useLoaderData() as LoungePostLoaderData;

// 2. State, Ref & Initial Data
  // Post like / comment toggle
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(postDetails.likeCount);
  const [isCommentOpen, setIsCommentOpen] = useState(false);

  // Post: menu
  const [openPostMenuId, setOpenPostMenuId] = useState<string | null>(null);

  // Comments: menu & edit
  const [openCommentMenuId, setOpenCommentMenuId] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");

  // Comments: pagination / list data
  const [loadedPages, setLoadedPages] = useState<Array<{page: number; comments: LoungePostCommentsPageResponse['comments']}>>([]);
  const [commentsMeta, setCommentsMeta] = useState({ page: 1, size: 20, totalItems: 0, totalPages: 0 });
  const [displayCount, setDisplayCount] = useState<number>(20);
  const [pendingNewComments, setPendingNewComments] = useState<LoungePostCommentsPageResponse['comments']>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const inFlightPagesRef = useRef<Set<number>>(new Set())

  // Comments: editor
  const [newComment, setNewComment] = useState("");

  // Fetch initial like status for the post
  useEffect(() => {
  let cancelled = false;

  (async () => {
    try {
      const res = await LoungeService.isPostLiked(postDetails.id);
      if (!cancelled) {
        setIsLiked(res.liked);
      }
    } catch (err) {
      console.error("좋아요 상태 가져오기 실패", err);
    }
  })();

  return () => { cancelled = true; };
}, [postDetails.id]);

// 3. Derived logic
  // Return all comments from loaded pages plus any locally appended pending comments
  const getAllLoadedComments = () => {
    const pages = [...loadedPages].sort((a, b) => b.page - a.page);
    return [...pages.flatMap(p => p.comments), ...pendingNewComments];
  };

  // Return the subset of comments that should be shown based on displayCount
  const getDisplayedComments = () => {
    const all = getAllLoadedComments();
    if (all.length <= displayCount) { return all; }
    return all.slice(all.length - displayCount);
  };

// 4. Event handlers
  const onPostLikeToggled = async () => {
    try {
      if (isLiked) {
        // like → unlike
        await LoungeService.unlikePost(postDetails.id);
        setLikeCount(prev => prev - 1);
      } else {
        // unlike → like
        await LoungeService.likePost(postDetails.id);
        setLikeCount(prev => prev + 1);
      }
      setIsLiked(prev => !prev);
    } catch (err) {
      console.error("좋아요 토글 실패", err);
    }
  };

  const onPostCommentToggled = () => {
    setIsCommentOpen(prev => !prev);
  };

  const handleReportPost = (postId: string) => {
    const ok = window.confirm("정말로 신고하시겠습니까?");
    if (!ok) { return; }

    window.alert("신고되었습니다.");
    console.log('신고', postId);
    setOpenPostMenuId(null);
  };

  // Delete a post
  const handleDeletePost = async (postId: string) => {
    const ok = window.confirm("정말로 이 포스트를 삭제하시겠습니까?");
    if (!ok) { return; }

    try {
      await LoungeService.deleteLoungePost(postId);
      window.alert("삭제되었습니다.");

      navigate(PATHS.loungeHome);

    } catch (err) {
      console.error("포스트 삭제 실패", err);
    }
  };

  // Create a comment and append it locally; increase visible count by 1 if panel open
  const handleSubmitComment = async () => {
    const content = newComment?.trim();
    if (!content) { 
      alert("내용을 입력해주세요.");
      return; }

    try {
      const createdComment: LoungePostComment = await LoungeService.createComment(postDetails.id, content);
      if (!createdComment) { return; }

      const newTotal = (commentsMeta.totalItems || 0) + 1;
      setCommentsMeta(prev => ({ ...prev, totalItems: newTotal }));
      setPendingNewComments(prev => {
        if (prev.some(c => c.id === createdComment.id)) { return prev; }
        return [...prev, createdComment];
      });

      if (isCommentOpen) {
        setDisplayCount(prev => Math.min(prev + 1, newTotal));
      }
      setNewComment("");

    } catch (err) {
      console.error("댓글 등록 실패:", err);
    }
  };

  // Update a comment locally using the single-comment response
  const handleEditComment = async (commentId: string, newContent: string) => {
    const content = newContent?.trim();
    if (!content) {
      alert("내용을 입력해주세요.");
      return;
    }

    try {
      const updatedComment = await LoungeService.updateComment(commentId, content);
      if (!isCommentOpen) {
        setEditingCommentId(null);
        return;
      }

      setPendingNewComments(prev => prev.map(c => c.id === updatedComment.id ? updatedComment : c));
      setLoadedPages(prev => {
        const next = prev.map(p => ({ ...p, comments: p.comments.map(c => c.id === updatedComment.id ? updatedComment : c) }));
        return next;
      });
      setEditingCommentId(null);

    } catch (err) {
      console.error("댓글 수정 실패", err);
    }
  };

  // Delete a comment and remove it from local caches
  const handleDeleteComment = async (commentId: string) => {
    const ok = window.confirm("정말로 이 댓글을 삭제하시겠습니까?");
    if (!ok) { return; }

    try {
      await LoungeService.deleteComment(commentId);
      if (!isCommentOpen) {
        setCommentsMeta(prev => ({ ...prev, totalItems: Math.max(0, prev.totalItems - 1) }));
        return;
      }

      setPendingNewComments(prev => prev.filter(c => c.id !== commentId));
      setLoadedPages(prev => {
        const next = prev.map(p => ({ ...p, comments: p.comments.filter(c => c.id !== commentId) }));
        return next;
      });

      setCommentsMeta(prev => {
        const newTotal = Math.max(0, prev.totalItems - 1);
        setDisplayCount(dPrev => Math.min(dPrev, newTotal));
        return { ...prev, totalItems: newTotal };
      });

    } catch (err) {
      console.error("댓글 삭제 실패", err);
    }
  };

  // Load a single comment for editing and open the editor
  const handleStartEditComment = async (commentId: string) => {

    try {
      const comment = await LoungeService.getCommentById(commentId);
      setEditingCommentId(commentId);
      setEditingCommentContent(comment.content);
      setOpenCommentMenuId(null);

    } catch (err) {
      console.error("댓글 불러오기 실패", err);
    }
  };

  const handleReportComment = (commentId: string) => {
    const ok = window.confirm("정말로 신고하시겠습니까?");
    if (!ok) { return; }

    console.log('신고', commentId);
    window.alert("신고되었습니다.");
    setOpenCommentMenuId(null);
  };

  const toggleCommentMenu = (commentId: string) => {
    setOpenCommentMenuId(prev => (prev === commentId ? null : commentId));
  };

// 5. Data fetching & sync
  // Fetch a page of comments and merge into local pages (skip if already loaded)
  const loadComments = async (page = 1, size = 20, force = false): Promise<LoungePostCommentsPageResponse | null> => {
    if (!postDetails.id) { return null; }
    if (!force && loadedPages.some(p => p.page === page)) { return null; }
    if (!force && inFlightPagesRef.current.has(page)) { return null; }

    try {
      inFlightPagesRef.current.add(page);
      setIsLoadingMore(true);
      const data = await LoungeService.getCommentsByPost(postDetails.id, page, size);
      upsertLoadedPage(data);
      return data;
    } catch (err) {
      console.error("댓글 불러오기 실패", err);
      if (!force) { inFlightPagesRef.current.delete(page); }
      return null;
    } finally {
      setIsLoadingMore(false);
    }
  };
  
  // Merge a loaded page into local cache and drop any pending duplicates
  const upsertLoadedPage = (data: LoungePostCommentsPageResponse) => {
    console.debug('[comments] upsertLoadedPage', { page: data.page, totalItems: data.totalItems, count: data.comments.length });
    setLoadedPages(prev => {
      const normalizedComments = data.comments ? data.comments.slice().reverse() : [];
      const existingIdx = prev.findIndex(p => p.page === data.page);
      let next = [...prev];
      if (existingIdx >= 0) {
        next[existingIdx] = { page: data.page, comments: normalizedComments };
      } else {
        next.push({ page: data.page, comments: normalizedComments });
        next.sort((a, b) => a.page - b.page);
      }
      inFlightPagesRef.current.delete(data.page);
      return next;
    });

    setCommentsMeta({ page: data.page, size: data.size, totalItems: data.totalItems, totalPages: data.totalPages });
    setPendingNewComments(prev => prev.filter(pc => !data.comments.some(c => c.id === pc.id)));
  };

  // When comment panel opens, load latest pages backwards until we have enough items to display
  useEffect(() => {
    if (!isCommentOpen || !postDetails.id) { return; }
    let cancelled = false;
    
    (async () => {
      try {
        setIsLoadingMore(true);
        const meta = await LoungeService.getCommentsByPost(postDetails.id, 1, commentsMeta.size);
        const totalPages = meta.totalPages || 1;
        const totalItems = meta.totalItems || 0;
        setCommentsMeta(prev => ({ ...prev, totalItems, totalPages }));
        const initialDisplay = Math.min(20, totalItems);
        setDisplayCount(initialDisplay);

        let pageToLoad = totalPages;
        while (!cancelled && pageToLoad >= 1) {
          const data = await loadComments(pageToLoad, commentsMeta.size, true);
          if (!data) { break; }
          const loadedCount = data.comments.length + pendingNewComments.length;
          if (loadedCount >= initialDisplay) { break; }
          pageToLoad -= 1;
        }
      } catch (err) {
        console.error('댓글 초기 로드 실패', err);
      } finally {
        setIsLoadingMore(false);
      }
    })();

    return () => { cancelled = true; };
  }, [isCommentOpen, postDetails.id]);

// 6. Render helpers
  function renderLoadMoreButton() {
    const hasMore = commentsMeta.totalItems > displayCount;
    if (!hasMore) { return null; }

    const loadedPageNumbers = loadedPages.map(p => p.page);
    const minLoadedPage = loadedPageNumbers.length > 0 ? Math.min(...loadedPageNumbers) : Infinity;

    const prevPage =
      minLoadedPage !== Infinity && minLoadedPage > 1
        ? minLoadedPage - 1
        : Math.max(
            1,
            commentsMeta.totalPages -
              Math.ceil(displayCount / (commentsMeta.size || 20))
          );

    const handleClick = async () => {
      await loadComments(prevPage, commentsMeta.size);
      setDisplayCount(prev => Math.min(commentsMeta.totalItems, prev + 20));
    };

    return (
      <button
        className={s['comments-section__load-more']}
        disabled={isLoadingMore}
        onClick={handleClick}
      >
        이전 댓글 더보기
      </button>
    );
  }

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
        <div className={s['post-header__menu']}>
          <button
            className={s['post-header__menu-btn']}
            aria-expanded={openPostMenuId === postDetails.id}
            onClick={() =>
              setOpenPostMenuId(prev => (prev === postDetails.id ? null : postDetails.id))
            }
          >
            <TfiMoreAlt />
          </button>

          {openPostMenuId === postDetails.id && (
            <div className={s['post-header__menu-list']}>
              {currentUserInfo && postDetails.userId === currentUserInfo.id ? (
                <>
                  <button
                    className={s['post-header__menu-option']}
                    onClick={() => handleDeletePost(postDetails.id)}
                  >
                    삭제
                  </button>
                </>
              ) : (
                <button
                  className={s['post-header__menu-option']}
                  onClick={() => handleReportPost(postDetails.id)}
                >
                  신고
                </button>
              )}
            </div>
          )}
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
          {likeCount}
        </button>
        <button className={s['post-actions__comment-btn']} onClick={onPostCommentToggled}>
          <TfiCommentAlt />
          댓글
        </button>
      </section>

      {/* Comments Section */}
      {isCommentOpen && (
        <section className={s['comments-section']}>
          <div className={s['comments-section__header']}>
            <strong className={s['comments-section__header-title']}>
              댓글
              <span className={s['comments-section__header-count']}>{commentsMeta.totalItems}</span>
            </strong>
          </div>
          {renderLoadMoreButton()}
          <ul className={s['comments-section__list']}>
            {getDisplayedComments().map((comment) => (
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
                    {editingCommentId === comment.id ? (
                      <div className={s['comments-section__item-edit-box']}>
                        <textarea
                          className={s['comments-section__item-content-input']}
                          value={editingCommentContent}
                          onChange={(e) => setEditingCommentContent(e.target.value)}
                          maxLength={500}
                          rows={2}
                          onKeyDown={async (e) => {
                            // Shift+Enter: line break, Enter: submit
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              await handleEditComment(comment.id, editingCommentContent);
                            }
                          }}
                        />
                        <div className={s['comments-section__item-actions']}>
                          <button
                            className={s['comments-section__item-actions-edit-btn']}
                            onClick={async () => {
                              await handleEditComment(comment.id, editingCommentContent);
                            }}
                          >
                            수정완료
                          </button>
                          <button
                            className={s['comments-section__item-actions-cancel-btn']}
                            onClick={() => setEditingCommentId(null)}
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className={s['comments-section__item-content']}>{comment.content}</p>
                    )}
                  </div>
                  <div className={s['comments-section__item-menu']}>
                    <button
                      className={s['comments-section__item-menu-btn']}
                      aria-expanded={openCommentMenuId === comment.id}
                      onClick={() => toggleCommentMenu(comment.id)}
                    >
                      <TfiMoreAlt />
                    </button>

                    {openCommentMenuId === comment.id && (
                      <div className={s['comments-section__item-menu-list']}>
                        {currentUserInfo && comment.userId === currentUserInfo.id ? (
                          <>
                            <button
                              className={s['comments-section__item-menu-option']}
                              onClick={() => handleStartEditComment(comment.id)}
                            >
                              수정
                            </button>
                            <button
                              className={s['comments-section__item-menu-option']}
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              삭제
                            </button>
                          </>
                        ) : (
                          <button
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
                  src={currentUserInfo.avartarUrl}
                  alt={`${currentUserInfo.displayName}의 프로필 사진`} />
                <span className={s['comment-editor__user-name']}>{currentUserInfo.displayName}</span>
              </div>
              <textarea
                className={s['comment-editor__input']}
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="댓글을 작성해 주세요."
                maxLength={500}
                rows={2}
                onKeyDown={e => {
                  // Shift+Enter: line break, Enter: submit
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitComment();
                  }
                }}
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

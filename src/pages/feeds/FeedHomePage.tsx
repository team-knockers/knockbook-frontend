import { useEffect, useRef, useState } from 'react';
import { timeAgo } from '../../features/feeds/util';

import SearchBar from '../../components/navigation/SearchBar';
import FeedCard from '../../features/feeds/components/FeedCard';
import s from './FeedHomePage.module.css';

import { FeedService } from '../../features/feeds/services/FeedService';
import type { FeedPost } from '../../features/feeds/types';

const PAGE_SIZE = 3; // number of posts per request 

export default function FeedHomePage() {
  // list shown on the page
  const [posts, setPosts] = useState<FeedPost[]>([]);
  // cursor for next page (null = no more)
  const [nextAfter, setNextAfter] = useState<string | null>(null);
  // true while a fetch is running (prevents duplicates)
  const [loading, setLoading] = useState(false);
  // searchKeyword
  const [keyword, setKeyword] = useState<string>('');
  // bottom trigger element 
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  
  // 1) first load and reload when search keyword changes
  useEffect(() => {
    let alive = true; // ignore setState if unmounted
    (async () => {
      try {
        setLoading(true);
        // first page : (after = null)
        const res = await FeedService.getFeedPostList(PAGE_SIZE, null, keyword);
        if (!alive) return;
        setPosts(res.feedPosts);      // replace list
        setNextAfter(res.nextAfter);  // save next cursor 
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; }; // cleanup on unmout 
  }, [keyword]);

  // 2) load next page (called when sentinel becomes visible)
  async function loadMore() {
    if (loading || !nextAfter) return; // guard: in-flight or no more
    try {
      setLoading(true);
      const res = await FeedService.getFeedPostList(PAGE_SIZE, nextAfter, keyword);
      setPosts(prev => [...prev, ...res.feedPosts]); // append 
      setNextAfter(res.nextAfter);
    } finally {
      setLoading(false);
    }
  }

  // 3) observe the bottom sentinel
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // trigger when visible
          loadMore();
        }
      },
      { root: null, rootMargin: '200px 0px', threshold: 0 }
    );
    // start
    io.observe(el);
    // stop on unmount/update
    return () => io.disconnect();
  }, [sentinelRef.current, nextAfter, loading]); 

  // 4) search handler
  const handleSearch = (searchKeyword: string)=> {
    setKeyword(searchKeyword.trim()); // triggers first-load effect
  }

  return (
    <div className={s['page-layout']}>
      <SearchBar
        placeholder='아이디를 입력하세요'
        onSearch={handleSearch}
      />

      {posts.map(p => (
        <FeedCard
          key={p.postId}
          profileImage={p.avatarUrl ?? undefined}
          username={p.displayName}
          timeAgo={timeAgo(p.createdAt)}
          postImage={p.images.map((url, i) => ({ id: String(i + 1), url }))}
          likes={p.likesCount}
          comments={p.commentsCount}
          description={p.content}
        />
      ))}

      {/* invisible bottom trigger */}
      <div ref={sentinelRef} className={s['sentinel']} />
      {loading && <div className={s['loading']}>Loading…</div>}
    </div>
  );
}

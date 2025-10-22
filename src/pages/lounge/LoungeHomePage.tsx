import Footer from '../../components/layout/Footer';
import s from './LoungeHomePage.module.css'
import { LuVolume2 } from "react-icons/lu";

import { useEffect, useRef, useState } from 'react';
import DefaultImg from '../../assets/lounge_post_default_thumbnail.png';
import ChallengeImg1 from '../../assets/lounge_challenge_img1.png';
import ChallengeImg2 from '../../assets/lounge_challenge_img2.png';
import ChallengeImg3 from '../../assets/lounge_challenge_img3.png';

import { Swiper, SwiperSlide } from 'swiper/react';
// @ts-ignore
import 'swiper/css';
// @ts-ignore
import 'swiper/css/pagination';
// @ts-ignore
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import Pagination from '../../components/navigation/Pagination';
import { PATHS } from '../../routes/paths';
import { useLoaderData, useNavigate, useSearchParams } from 'react-router-dom';
import type { LoungeHomeLoaderData } from './LoungeHome.loader';
import type { LoungePostPageState } from '../../features/lounge/types';
import { LoungeService } from '../../features/lounge/services/LoungeService';

// Parse initial state from URL: page, size, sortBy
function makeInitialState(params: URLSearchParams): LoungePostPageState {
  return {
    page: Number(params.get('page') ?? 1),
    size: Number(params.get('size') ?? 6),
    sortBy: (params.get('sortBy') as LoungePostPageState['sortBy']) ?? 'newest',
  };
}

// Update or remove query parameters dynamically
function applyQueryParam(
  q: URLSearchParams,
  key: string,
  value: string | number | undefined,
  defaultValue?: string
) {
  if (value !== null) {
    q.set(key, String(value));
  } else if (defaultValue) {
    q.set(key, defaultValue);
  } else {
    q.delete(key);
  }
};

const sortOptions = [
  { value: 'newest', label: '최신순' },
  { value: 'popular', label: '인기순' },
] as const;

const DESKTOP_BREAKPOINT = 1024;

const sliderImgs = [
  { id: 1, title: "나의 호의가 둘리가 되었다.", author: "김대리", imageUrl: "https://img1.daumcdn.net/thumb/R1280x0.fjpg/?fname=http://t1.daumcdn.net/brunch/service/user/dE4R/image/oWPJD5uJGYBzF11N_AdfwLr7uYw.jpg" },
  { id: 2, title: "내가 여행한 도시들", author: "행복한여행자", imageUrl: "https://i.imgur.com/jifY9jJ.jpeg" },
  { id: 3, title: "일본 오사카에서 보낸 하루들", author: "가방하나여행둘", imageUrl: "https://i.imgur.com/h2Cx7DO.jpeg" },
  { id: 4, title: "나의 사랑스러운 고양이와 함께", author: "고양이애호가", imageUrl: "https://i.imgur.com/aLRhnr8.jpeg" },
  { id: 5, title: "반려동물과 나, 매일의 고찰", author: "방석", imageUrl: "https://i.imgur.com/FzrMFP6.jpeg" },
  { id: 6, title: "정원을 가꾼다는 것에 대하여", author: "정원가드너", imageUrl: "https://i.imgur.com/sEIqf1D.jpeg" },
  { id: 7, title: "탐조기록 3", author: "조류관찰자", imageUrl: "https://i.imgur.com/VQPrcjv.jpeg" },
  { id: 8, title: "나의 요리일기장", author: "오늘은내가요리사", imageUrl: "https://i.imgur.com/7rn3RLX.jpeg" },
  { id: 9, title: "나의 하늘이 무너진날", author: "여울", imageUrl: "https://img1.daumcdn.net/thumb/R1280x0.fjpg/?fname=http://t1.daumcdn.net/brunch/service/user/icgm/image/-XRLVSLB4vOKlbc80LI8xd5yKmA.jpg" },
  { id: 3, title: "오늘도 살아 남았다", author: "생존장인", imageUrl: "https://img1.daumcdn.net/thumb/R1280x0.fwebp/?fname=http://t1.daumcdn.net/brunch/service/user/ftEI/image/Y-kquSPHCrXuN2KxK8dFb3l8l04" }
];

const spotlight = {
  quote: "서울에도 아직 청춘이 내 집 마련할 수 있는 기회가 열려 있습니다.",
  author: "스케치",
  bookTitle: "청춘의 재테크 상담소",
  coverImageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/250x0/pdt/9788947545273.jpg"
}

const challengeData = [
  { id: 1, title: "문앞의 책방 \n 저녁 독서 챌린지", subtitle: "", backgroundImage: ChallengeImg1 },
  { id: 2, title: "양명숙 작가와 함께하는 요리기행", subtitle: "#8월 #삼계탕의 계절 #문책 PICK!", backgroundImage: ChallengeImg2 },
  { id: 3, title: "제주항공권 추천 이벤트", subtitle: "챌린지 신청하고 제주도 가자!", backgroundImage: ChallengeImg3 },
  
];

export default function LoungeHomePage() {
  const navigate = useNavigate();
  const { postSummaries } = useLoaderData() as LoungeHomeLoaderData;

  const [searchParams] = useSearchParams();
  const [posts, setPosts] = useState(postSummaries.posts);
  const [page, setPage] = useState(postSummaries.page);
  const [totalItems, setTotalItems] = useState(postSummaries.totalItems);
  const [totalPages, setTotalPages] = useState(postSummaries.totalPages);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= DESKTOP_BREAKPOINT);
  const prevIsDesktopRef = useRef<boolean>(window.innerWidth >= DESKTOP_BREAKPOINT);

  const [searchState, setSearchState] = useState<LoungePostPageState>(() =>
    makeInitialState(searchParams)
  );

  // Track initialization flags to prevent duplicate fetches
  const initRef = useRef({ synced: false, fetched: false });
  const prevPageRef = useRef<number>(postSummaries.page);

  // Build query string based on current and updated search state
  const buildQuery = (base: LoungePostPageState, updates: Partial<LoungePostPageState>) => {
    const q = new URLSearchParams();
    applyQueryParam(q, 'sortBy', updates.sortBy ?? base.sortBy);
    applyQueryParam(q, 'page', updates.page ?? base.page, '1');
    applyQueryParam(q, 'size', updates.size ?? base.size, '6');
    return q;
  };

  // Apply query string to URL and sync it to local state
  const applyQueryToUrlAndState = (q: URLSearchParams) => {
    const newSearch = q.toString();
    const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : '');
    window.history.replaceState(null, '', newUrl);
    setSearchState({
      page: Number(q.get('page') ?? 1),
      size: Number(q.get('size') ?? 3),
      sortBy: (q.get('sortBy') as LoungePostPageState['sortBy']) ?? 'newest',
    });
  };
  //

  // Update search state and URL together
  const updateSearchStateViaUrl = (updates: Partial<LoungePostPageState>) => {
    const base = searchState ?? makeInitialState(searchParams);
    const q = buildQuery(base, updates);
    applyQueryToUrlAndState(q);
  };

 // Handle sort dropdown change
  const handleSortChange = (sortValue: string) => {
    const option = sortOptions.find(option => option.value === sortValue);
    if (!option) { return; }
    updateSearchStateViaUrl({ sortBy: option.value, page: 1 });
  };

  // Handle viewport resize and breakpoint changes
  useEffect(() => {
    const handleResize = () => {
      const nextIsDesktop = window.innerWidth >= DESKTOP_BREAKPOINT;
      // Reset page when crossing breakpoint to avoid pagination mismatch
      if (prevIsDesktopRef.current !== nextIsDesktop) {
        updateSearchStateViaUrl({ page: 1 });
        setPosts([]);
        prevIsDesktopRef.current = nextIsDesktop;
      }
      setIsDesktop(nextIsDesktop);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync searchState when URL query parameters change
  useEffect(() => {
    if (!initRef.current.synced) {
      initRef.current.synced = true;
      return;
    }
    setSearchState(makeInitialState(searchParams));
  }, [searchParams]);

  // Fetch lounge posts whenever search state (page/sort) updates
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!initRef.current.fetched) {
        initRef.current.fetched = true;
        prevPageRef.current = postSummaries.page;
        return;
      }

      try {
        const res = await LoungeService.getPaginatedLoungePostSummaries(
          searchState.page,
          searchState.size,
          searchState.sortBy,
        );

        if (cancelled) { return; }
        if (!isDesktop && searchState.page > prevPageRef.current) {
          setPosts((prev) => [...prev, ...res.posts]);

        } else {
          setPosts(res.posts);
        }

        setPage(res.page);
        setTotalItems(res.totalItems);
        setTotalPages(res.totalPages);
        prevPageRef.current = res.page;

      } catch (error) {
        if (cancelled) { return;}
        console.error('검색 결과 불러오기 실패', error);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [searchState]);
  

  const handleMoreClick = () => {
    updateSearchStateViaUrl({ page: page + 1 });
  };

  const handlePostClick = (postId: string) => {
    navigate(PATHS.loungePost.replace(':postId', postId));
  }

  return (
    <main>
      <div className={s['page-layout']}>
        <div className={s['lounge-header']}>
          <h1 className={s['title']}>
            <span>R</span>문앞의 라운지
          </h1>
          <button className={s['notice-btn']}>
            <LuVolume2 />(공지) 프로그램 업데이트 안내 2025.01.25
          </button>
        </div>
        

        <div className={s['lounge-banner']}>
          <div className={s['banner-text']}>
            <p className={s['banner-subtitle']}>The 21st 문앞의 책방</p>
            <h2 className={s['banner-title']}>
              PRIVATE<br />
              BOOK<br />
              CLUB<br />
            </h2>
            <p className={s['banner-day']}>25/10/31</p>
            <p className={s['banner-desc']}>"책으로 만나는, 가장 특별한 인연"</p>
          </div>
        </div>

        <div className={s['official-section']}>
          <div className={s['official-header']}>
            <h3>라운지 오피셜</h3>
            <select className={s['sort-select']}
              value={searchState.sortBy}
              onChange={(e) => handleSortChange(e.target.value)}>
              <option value='newest'>최신순</option>
              <option value='popular'>인기순</option>
            </select>
          </div>
          <div className={s['official-list']}>
            {posts.map((post) => (
              <button key={post.id} className={s['official-item']} onClick={() => handlePostClick(String(post.id))}>
                <div className={s['official-text']}>
                  <p className={s['item-title']}>{post.title}</p>
                  <p className={s['item-author']}><span>by</span> {post.displayName}</p>
                  <p className={s['item-like']}>추천 {post.likeCount}</p>
                </div>
                <img
                  src={post.previewImageUrl ?? DefaultImg}
                  alt={`${post.title} thumbnail image`}
                />
              </button>
            ))}
          </div>
          {!isDesktop && posts.length < totalItems && (
            <button className={s['more-btn']} onClick={handleMoreClick}>
              더보기
            </button>
          )}
          {isDesktop && (
            <Pagination page={page} totalPages={totalPages} onChange={(p) => updateSearchStateViaUrl({ page: p })} />
          )}
        </div>

        <div className={s['lounge-spotlight']}>
          <div className={s['spotlight-content']}>
            <p className={s['spotlight-title']}>문앞지기가 사랑한 책 속의 한 문장</p>
            <p className={s['spotlight-quote']}>{spotlight.quote}</p>
            <p className={s['spotlight-meta']}>
              <span className={s['spotlight-author-label']}>by</span>&nbsp;
              {spotlight.author} / {spotlight.bookTitle}
            </p>
          </div>
          <div className={s['spotlight-book']}>
            <div className={s['spotlight-book-cover']}>
              <img src={spotlight.coverImageUrl} alt={`${spotlight.bookTitle}의 커버이미지`}/>
            </div>
          </div>
        </div>

        <div className={s['slider-section']}>
          <Swiper
            className={s['slider-layout']}
            slidesPerView={'auto'}
            spaceBetween={0}
            grabCursor={true}
            modules={[Navigation]}
            navigation={sliderImgs.length > 1}
            centeredSlides={false}
          >
            {sliderImgs.map((slider) => (
              <SwiperSlide className={s['slide']} key={slider.id}>
                <div className={s['slide-item']}>
                  <div
                    className={s['slide-bg']}
                    style={{ backgroundImage: `url(${slider.imageUrl})`}}
                  />
                  <div className={s['slide-overlay']}>
                    <h3 className={s['slide-item-title']}>{slider.title}</h3>
                    <p className={s['slide-item-meta']}>
                      <span className={s['slide-item-author-label']}>by</span>&nbsp;
                      {slider.author}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className={s['challenge-section']}>
          <h3>문앞의 챌린지</h3>
          <div className={s['challenge-banner']}>
            {challengeData.map((challenge) => (
              <button key={challenge.id} className={s['challenge-card']}>
                <img
                  className={s['card-image']}
                  src={challenge.backgroundImage}
                  alt={challenge.title}
                />
                <div className={s['card-overlay']}>
                  <p className={s['card-title']}>{challenge.title}</p>
                  {challenge.subtitle && 
                    <p className={s['card-subtitle']}>{challenge.subtitle}</p>
                  }
                  <p className={s['card-cta']}>신청하러 가기 &gt;&gt;</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <Footer/>
    </main>
  );
}

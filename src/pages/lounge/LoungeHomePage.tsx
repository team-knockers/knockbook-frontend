import Footer from '../../components/layout/Footer';
import s from './LoungeHomePage.module.css'
import { LuVolume2 } from "react-icons/lu";

import { useEffect, useState } from 'react';
import OfficialImg1 from '../../assets/lounge_official_img1.jpg';
import OfficialImg2 from '../../assets/lounge_official_img2.jpg';
import OfficialImg3 from '../../assets/lounge_official_img3.png';
import OfficialImg4 from '../../assets/lounge_official_img4.png';
import OfficialImg5 from '../../assets/lounge_official_img5.png';
import OfficialImg6 from '../../assets/lounge_official_img6.png';

import { Swiper, SwiperSlide } from 'swiper/react';
// @ts-ignore
import 'swiper/css';
// @ts-ignore
import 'swiper/css/pagination';
// @ts-ignore
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import LoungeSliderImg1 from '../../assets/lounge_slider_img1.png'
import LoungeSliderImg2 from '../../assets/lounge_slider_img2.png'
import LoungeSliderImg3 from '../../assets/lounge_slider_img3.png'
import Pagination from '../../components/navigation/Pagination';
import { PATHS } from '../../routes/paths';
import { useNavigate } from 'react-router-dom';


export default function LoungeHomePage() {
  // dummy data
  const officialPosts = [
    { id: 1, title: '책 읽기에 멈칫하는 당신에게', author: '라운지지기', imageUrl: OfficialImg1 },
    { id: 2, title: '내려놓음? 그게 무엇인가', author: '라운지지기', imageUrl: OfficialImg2 },
    { id: 3, title: '내 여행의 낭만은 무계획에 있다', author: '라운지지기', imageUrl: OfficialImg3 },
    { id: 4, title: '책으로 떠나는 시간 여행', author: '라운지지기', imageUrl: OfficialImg4 },
    { id: 5, title: '독서가 만든 나의 하루', author: '라운지지기', imageUrl: OfficialImg5 },
    { id: 6, title: '독서가 만든 나의 하루', author: '라운지지기', imageUrl: OfficialImg6 },
  ];

  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(3); // 처음엔 3개
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [page, setPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMore = () => {
    setVisibleCount((prev) => Math.min(prev + 3, officialPosts.length));
  };

  const handlePostClick = (postId: string) => {
    navigate(PATHS.loungePost.replace(':postId', postId));
  }

  const totalPages = Math.ceil(officialPosts.length / itemsPerPage);
  const startIdx = (page - 1) * itemsPerPage;
  const currentPosts = isDesktop
    ? officialPosts.slice(startIdx, startIdx + itemsPerPage)
    : officialPosts.slice(0, visibleCount);

  const sliderImgs = [
    { id: 1, imageUrl: LoungeSliderImg1 },
    { id: 2, imageUrl: LoungeSliderImg2 },
    { id: 3, imageUrl: LoungeSliderImg3 },
  ];

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
            <p className={s['banner-day']}>25/08/09</p>
            <p className={s['banner-desc']}>"책으로 만나는, 가장 특별한 인연"</p>
          </div>
        </div>

        <div className={s['official-section']}>
          <div className={s['official-header']}>
            <h3>라운지 오피셜</h3>
            <select className={s['sort-select']}>
              <option value='popular'>인기순</option>
              <option value='recent'>최신순</option>
            </select>
          </div>
          <div className={s['official-list']}>
            {currentPosts.map((post) => (
              <button key={post.id} className={s['official-item']} onClick={() => handlePostClick(String(post.id))}>
                <img src={post.imageUrl} alt='thumbnail' />
                <div className={s['official-text']}>
                  <p className={s['item-title']}>{post.title}</p>
                  <p className={s['item-author']}>by {post.author}</p>
                </div>
              </button>
            ))}
          </div>
          {!isDesktop && visibleCount < officialPosts.length && (
            <button className={s['more-btn']} onClick={handleMore}>
              더보기
            </button>
          )}
          {isDesktop && (
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          )}
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
              <SwiperSlide 
                className={s['slide']}
                key={slider.id}>
                <div className={s['slide-item']}>
                  <img
                    className={s['slide-img']}
                    src={slider.imageUrl}
                    alt={`${slider.id} 이미지`}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className={s['challenge-section']}>
          <h3>문앞의 챌린지</h3>
          <div className={s['challenge-banner']}>
            <div className={s['challenge-card']}>
              <p>
                문앞의 책방
                <br />X<br />
                저녁 독서 챌린지
              </p>
              <button>신청하러 가기 &gt;&gt;</button>
            </div>
            <div className={s['challenge-card']}>
              <p>양명숙 작가와 함께하는 요리기행</p>
              <p>#8월 #삼계탕의 계절 #문책 PICK!</p>
              <button>신청하러 가기 &gt;&gt;</button>
            </div>
            <div className={s['challenge-card']}>
              <p>제주항공권 추천 이벤트</p>
              <p>챌린지 신청하고 제주도 가자!</p>
              <button>신청하러 가기 &gt;&gt;</button>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </main>
  );
}

import SearchBar from '../../components/navigation/SearchBar';
import Pagination from '../../components/navigation/Pagination';

import FeedCard from '../../features/feeds/components/FeedCard';
import s from './FeedHomePage.module.css';

import FeedSliderGreenBook from '../../assets/feed_slider_img1.png'
import FeedSliderBooklight from '../../assets/feed_slider_img2.png'
import FeedSliderWhiteBook from '../../assets/feed_slider_img3.png'

// dummy data
const firstSliderImages = [
  {
    id: '1',
    url: FeedSliderGreenBook
  }
  ,
  {
    id: '2',
    url: FeedSliderBooklight
  }
  ,
  {
    id: '3',
    url: FeedSliderWhiteBook
  }
]

const secondSliderImage = [
  {
    id: '1',
    url: FeedSliderBooklight
  }
  ,
  {
    id: '2',
    url: FeedSliderGreenBook
  }
  ,
  {
    id: '3',
    url: FeedSliderWhiteBook
  }
  ,
  {
    id: '4',
    url: FeedSliderGreenBook
  }
  ,
  {
    id: '5',
    url: FeedSliderWhiteBook
  }
]

const thirdSliderImage = [
  {
    id: '1',
    url: FeedSliderWhiteBook
  }
  ,
  {
    id: '2',
    url: FeedSliderBooklight
  }
  ,
  {
    id: '3',
    url: FeedSliderGreenBook
  }
  ,
  {
    id: '4',
    url: FeedSliderBooklight
  }
  ,
  {
    id: '5',
    url: FeedSliderGreenBook
  }
]

  // Future SearchBar API integration
  const handleSearch = (searchKeyword: string) => {
      console.log(searchKeyword);
  }

  // Future Pagination API integration
  const goPage = (p: number) => {
    console.log(p);
  };

export default function FeedHomePage() {
  return (
    <div className={s['page-layout']}>
      <SearchBar
        placeholder='아이디를 입력하세요'
        onSearch={handleSearch}
      />
      <FeedCard
        profileImage={FeedSliderGreenBook}
        username='호랭이'
        timeAgo='1일 전'
        postImage={firstSliderImages}
        likes={20}
        comments={2}
        description='날씨가 좋으면 찾아가겠어요. 도서 추천해요~'
      />
      <FeedCard
        username='고앵이'
        timeAgo='4일 전'
        postImage={secondSliderImage}
        likes={2}
        comments={0}
        description='엊그제 주문한 북라이트 너무 예뻐 :)'
      />
      <FeedCard
        profileImage={FeedSliderWhiteBook}
        username='스누피'
        timeAgo='5일 전'
        postImage={thirdSliderImage}
        likes={10}
        comments={1}
        description='책을 읽다 발견한 좋은 글...'
      />
      <Pagination
        page={1}  
        totalPages={10}
        onChange={goPage}
      />
    </div>
  );
}

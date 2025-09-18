import BestSellerSection from "../../features/books/components/BookBestSeller";
import BookSlider from "../../features/books/components/BookSlider";
import BookSectionHeader from "../../features/books/components/BookSectionHeader";
import CategoryFilterSearchBar from "../../features/books/components/CategoryFilterSearchBar";
import styles from './BooksHomePage.module.css';

export default function BooksHomePage() {
  
  const handleSearch = (searchBy: 'title' | 'author' | 'publisher', searchKeyword: string) => {
    console.log('🔍 검색 실행:', { searchBy, searchKeyword });
    // TODO 검색 로직 추가
  };

  const toggleCategory = () => {
    console.log('📂 카테고리 토글됨');
    // TODO 카테고리바 열기 같은 동작
  };
  // Dummy data for BookSlider
  const books = [
  {
    id: '1',
    imageUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/200x0/pdt/9788936439743.jpg',
    title: '혼모노',
    author: '성해나',
    publisher: '창비',
  },
    {
    id: '2',
    imageUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/200x0/pdt/9788998441012.jpg',
    title: '모순',
    author: '양귀자',
    publisher: '쓰다',
  },
    {
    id: '3',
    imageUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/200x0/pdt/9791141602376.jpg',
    title: '안녕이라 그랬어',
    author: '김애란',
    publisher: '문학동네',
  },
    {
    id: '4',
    imageUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/200x0/pdt/9791199305304.jpg',
    title: '자몽살구클럽',
    author: '한로로',
    publisher: '어센틱',
  },
    {
    id: '5',
    imageUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/200x0/pdt/9791168343108.jpg',
    title: '양면의 조개껍데기',
    author: '김초엽',
    publisher: '래빗홀',
  },
    {
    id: '6',
    imageUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/200x0/pdt/9788936434120.jpg',
    title: '소년이 온다',
    author: '한강',
    publisher: '창비',
  },
    {
    id: '7',
    imageUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/200x0/pdt/9788998441074.jpg',
    title: '나는 소망한다 내게 금지된 것을',
    author: '양귀자',
    publisher: '쓰다',
  }
];

// Dummy data for BestSeller
const bestSellerBooks = [
  {
    id: '1',
    imageUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791159433405.jpg',
    title: '글루코스 혁명',
    author: '제시 인차우스페',
    publisher: '아침사과',
    rentPrice: '2,500',
    purchasePrice: '18,000',
    summaryTitle: `반복해도 다시 원래대로 돌아가는 다이어트는 이제 멈춰야 한다.
내 몸의 근본적인 문제에 접근하여 평생 지속 가능한 생활 방식을 찾는 법!`,
    summaryDetail: `음식 갈망, 여드름, 편두통, 브레인 포그, 감정 기복, 체중 증가, 만성 피로, 끊임없는 졸음… 
이 중에 당신에게 해당하는 것이 있는가?
당신의 몸이 신호를 주고 있는 것이다. 당신의 몸에 문제가 있다고 말이다.

그렇다면, 무엇을 해야 할까? 어디서부터 시작해야 할까?
이제는 혈당에서부터 시작해야 한다!

혈당은 조종석에서 가장 중요한 레버와 같다. 혈당은 나의 건강 상태를 점검하기에 가장 배우기 쉽고, 배고픔과 기분을 좌우하기 때문에 감정에 ‘즉각적인’ 영향을 주며, 일단 통제가 되면 많은 것들이 안정된다. 혈당 수치가 균형에서 벗어나면 살이 찌고, 호르몬이 조절되지 않고, 피곤해지고, 당분을 갈망하고, 피부가 뒤집어지고, 심장에 무리가 간다. 기계의 모든 부분이 통제 불능 상태에 빠진 비행기와 비슷한 상태로 말이다. 이것은 추락을 막기 위해 무언가 바꿔야 한다는 것을 강력하게 의미한다. 이상적인 순항 상태로 돌아가려면 혈당 곡선을 완만하게 만들어야만 한다. 아마 ‘당신’을 포함해 당신의 가까운 지인 10명 중 9명은 자신도 모르는 사이에 혈당 롤러코스터를 타고 있을 가능성이 크다.`,
  },
  {
    id: '2',
    imageUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/200x0/pdt/9791167742278.jpg',
    title: '2위 도서 제목',
    author: '저자2',
    publisher: '출판사2',
    rentPrice: '2,500',
    purchasePrice: '8,000',
    summaryTitle: '요약 제목2',
    summaryDetail: '이 책은 ... 많은 사랑을 받습니다.',
  },
  {
    id: '3',
    imageUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/200x0/pdt/9788937416248.jpg',
    title: '3위 도서 제목',
    author: '저자3',
    publisher: '출판사3',
    rentPrice: '2,800',
    purchasePrice: '8,500',
    summaryTitle: '요약 제목3',
    summaryDetail: '이 책은 ... 좋은 평가를 받습니다.',
  }
];

  return (
    <main className={styles['book-home-main']}>
      <CategoryFilterSearchBar onSearched={handleSearch} onCategoryToggled={toggleCategory} />
      <section>
        {/* TODO 배너 추가 위치 */}
      </section>
      <div className={styles['book-contents-container']}>
        <section className={styles['best-seller-section']}>
          <BookSectionHeader 
            headerTitle="문앞 베스트"
            onClicked={() => console.log('문앞 베스트 더보기 클릭')}
          />
          <BestSellerSection
            top3Books={bestSellerBooks}
            onFirstBookClicked={() => console.log('1위 도서 클릭')}
            onSecondBookClicked={() => console.log('2위 도서 클릭')}
            onThirdBookClicked={() => console.log('3위 도서 클릭')}
          />
        </section>
        <section className={styles['book-slider-section']}>
          <BookSectionHeader 
            headerTitle="새로나온 책" 
            categoryName="문학"
            onClicked={() => console.log('문학 더보기 클릭')}
          />
          <BookSlider sliderBooks={books} />
        </section>
        <section className={styles['book-slider-section']}>
          <BookSectionHeader 
            headerTitle="새로나온 책" 
            categoryName="인문/교양"
            onClicked={() => console.log('인문/교양 더보기 클릭')}
          />
          <BookSlider sliderBooks={books} />
        </section>
        <section className={styles['book-slider-section']}>
          <BookSectionHeader 
            headerTitle="새로나온 책" 
            categoryName="자기계발"
            onClicked={() => console.log('자기계발 더보기 클릭')}
          />
          <BookSlider sliderBooks={books} />
        </section>
        <section className={styles['book-slider-section']}>
          <BookSectionHeader 
            headerTitle="새로나온 책" 
            categoryName="건강"
            onClicked={() => console.log('건강 더보기 클릭')}
          />
          <BookSlider sliderBooks={books} />
        </section>
      </div>
    </main>
  );
}

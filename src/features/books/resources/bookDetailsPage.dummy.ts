export const bookBannersDummy = [
  {
    id: '1',
    mobileImageUrl: 'https://contents.kyobobook.co.kr/pmtn/2025/event/b6184cd613704109a7e830ea4f75b515.jpg',
    desktopImageUrl: 'https://contents.kyobobook.co.kr/pmtn/2025/event/91122066f6654d40ae83686dcb2267e5.jpg'
  },
  {
    id: '2',
    mobileImageUrl: 'https://contents.kyobobook.co.kr/pmtn/2025/event/71a6e24dcb274056852a83b665c77d8d.jpg',
    desktopImageUrl: 'https://contents.kyobobook.co.kr/pmtn/2025/event/c9797b7b332d4670bc364e17f17a597f.jpg'
  },
  {
    id: '3',
    mobileImageUrl: 'https://contents.kyobobook.co.kr/pmtn/2025/event/4a317505f8364ad2b08322d77ed51823.jpg',
    desktopImageUrl: 'https://contents.kyobobook.co.kr/pmtn/2025/event/32d8920d082e410bb65f661b5651b97b.jpg'
  },
  {
    id: '4',
    mobileImageUrl: 'https://contents.kyobobook.co.kr/pmtn/2025/event/f246603304ea4bfba8627ecc13895ee8.jpg',
    desktopImageUrl: 'https://contents.kyobobook.co.kr/pmtn/2025/event/b6c6814fda0848f6b6b00cedcb684c0e.jpg'
  }
]; 

export const myMbtiDummy = 'ISFP';

export const mbtiResearchDummy = [
  { mbti: 'ISFP', percentage: 43.4 },
  { mbti: 'INTP', percentage: 20.7 },
  { mbti: 'ENFP', percentage: 15.6 },
  { mbti: 'INFJ', percentage: 10.5 },
  { mbti: 'ESFJ', percentage: 5.7 },
  { mbti: 'ISFJ', percentage: 4.1 }
];

export const bookDetailsDummy = {
  id: '1',
  title: '혼모노',
  author: '성해나',
  publisher: '창비',
  publishedAt: '2025-03-28',
  categoryId: '1',
  subcategoryId: '1',
  introductionTitle: '도서 소개 타이틀',
  introductionDetail: '도서 소개 디테일',
  tableOfContents: '목차 내용',
  publisherReview: '출판사 리뷰',
  isbn13: '9788936439743',
  pageCountText: '368p',
  dimensionsText: '128 * 188(mm)',
  weightText: '',
  totalVolumesText: '1권',
  rentalAmount: 2500,
  purchaseAmount: 18000,
  discountedPurchaseAmount: 16200,
  coverImageUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/200x0/pdt/9788936439743.jpg',
  rentalAvailability: 'AVAILABLE',
  purchaseAvailability: 'AVAILABLE',
  viewCount: 0,
  salesCount: 0,
  rentalCount: 0,
  averageRating: 4.5,
  ratingCount: 217
};

export const bookReviewsScoreDummy = [
  { score: '5', count: 600 },
  { score: '4', count: 100 },
  { score: '3', count: 30 },
  { score: '2', count: 10 },
  { score: '1', count: 3 },
];

export const bookReviewsApiResDummy = {
  reviews: [
    {
      id: '112412',
      transactionType: 'PURCHASE',
      nickname: '호랭이',
      createdAt: '2025-10-05',
      content: '강력 추천합니다!',
      rating: 5,
      mbti: 'ISFP',
      likeCount: 62,
      likedByMe: true
    },
    {
      id: '12512',
      transactionType: 'PURCHASE',
      nickname: '고양이',
      createdAt: '2025-10-04',
      content: '무난하게 읽었습니다.',
      rating: 3,
      mbti: 'INTP',
      likeCount: 10,
      likedByMe: false
    },
    {
      id: '123',
      transactionType: 'RENTAL',
      nickname: '토끼',
      createdAt: '2025-10-03',
      content: '생각보다 재미있었어요!',
      rating: 4,
      mbti: 'ESTJ',
      likeCount: 53,
      likedByMe: false
    },
    {
      id: '20',
      transactionType: 'PURCHASE',
      nickname: '거북이',
      createdAt: '2025-10-02',
      content: '정말 최고예요!',
      rating: 5,
      mbti: 'ISFP',
      likeCount: 40,
      likedByMe: false
    },
    {
      id: '5',
      transactionType: 'PURCHASE',
      nickname: '여우',
      createdAt: '2025-09-29',
      content: '실망스러운 경험이었어요.',
      rating: 1,
      mbti: 'ISTJ',
      likeCount: 10,
      likedByMe: false
    },
  ],
  page: 1,
  size: 5,
  totalItems: 8,
  totalPages: 2
}

export type BannerItem = {
  productId: string;
  bannerImgUrl: string;
  badge: string;
  title1: string;
  title2: string;
  desc: string;
  tone: 'light' | 'dark';
};

export const PRODUCT_BANNERS: BannerItem[] = [
  {
    productId: '184',
    bannerImgUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/600x0/gift/pdt/1402/hot1697007415660.jpg',
    badge: 'HOT',
    title1: '하루를 바꾸는 힘',
    title2: '2026 컴포지션',
    desc: '당신의 목표를 현실로 만드는 COMPOSITION',
    tone: 'dark',
  },
  {
    productId: '21',
    bannerImgUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/600x0/gift/pdt/1657/hot1675754690830.jpg',
    badge: 'NEW',
    title1: '익숙한 일상 속',
    title2: '특별한 한 페이지',
    desc: 'KNOCKBOOK X SOYMIXX',
    tone: 'light',
  },
  {
    productId:'41',
    bannerImgUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/600x0/gift/pdt/1804/hot1752025081153.jpg',
    badge: 'HOT',
    title1: 'FALL',
    title2: 'IN BOOK',
    desc: '#가을 북 코디템 추천',
    tone: 'dark',
  },
  {
    productId:'61',
    bannerImgUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/600x0/gift/pdt/1555/hot1679475438267.jpg',
    badge: 'NEW',
    title1: '푸른 새벽을 닮은',
    title2: '책장',
    desc: '라인런던 2026 SEASON OPEN',
    tone: 'dark',
  },
  {
    productId: '26',
    bannerImgUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/600x0/gift/pdt/1271/hot1750382587476.png',
    badge: 'NEW',
    title1: '책과 마주하는',
    title2: '마음으로',
    desc: '문앞의책방 X PAPERCOLLECTION',
    tone: 'dark',
  },
  {
    productId: '141',
    bannerImgUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/600x0/gift/pdt/1565/hot1739786009041.jpg',
    badge: 'NEW',
    title1: '가을 밤의',
    title2: '몰입 독서',
    desc: '울티 플로우 북라이트 재입고 기념 단독 EVENT!',
    tone: 'light',
  },
];

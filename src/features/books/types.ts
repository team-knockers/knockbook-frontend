export type TopRankedBook = {
  id: string;
  imageUrl: string;
  title: string;
  author: string;
  publisher: string;
  rentPrice: string;
  purchasePrice: string;
  summaryTitle: string;
  summaryDetail: string;
};

export type BookSliderItem = {
  id: string;
  imageUrl: string;
  title: string;
  author: string;
  publisher: string;
};

export type SearchOption = 'title' | 'author' | 'publisher';

export const SEARCH_OPTIONS: { value: SearchOption; label: string }[] = [
  { value: 'title', label: '도서명' },
  { value: 'author', label: '저자명' },
  { value: 'publisher', label: '출판사' },
];

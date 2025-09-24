export type Faq = {
  id: string;
  question: string;
  answer: string;
  createdAt?: string;
}

export type FaqPage = {
  content: Faq[];
  page: number;
  size: number;
  totalItems: number;
}

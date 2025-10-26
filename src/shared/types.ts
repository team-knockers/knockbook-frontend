export type PageResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // 0-based
  size: number;
};

import { IoMdStar, IoMdStarHalf, IoMdStarOutline } from "react-icons/io"

/* Calculate discount rate (%) given original and discounted prices */
export function calculateBookDiscountRate(discountedPurchaseAmount: number, purchaseAmount: number): number {
  if (purchaseAmount <= 0) return 0;
  return Math.round((purchaseAmount - discountedPurchaseAmount) / purchaseAmount * 100);
}

export function calculateBookPurchasePoint(discountedPurchaseAmount: number) {
  const amount = Number(discountedPurchaseAmount) || 0;
  // 구매 포인트 1% 적립, 정수 포인트로 내림 처리
  return Math.floor(amount * 0.01);
}

export function calculateBookRentalPoint(rentalAmount: number) {
  const amount = Number(rentalAmount) || 0;
  // 대여 포인트 2% 적립, 정수 포인트로 내림 처리
  return Math.floor(amount * 0.02);
}

/* Change localDate form "2022-05-20" → "2022.05.20" */
export function formatDateToDot(dateString: string) {
  const [year, month, day] = dateString.split('-');
  return `${year}.${month}.${day}`;
};

/* Change localDate form "2022-05-20" → "2022년 05월 20일" */
export function formatDateToKoreanFull(dateString: string) {
  const [year, month, day] = dateString.split('-');
  return `${year}년 ${month}월 ${day}일`;
};

/* Convert rating to stars */
export function renderStars(rating: number) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(<IoMdStar key={`full-${i}`} />);
  }

  if (hasHalfStar) {
    stars.push(<IoMdStarHalf key="half" />);
  }

  for (let i = 0; i < emptyStars; i++) {
    stars.push(<IoMdStarOutline key={`empty-${i}`} />);
  }

  return stars;
}

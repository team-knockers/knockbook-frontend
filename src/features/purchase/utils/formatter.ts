const fmtKR = new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 });

export const formatWon = (n?: number | null) => {
  return Number.isFinite(n as number) ? `${fmtKR.format(n as number)}원` : "0원";
};

export const formatPoint = (n?: number | null) => {
  return Number.isFinite(n as number) ? `${fmtKR.format(n as number)}p` : "0p";
};

export const formatPurchaseStatus = 
(status: string) => {
  switch (status) {
      case 'PENDING':
        return '준비중';
      case 'FULFILLING':
        return '배송중';
      case 'COMPLETED':
        return '배송완료';
      case 'CANCELLED':
        return '취소';
    }
};

export const formatRentalStatus = 
(status: string) => {
  switch (status) {
      case 'PENDING':
        return '준비중';
      case 'FULFILLING':
        return '배송중';
      case 'COMPLETED':
        return '대여중';
      case 'CANCELLED':
        return '회수완료';
    }
};


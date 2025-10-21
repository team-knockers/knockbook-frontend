const fmtKR = new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 });

export const formatWon = (n?: number | null) => {
  return Number.isFinite(n as number) ? `${fmtKR.format(n as number)}원` : "0원";
};

export const formatPoint = (n?: number | null) => {
  return Number.isFinite(n as number) ? `${fmtKR.format(n as number)}p` : "0p";
};




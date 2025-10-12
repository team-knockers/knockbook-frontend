// Normalize starCounts to chart-friendly data.
// - Guarantee order 5 → 1
// - Fill missing scores with 0
// - score must be string for the chart
export const toChartData = (
  starCounts: Array<{ score: number | string; count: number }>
) => {
  const map = new Map<number, number>(
    starCounts.map(d => [Number(d.score), Number(d.count) || 0])
  );
  return [5, 4, 3, 2, 1].map(s => ({
    score: String(s),
    count: map.get(s) ?? 0,
  }));
};

// "YYYY-MM-DD" (KST)
const dtfDate = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  year: 'numeric', month: '2-digit', day: '2-digit'
});

export function formatKstDate(iso?: string | null): string {
  if (!iso) { return ''; }
  const parts = dtfDate.formatToParts(new Date(iso));
  const get = (t: string) => parts.find(p => p.type === t)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}
export function timeAgo(input: string | number | Date): string {
  const ts = toEpochMs(input);
  if (ts == null) { return ''; }
  const diff = Math.max(0, Date.now() - ts); 
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) { return '방금 전'; }
  if (mins < 60) { return `${mins}분 전`; }
  const hours = Math.floor(mins / 60);
  if (hours < 24) { return `${hours}시간 전`; }
  const days = Math.floor(hours / 24);

  return `${days}일 전`;
}

function toEpochMs(v: string | number | Date): number | null {
  if (v instanceof Date) { return v.getTime(); }
  if (typeof v === 'number') {
    if (!Number.isFinite(v)) { return null; }
    return v > 1e12 ? v : Math.round(v * 1000);
  }
  if (typeof v === 'string') {
    const s = v.trim();
    const n = Number(s);
    if (Number.isFinite(n)) { return n > 1e12 ? n : Math.round(n * 1000); }
    const t = Date.parse(s);
    
    return Number.isNaN(t) ? null : t;
  }

  return null;
}

export function timeAgo(input: string | number | Date): string {
  let t: number | null = null;

  if (input instanceof Date) t = input.getTime();
  else if (typeof input === 'number') t = Number.isFinite(input) ? input : null;
  else if (typeof input === 'string') {
    const s = input.trim();
    const m = s.match(
      /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?Z$/
    );
    if (m) {
      const [, Y, M, D, h, mi, sec, ms = '0'] = m;
      t = new Date(
        +Y,
        +M - 1,
        +D,
        +h,
        +mi,
        +sec,
        +(ms + '00').slice(0, 3)
      ).getTime();
    } else {
      const d = new Date(s);
      t = Number.isNaN(d.getTime()) ? null : d.getTime();
    }
  }

  if (t == null) return '';
  let diff = Date.now() - t;
  if (diff < 0) diff = 0;

  const mins = Math.floor(diff / 60000);
  if (mins < 1) return '방금 전';
  if (mins < 60) return `${mins}분 전`;

  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;

  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

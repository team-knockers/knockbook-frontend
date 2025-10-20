const tz = "Asia/Seoul";
const now = new Date();
const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

export const weekday = new Intl.DateTimeFormat("ko-KR", {
  weekday: "short",
  timeZone: tz,
}).format(tomorrow);

export const dateLabel = new Intl.DateTimeFormat("ko-KR", {
  month: "numeric",
  day: "numeric",
  timeZone: tz,
}).format(tomorrow);

export const formatYmdDots = (iso: string) => {
  return new Date(iso)
  .toLocaleDateString('en-CA', { timeZone: tz })
  .replace(/-/g, '.');
};
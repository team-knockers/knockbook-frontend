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

export const formatYmdTimeDots = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}
  .${String(d.getMonth()+1).padStart(2, "0")}
  .${String(d.getDate()).padStart(2, "0")}
   ${String(d.getHours()).padStart(2, "0")}
   :${String(d.getMinutes()).padStart(2, "0")}`;
}

export const remainDate = (iso: string) => {
  const target = new Date(iso);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

const KST_TIME_ZONE = "Asia/Seoul";

const dateKeyFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: KST_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const timeFormatter = new Intl.DateTimeFormat("ko-KR", {
  timeZone: KST_TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export function getKstDateKey(value = new Date()) {
  return dateKeyFormatter.format(new Date(value));
}

export function formatKstTime(timestamp) {
  if (!timestamp) return "--:--";
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? "--:--" : timeFormatter.format(date);
}

export function moveDate(dateKey, amount) {
  const date = new Date(`${dateKey}T12:00:00+09:00`);
  date.setUTCDate(date.getUTCDate() + amount);
  return getKstDateKey(date);
}

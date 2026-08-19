export const RATING_EMOJIS = ["😞", "😔", "🙁", "😕", "😐", "🙂", "😊", "😄", "😁", "😆"] as const;

export interface RatingLog {
  date: string;
  score: number;
}

export function toLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getRatingEmoji(score: number) {
  const normalizedScore = Math.max(1, Math.min(10, Math.round(score)));
  return RATING_EMOJIS[normalizedScore - 1];
}

export function parseLocalDate(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day, 12);
}

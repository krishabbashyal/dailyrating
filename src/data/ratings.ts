export const RATING_EMOJIS = ["😞", "😔", "🙁", "😕", "😐", "🙂", "😊", "😄", "😁", "😆"] as const;

export interface RatingLog {
  date: string;
  score: number;
}

export function getRatingEmoji(score: number) {
  const normalizedScore = Math.max(1, Math.min(10, Math.round(score)));
  return RATING_EMOJIS[normalizedScore - 1];
}

export function parseLocalDate(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day, 12);
}

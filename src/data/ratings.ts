export const RATING_EMOJIS = ["😞", "😔", "🙁", "😕", "😐", "🙂", "😊", "😄", "😁", "😆"] as const;

export interface RatingLog {
  date: string;
  score: number;
}

export function getRatingEmoji(score: number) {
  const normalizedScore = Math.max(1, Math.min(10, Math.round(score)));
  return RATING_EMOJIS[normalizedScore - 1];
}

const scorePattern = [7, 8, 6, 9, 7, 5, 8, 8, 6, 7, 9, 8, 7, 6, 8];

function toLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Temporary demo history. This keeps the dashboard useful until ratings are persisted.
export const demoRatingLogs: RatingLog[] = Array.from({ length: 62 }, (_, index) => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - index);

  return {
    date: toLocalDateKey(date),
    score: scorePattern[index % scorePattern.length],
  };
}).filter((_, index) => ![6, 18, 19, 33, 48].includes(index));

export function parseLocalDate(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day, 12);
}


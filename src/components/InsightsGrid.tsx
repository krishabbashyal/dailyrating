import type { RatingLog } from "../data/ratings";
import { getRatingEmoji, parseLocalDate } from "../data/ratings";

interface InsightsGridProps {
  logs: RatingLog[];
}

function average(logs: RatingLog[]) {
  if (!logs.length) return 0;
  return logs.reduce((total, log) => total + log.score, 0) / logs.length;
}

function getStreak(logs: RatingLog[]) {
  const dates = new Set(logs.map((log) => log.date));
  const cursor = new Date();
  cursor.setHours(12, 0, 0, 0);
  let streak = 0;

  while (dates.has(`${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`)) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export default function InsightsGrid({ logs }: InsightsGridProps) {
  const now = new Date();
  const currentMonth = logs.filter((log) => {
    const date = parseLocalDate(log.date);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });
  const previousMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const previousMonth = logs.filter((log) => {
    const date = parseLocalDate(log.date);
    return date.getMonth() === previousMonthDate.getMonth() && date.getFullYear() === previousMonthDate.getFullYear();
  });

  const currentAverage = average(currentMonth);
  const previousAverage = average(previousMonth);
  const difference = Number(currentAverage.toFixed(1)) - Number(previousAverage.toFixed(1));
  const streak = getStreak(logs);

  return (
    <section aria-labelledby="insights-heading" className="mt-4">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-primary/70">At a glance</p>
          <h2 id="insights-heading" className="mt-1 text-xl font-extrabold text-slate-900">Your momentum</h2>
        </div>
        <span className="text-xs font-semibold text-slate-400">This month</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <article className="rounded-[1.6rem] bg-brand-primary p-3 text-white shadow-lg shadow-brand-primary/15">
          <div className="flex items-start justify-between">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-lg">🔥</span>
            <span className="rounded-full bg-white/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wide">Active</span>
          </div>
          <p className="mt-3 text-2xl font-black">{streak}</p>
          <p className="text-sm font-semibold text-white/75">day streak</p>
        </article>

        <article className="rounded-[1.6rem] border border-white/70 bg-white/75 p-3 shadow-lg shadow-slate-900/5 backdrop-blur">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-lg">{getRatingEmoji(currentAverage || 5)}</span>
          <div className="mt-3 flex items-end gap-1">
            <p className="text-2xl font-black text-slate-900">{currentAverage.toFixed(1)}</p>
            <span className="mb-1 text-xs font-bold text-slate-400">/10</span>
          </div>
          <p className="text-sm font-semibold text-slate-500">{currentMonth.length} check-ins this month</p>
        </article>

        <article className="col-span-2 flex items-center justify-between rounded-[1.6rem] border border-white/70 bg-white/75 p-3 shadow-lg shadow-slate-900/5 backdrop-blur">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Month over month</p>
            <p className="mt-1 text-lg font-extrabold text-slate-900">{difference >= 0 ? "+" : ""}{difference.toFixed(1)} points</p>
            <p className="mt-0.5 text-xs font-medium text-slate-500">Compared with last month’s {previousAverage.toFixed(1)}</p>
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${difference >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
            {difference >= 0 ? "↗" : "↘"}
          </div>
        </article>
      </div>
    </section>
  );
}

import type { RatingLog } from "../data/ratings";
import { getRatingEmoji, parseLocalDate } from "../data/ratings";

interface HistoryCardProps {
  logs: RatingLog[];
}

export default function HistoryCard({ logs }: HistoryCardProps) {
  const recentLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 7).reverse();
  const average = recentLogs.reduce((total, log) => total + log.score, 0) / recentLogs.length;

  return (
    <section className="mt-3 overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-4 shadow-xl shadow-slate-900/5 backdrop-blur">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-primary/70">Last 7 check-ins</p>
          <h2 className="mt-1 text-xl font-extrabold text-slate-900">Recent rhythm</h2>
        </div>
        <div className="rounded-2xl bg-brand-secondary/20 px-3 py-2 text-right">
          <p className="text-lg font-black leading-none text-brand-primary">{average.toFixed(1)}</p>
          <p className="mt-1 text-[9px] font-bold uppercase tracking-wide text-brand-primary/60">Average</p>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-2" aria-label="Recent rating trend">
        {recentLogs.map((log) => {
          const date = parseLocalDate(log.date);
          const isToday = new Date().toDateString() === date.toDateString();

          return (
            <div key={log.date} className="flex min-w-0 flex-1 flex-col items-center">
              <div className="flex h-20 w-full items-end justify-center rounded-full bg-slate-100/80 p-1">
                <div
                  className={`flex w-full items-start justify-center rounded-full pt-2 transition-all ${isToday ? "bg-brand-primary" : "bg-brand-secondary/55"}`}
                  style={{ height: `${Math.max(32, log.score * 10)}%` }}
                  title={`${date.toLocaleDateString(undefined, { weekday: "long" })}: ${log.score} out of 10`}
                >
                  <span className="text-base leading-none">{getRatingEmoji(log.score)}</span>
                </div>
              </div>
              <span className={`mt-2 text-[10px] font-bold uppercase ${isToday ? "text-brand-primary" : "text-slate-400"}`}>
                {date.toLocaleDateString(undefined, { weekday: "narrow" })}
              </span>
              <span className="mt-0.5 text-[10px] font-semibold text-slate-600">{log.score}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

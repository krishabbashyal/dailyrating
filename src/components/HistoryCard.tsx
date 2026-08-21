import type { RatingLog } from "../data/ratings";
import { getRatingEmoji, parseLocalDate } from "../data/ratings";

interface HistoryCardProps {
  logs: RatingLog[];
}

export default function HistoryCard({ logs }: HistoryCardProps) {
  const recentLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 7).reverse();
  const average = recentLogs.length
    ? recentLogs.reduce((total, log) => total + log.score, 0) / recentLogs.length
    : null;

  return (
    <section className="mt-3 overflow-hidden rounded-3xl border border-white/70 bg-white/80 p-4 shadow-xl shadow-slate-900/5 backdrop-blur">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-primary/70">Last 7 check-ins</p>
          <h2 className="mt-1 text-xl font-extrabold text-slate-900">Recent rhythm</h2>
        </div>
        <div className="rounded-2xl bg-brand-secondary/20 px-3 py-2 text-right">
          <p className="text-lg font-black leading-none text-brand-primary">{average?.toFixed(1) ?? "—"}</p>
          <p className="mt-1 text-[9px] font-bold uppercase tracking-wide text-brand-primary/60">Average</p>
        </div>
      </div>

      {recentLogs.length ? <div className="mt-3 grid grid-cols-7 gap-1.5" aria-label="Recent rating trend">
        {recentLogs.map((log) => {
          const date = parseLocalDate(log.date);
          const isToday = new Date().toDateString() === date.toDateString();

          return (
            <div key={log.date} className="flex min-w-0 flex-col items-center">
              <div className={`flex flex-row h-6 w-full items-center justify-center rounded-full text-[11px] font-black tabular-nums ${isToday ? "bg-brand-primary text-white" : "bg-brand-secondary/25 text-brand-primary"}`}>
                <span>{log.score}</span>
                <span className={`font-medium ${isToday ? 'text-white/80' : 'text-brand-primary/60'} text-[9px]`}>/10</span>
              </div>
              <div className="relative mt-2 flex h-20 w-full items-end justify-center rounded-xl border border-brand-secondary/25" aria-hidden="true">
                <div
                  className={`relative flex w-full items-center justify-center rounded-xl transition-all ${isToday ? "bg-brand-primary shadow-sm shadow-brand-primary/25" : "bg-brand-secondary/65"}`}
                  style={{ height: `${Math.max(28, log.score * 10)}%` }}
                  title={`${date.toLocaleDateString(undefined, { weekday: "long" })}: ${log.score} out of 10`}
                >
                  <span className="text-[15px] leading-none">{getRatingEmoji(log.score)}</span>
                </div>
              </div>
              <span className={`mt-2 text-[10px] font-extrabold uppercase ${isToday ? "text-brand-primary" : "text-slate-500"}`}>
                {date.toLocaleDateString(undefined, { weekday: "short" })}
              </span>
              <span className="mt-0.5 text-[10px] font-semibold text-slate-400">{date.getDate()}</span>
            </div>
          );
        })}
      </div> : <div className="flex h-24 items-center justify-center text-sm font-semibold text-slate-400">Your first check-in will appear here.</div>}
    </section>
  );
}

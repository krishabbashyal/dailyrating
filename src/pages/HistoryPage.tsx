import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { getRatings } from "../api/ratings";
import { getRatingEmoji, parseLocalDate, toLocalDateKey } from "../data/ratings";
import type { RatingLog } from "../data/ratings";

interface HistoryPageProps {
  apiToken: string;
}

type ViewMode = "list" | "calendar";

function calendarDays(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1, 12);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

export default function HistoryPage({ apiToken }: HistoryPageProps) {
  const [logs, setLogs] = useState<RatingLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState<ViewMode>("list");
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1, 12);
  });

  useEffect(() => {
    getRatings(apiToken)
      .then(setLogs)
      .catch((caughtError) => setError(caughtError instanceof Error ? caughtError.message : "Could not load history."))
      .finally(() => setLoading(false));
  }, [apiToken]);

  const sortedLogs = useMemo(() => [...logs].sort((a, b) => b.date.localeCompare(a.date)), [logs]);
  const logByDate = useMemo(() => new Map(logs.map((log) => [log.date, log])), [logs]);
  const days = useMemo(() => calendarDays(month), [month]);

  const changeMonth = (offset: number) => {
    setMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1, 12));
  };

  return (
    <main className="flex h-full min-h-0 flex-col overflow-hidden pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
      <header className="shrink-0">
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/75 text-xl text-slate-700 shadow-sm" aria-label="Back to dashboard">←</Link>
          <div className="rounded-2xl bg-white/70 p-1">
            {(["list", "calendar"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setView(mode)}
                aria-pressed={view === mode}
                className={`rounded-xl px-3 py-2 text-xs font-bold capitalize ${view === mode ? "bg-brand-primary text-white" : "text-slate-500"}`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-brand-primary/60">Your journal</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">Rating history</h1>
        <p className="mt-1 text-sm font-semibold text-slate-500">{logs.length} total check-in{logs.length === 1 ? "" : "s"}</p>
      </header>

      <section className="mt-4 min-h-0 flex-1 overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-xl shadow-slate-900/5 backdrop-blur">
        {loading ? (
          <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-400">Loading history…</div>
        ) : error ? (
          <div className="p-5 text-sm font-semibold text-rose-700">{error}</div>
        ) : view === "list" ? (
          <div className="h-full overflow-y-auto overscroll-contain p-3">
            {sortedLogs.length ? sortedLogs.map((log) => {
              const date = parseLocalDate(log.date);
              return (
                <article key={log.date} className="mb-2 flex items-center justify-between rounded-2xl bg-slate-50/90 p-3 last:mb-0">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">{getRatingEmoji(log.score)}</span>
                    <div>
                      <p className="font-extrabold text-slate-900">{date.toLocaleDateString(undefined, { weekday: "long" })}</p>
                      <p className="text-xs font-semibold text-slate-400">{date.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}</p>
                    </div>
                  </div>
                  <p className="text-xl font-black text-brand-primary">{log.score}<span className="text-xs text-slate-400">/10</span></p>
                </article>
              );
            }) : <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-400">No ratings yet.</div>}
          </div>
        ) : (
          <div className="p-4">
            <div className="flex items-center justify-between">
              <button type="button" onClick={() => changeMonth(-1)} className="h-9 w-9 rounded-xl bg-slate-100 font-bold text-slate-600" aria-label="Previous month">←</button>
              <h2 className="font-extrabold text-slate-900">{month.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</h2>
              <button type="button" onClick={() => changeMonth(1)} className="h-9 w-9 rounded-xl bg-slate-100 font-bold text-slate-600" aria-label="Next month">→</button>
            </div>
            <div className="mt-4 grid grid-cols-7 gap-1 text-center">
              {Array.from({ length: 7 }, (_, index) => (
                <span key={index} className="pb-1 text-[10px] font-bold uppercase text-slate-400">{new Date(2026, 7, 16 + index).toLocaleDateString(undefined, { weekday: "narrow" })}</span>
              ))}
              {days.map((date) => {
                const key = toLocalDateKey(date);
                const log = logByDate.get(key);
                const inMonth = date.getMonth() === month.getMonth();
                return (
                  <div key={key} className={`flex aspect-square flex-col items-center justify-center rounded-xl text-[10px] font-bold ${log ? "bg-brand-secondary/30 text-brand-primary" : "text-slate-400"} ${inMonth ? "" : "opacity-25"}`} title={log ? `${log.score} out of 10` : undefined}>
                    <span>{date.getDate()}</span>
                    <span className="h-3 text-xs leading-none">{log ? getRatingEmoji(log.score) : ""}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

import { useState } from "react";

const HistoryCard = () => {
  const [weeklyLogs] = useState([
    { day: "Wed", date: "12", emoji: "😊", score: 4 },
    { day: "Thu", date: "13", emoji: "🤩", score: 5 },
    { day: "Fri", date: "14", emoji: "😐", score: 3 },
    { day: "Sat", date: "15", emoji: "😔", score: 2 },
    { day: "Sun", date: "16", emoji: "😊", score: 4 },
    { day: "Mon", date: "17", emoji: "🥳", score: 5 },
    { day: "Tue", date: "18", emoji: null, score: null },
  ]);

  const loggedDays = weeklyLogs.filter((log) => log.score !== null);
  const average = loggedDays.reduce((sum, log) => sum + (log.score ?? 0), 0) / loggedDays.length;

  return (
    <section className="mt-6 bg-white/50 rounded-2xl p-5 shadow-2xl border border-gray-200">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-800">Your Week</h2>
          <p className="mt-0.5 text-xs text-slate-600">Last 7 days</p>
        </div>

        <div className="text-right">
          <div className="text-lg font-bold text-brand-primary">
            {average.toFixed(1)}
            <span className="text-xs font-medium text-slate-600"> / 10</span>
          </div>
          <p className="text-[10px] font-medium uppercase tracking-wide text-slate-600">Average</p>
        </div>
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1.5">
        {weeklyLogs.map((log) => {
          const isToday = log.date === "18";
          const isLogged = log.score !== null;

          return (
            <div
              key={log.day}
              className={`relative flex  flex-col items-center rounded-2xl px-1.5 py-2.5 transition-all ${
                isToday ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20" : "bg-slate-50"
              }`}>
              {/* Day */}
              <span className={`text-[10px] font-bold uppercase tracking-wide ${isToday ? "text-white/80" : "text-slate-600"}`}>{log.day}</span>

              {/* Date */}
              <span className={`text-[10px] ${isToday ? "text-white" : "text-slate-500"}`}>{log.date}</span>

              {/* Emoji */}
              <div className="my-2 flex h-9 items-center justify-center">
                {isLogged ? (
                  <span className="select-none text-2xl">{log.emoji}</span>
                ) : (
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-dashed ${
                      isToday ? "border-white text-white" : "border-slate-200 text-slate-300"
                    }`}>
                    <span className="text-xs font-bold">?</span>
                  </div>
                )}
              </div>

              {/* Score */}
              {isLogged ? (
                <span className={`text-xs font-bold ${isToday ? "text-white" : "text-slate-600"}`}>{log.score}/10</span>
              ) : (
                <span className={`text-[10px] font-medium ${isToday ? "text-white" : "text-slate-200"}`}>N/A</span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HistoryCard;

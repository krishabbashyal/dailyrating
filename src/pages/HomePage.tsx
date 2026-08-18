import { useState } from 'react'
import GreetingBar from '../components/GreetingBar'
import CustomButton from '../components/CustomButton'
import { Link } from 'react-router'

const HomePage = () => {
  // Mock data for the last 7 days (including today)
  const [weeklyLogs] = useState([
    { day: 'Wed', date: 'Aug 12', emoji: '😊', score: 4, label: 'Good' },
    { day: 'Thu', date: 'Aug 13', emoji: '🤩', score: 5, label: 'Great' },
    { day: 'Fri', date: 'Aug 14', emoji: '😐', score: 3, label: 'Okay' },
    { day: 'Sat', date: 'Aug 15', emoji: '😔', score: 2, label: 'Down' },
    { day: 'Sun', date: 'Aug 16', emoji: '😊', score: 4, label: 'Good' },
    { day: 'Mon', date: 'Aug 17', emoji: '🥳', score: 5, label: 'Awesome' },
    { day: 'Tue', date: 'Today',  emoji: null, score: null, label: 'Pending' }, // Unlogged today
  ])

  // Calculated metrics
  const loggedDays = weeklyLogs.filter((item) => item.score !== null)
  const averageScore = (
    loggedDays.reduce((acc, curr) => acc + curr.score, 0) / loggedDays.length
  ).toFixed(1)
  const currentStreak = 6

  return (
    <main className="min-h-screen overscroll-none pb-12 flex flex-col justify-between">
      <div className="pt-16">
        <GreetingBar />

        {/* 7-Day History Card */}
        <section className="mx-6 mt-6 rounded-3xl bg-white p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-800">Last 7 Days</h2>
            <span className="text-xs font-medium text-slate-400">Past Week</span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {weeklyLogs.map((log) => {
              const isToday = log.date === 'Today'
              const isLogged = log.score !== null

              return (
                <div
                  key={log.day}
                  className={`flex flex-col items-center justify-between rounded-2xl py-3 px-1 transition-all ${
                    isToday
                      ? 'border-2 border-dashed border-brand-primary/50 bg-brand-primary/5'
                      : 'bg-slate-50'
                  }`}
                >
                  <span className="text-[11px] font-medium text-slate-400">{log.day}</span>
                  
                  <span className="text-2xl my-2 select-none">
                    {isLogged ? log.emoji : <span className="text-base text-slate-300 font-bold">?</span>}
                  </span>

                  <span
                    className={`text-[11px] font-bold ${
                      isToday ? 'text-brand-primary' : 'text-slate-600'
                    }`}
                  >
                    {isLogged ? `${log.score}/5` : '—'}
                  </span>
                </div>
              )
            })}
          </div>
        </section>

        {/* Summary & Analytics Card */}
        <section className="mx-6 mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100 text-center">
            <p className="text-xs text-slate-400 font-medium">Average</p>
            <p className="text-lg font-bold text-slate-800 mt-1">{averageScore} <span className="text-xs font-normal text-slate-400">/ 5</span></p>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100 text-center">
            <p className="text-xs text-slate-400 font-medium">Streak</p>
            <p className="text-lg font-bold text-brand-primary mt-1">{currentStreak} Days 🔥</p>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100 text-center">
            <p className="text-xs text-slate-400 font-medium">Top Mood</p>
            <p className="text-lg font-bold text-slate-800 mt-1">😊 Good</p>
          </div>
        </section>
      </div>

      {/* Action Area */}
      <div className="flex flex-col items-center justify-center mt-10 px-8">

        <Link className="w-full" to="/log">
          <CustomButton
            customClasses="bg-brand-primary w-full h-12 shadow-md hover:opacity-95 active:scale-[0.99] transition-transform"
            label="Log Today's"
          />
        </Link>
        <p className="text-xs text-slate-400 mt-3 text-center">
          Takes less than 10 seconds to check in
        </p>
      </div>
    </main>
  )
}

export default HomePage
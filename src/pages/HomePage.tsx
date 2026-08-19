import HistoryCard from "../components/HistoryCard";
import GreetingBar from "../components/GreetingBar";
import CustomButton from "../components/CustomButton";
import InsightsGrid from "../components/InsightsGrid";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import type { RatingLog } from "../data/ratings";
import { clearApiToken, getRatings } from "../api/ratings";

interface HomePageProps {
  apiToken: string;
  onTokenInvalid: () => void;
}

const HomePage = ({ apiToken, onTokenInvalid }: HomePageProps) => {
  const [logs, setLogs] = useState<RatingLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getRatings(apiToken)
      .then(setLogs)
      .catch((caughtError) => setError(caughtError instanceof Error ? caughtError.message : "Could not load ratings."))
      .finally(() => setLoading(false));
  }, [apiToken]);

  const resetAccessKey = () => {
    clearApiToken();
    onTokenInvalid();
  };

  return (
    <main className="h-full overflow-hidden pb-24">
      <div className="pt-3">
        <GreetingBar />
        {error ? (
          <section className="mt-5 rounded-[2rem] border border-rose-100 bg-white/80 p-5 shadow-xl shadow-slate-900/5">
            <p className="font-bold text-rose-800">Couldn’t load your ratings</p>
            <p className="mt-1 text-sm text-slate-500">{error}</p>
            <button type="button" onClick={resetAccessKey} className="mt-4 text-sm font-bold text-brand-primary">Enter access key again</button>
          </section>
        ) : loading ? (
          <div className="mt-8 text-center text-sm font-semibold text-slate-400">Loading your check-ins…</div>
        ) : (
          <>
            <HistoryCard logs={logs} />
            <InsightsGrid logs={logs} />
          </>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-white/60 bg-[#f3eee8]/85 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
        <Link className="mx-auto block max-w-md" to="/log">
          <CustomButton customClasses="bg-brand-primary w-full h-14 rounded-2xl shadow-lg shadow-brand-primary/20 hover:opacity-95 active:scale-[0.99] transition-transform" label="Log today’s rating" />
        </Link>
      </div>
    </main>
  );
};

export default HomePage;

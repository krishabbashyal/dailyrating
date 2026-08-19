import EmojiSlider from "../components/EmojiSlider";
import CustomButton from "../components/CustomButton";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { getRatings, saveRating } from "../api/ratings";
import { parseLocalDate, toLocalDateKey } from "../data/ratings";

interface RatingPageProps {
  apiToken: string;
}

const RatingPage = ({ apiToken }: RatingPageProps) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const dateOptions = useMemo(() => Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - index);
    return { key: toLocalDateKey(date), date };
  }).reverse(), []);
  const requestedDate = searchParams.get("date");
  const selectedDate = dateOptions.some((option) => option.key === requestedDate)
    ? requestedDate!
    : dateOptions.at(-1)!.key;
  const [rating, setRating] = useState(5);
  const [existingScores, setExistingScores] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getRatings(apiToken)
      .then((logs) => setExistingScores(Object.fromEntries(logs.map((log) => [log.date, log.score]))))
      .catch(() => {});
  }, [apiToken]);

  useEffect(() => {
    setRating(existingScores[selectedDate] ?? 5);
  }, [existingScores, selectedDate]);

  const chooseDate = (date: string) => {
    setSearchParams(date === dateOptions.at(-1)!.key ? {} : { date });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      await saveRating(apiToken, { date: selectedDate, score: rating });
      navigate("/");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not save your rating.");
      setSaving(false);
    }
  };

  return (
    <main className="h-full overflow-hidden pb-24 pt-4">
      <Link to="/" className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/75 text-xl text-slate-700 shadow-sm" aria-label="Back to dashboard">
        ←
      </Link>
      <div className="mt-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-primary/60">Daily check-in</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">How was your day?</h1>
        <p className="mt-2 font-medium text-slate-500">Choose any day from the last week.</p>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1.5" aria-label="Choose a day to rate">
        {dateOptions.map((option) => {
          const active = option.key === selectedDate;
          const existingScore = existingScores[option.key];
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => chooseDate(option.key)}
              aria-pressed={active}
              aria-label={`${option.date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}, ${existingScore ? `rated ${existingScore} out of 10` : "not rated"}`}
              className={`flex min-w-0 flex-col items-center rounded-2xl py-2 text-[10px] font-bold transition ${active ? "bg-brand-primary text-white shadow-md" : "bg-white/70 text-slate-500"}`}
            >
              <span className="uppercase">{option.date.toLocaleDateString(undefined, { weekday: "narrow" })}</span>
              <span className="mt-0.5 text-xs">{option.date.getDate()}</span>
              <span className={`mt-1 h-1.5 w-1.5 rounded-full ${existingScore ? (active ? "bg-white" : "bg-brand-primary") : "bg-slate-200"}`} aria-hidden="true" />
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-center text-xs font-bold text-slate-400">
        {parseLocalDate(selectedDate).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
      </p>
      <div className="mt-3">
        <EmojiSlider value={rating} onChange={setRating} />
      </div>
      {error && <p role="alert" className="mt-4 text-center text-sm font-semibold text-rose-700">{error}</p>}
      <div className="fixed inset-x-0 bottom-0 border-t border-white/60 bg-[#f3eee8]/85 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
        <div className="mx-auto max-w-md">
          <CustomButton
            customClasses="h-14 w-full rounded-2xl bg-brand-primary shadow-lg shadow-brand-primary/20"
            label={selectedDate === dateOptions.at(-1)!.key ? "Save today’s rating" : "Save this rating"}
            onClick={handleSave}
            isSubmitting={saving}
            submittingText="Saving…"
          />
        </div>
      </div>
    </main>
  );
};

export default RatingPage;

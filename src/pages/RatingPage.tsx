import EmojiSlider from "../components/EmojiSlider";
import CustomButton from "../components/CustomButton";
import { Link } from "react-router";
const RatingPage = () => {
  return (
    <main className="h-full overflow-hidden pb-24 pt-4">
      <Link to="/" className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/75 text-xl text-slate-700 shadow-sm" aria-label="Back to dashboard">
        ←
      </Link>
      <div className="mt-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-primary/60">Today’s check-in</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">How was your day?</h1>
        <p className="mt-2 font-medium text-slate-500">Move the slider to the feeling that fits best.</p>
      </div>
      <div className="mt-5">
        <EmojiSlider />
      </div>
      <div className="fixed inset-x-0 bottom-0 border-t border-white/60 bg-[#f3eee8]/85 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
        <div className="mx-auto max-w-md">
          <Link to="/">
            <CustomButton customClasses="h-14 w-full rounded-2xl bg-brand-primary shadow-lg shadow-brand-primary/20" label="Save today’s rating" onClick={() => {}} />
          </Link>
        </div>
      </div>
    </main>
  );
};

export default RatingPage;

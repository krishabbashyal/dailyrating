import HistoryCard from "../components/HistoryCard";
import GreetingBar from "../components/GreetingBar";
import CustomButton from "../components/CustomButton";
import InsightsGrid from "../components/InsightsGrid";
import { demoRatingLogs } from "../data/ratings";
import { Link } from "react-router";

const HomePage = () => {
  return (
    <main className="min-h-screen overscroll-none pb-32">
      <div className="pt-10">
        <GreetingBar />
        <HistoryCard logs={demoRatingLogs} />
        <InsightsGrid logs={demoRatingLogs} />
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

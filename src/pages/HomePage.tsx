import HistoryCard from "../components/HistoryCard";
import GreetingBar from "../components/GreetingBar";
import CustomButton from "../components/CustomButton";
import { Link } from "react-router";

const HomePage = () => {
  // Mock data for the last 7 days (including today)



  return (
    <main className="min-h-screen overscroll-none pb-12 flex flex-col justify-between">
      <div className="pt-16">
        <GreetingBar />

        {/* 7-Day History Card */}
        <HistoryCard />
      </div>

      <div className="flex flex-col items-center justify-center mt-10 px-8">
        <Link className="w-full" to="/log">
          <CustomButton customClasses="bg-brand-primary w-full h-12 shadow-md hover:opacity-95 active:scale-[0.99] transition-transform" label="Log Today's" />
        </Link>
      </div>
    </main>
  );
};

export default HomePage;

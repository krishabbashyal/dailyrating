import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import RatingPage from "./pages/RatingPage";

export default function App() {
  return (
    <div className="h-[100dvh] overflow-hidden pt-[env(safe-area-inset-top)]">
      <main className="mx-auto h-full max-w-lg overflow-hidden px-5">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/log" element={<RatingPage />} />
        </Routes>
      </main>
    </div>
  );
}

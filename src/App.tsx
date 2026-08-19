import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import RatingPage from "./pages/RatingPage";

export default function App() {
  return (
    <div>
      <main className="mx-auto max-w-lg px-5">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/log" element={<RatingPage />} />
        </Routes>
      </main>
    </div>
  );
}

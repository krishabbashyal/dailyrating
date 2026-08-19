import { useState } from "react";
import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import RatingPage from "./pages/RatingPage";
import AccessSetup from "./components/AccessSetup";
import { getStoredApiToken } from "./api/ratings";

export default function App() {
  const [apiToken, setApiToken] = useState(getStoredApiToken);

  return (
    <div className="h-[100dvh] overflow-hidden pt-[env(safe-area-inset-top)]">
      <main className="mx-auto h-full max-w-lg overflow-hidden px-5">
        {apiToken ? (
          <Routes>
            <Route path="/" element={<HomePage apiToken={apiToken} onTokenInvalid={() => setApiToken(null)} />} />
            <Route path="/log" element={<RatingPage apiToken={apiToken} />} />
          </Routes>
        ) : (
          <AccessSetup onConnected={setApiToken} />
        )}
      </main>
    </div>
  );
}

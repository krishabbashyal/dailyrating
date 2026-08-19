import { useState } from "react";
import type { FormEvent } from "react";
import { getRatings, storeApiToken } from "../api/ratings";

interface AccessSetupProps {
  onConnected: (token: string) => void;
}

export default function AccessSetup({ onConnected }: AccessSetupProps) {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [connecting, setConnecting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmedToken = token.trim();
    if (!trimmedToken) return;

    setConnecting(true);
    setError("");

    try {
      await getRatings(trimmedToken);
      storeApiToken(trimmedToken);
      onConnected(trimmedToken);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not connect.");
    } finally {
      setConnecting(false);
    }
  };

  return (
    <main className="flex h-full items-center">
      <section className="w-full rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-900/5 backdrop-blur">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-primary/60">Private setup</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Connect your journal</h1>
        <p className="mt-2 font-medium text-slate-500">Paste the access key once. It stays on this iPhone.</p>

        <form className="mt-7" onSubmit={handleSubmit}>
          <label htmlFor="access-key" className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Access key</label>
          <input
            id="access-key"
            type="password"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            className="mt-2 h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 font-mono text-sm text-slate-900 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
          />
          {error && <p role="alert" className="mt-3 text-sm font-semibold text-rose-700">{error}</p>}
          <button
            type="submit"
            disabled={connecting || !token.trim()}
            className="mt-5 h-14 w-full rounded-2xl bg-brand-primary font-bold text-white shadow-lg shadow-brand-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {connecting ? "Connecting…" : "Connect journal"}
          </button>
        </form>
      </section>
    </main>
  );
}

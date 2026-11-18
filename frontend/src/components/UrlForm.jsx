import { useState } from "react";

export default function UrlForm({ onCreated }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onCreated(url);
      setUrl("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex">
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste a long URL..."
        className="flex-1 border-2 border-[var(--border)] bg-[var(--card)] px-4 py-3 font-mono text-sm outline-none focus:outline-[3px] focus:outline-[var(--accent)]"
      />
      <button type="submit" disabled={loading} className="border-2 border-l-0 border-[var(--border)] bg-[var(--accent)] px-6 py-3 font-bold shadow-[var(--shadow)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
        {loading ? "..." : "Shorten"}
      </button>
    </form>
  );
}

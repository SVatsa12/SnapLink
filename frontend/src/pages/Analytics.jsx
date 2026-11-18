import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Analytics = () => {
  const { user } = useAuth();
  const [links, setLinks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const frontendBase = import.meta.env.VITE_REDIRECT_BASE || "http://localhost:5000";

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/url/my-links");
        setLinks(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchLinks();
  }, []);

  const summary = useMemo(() => {
    const totalLinks = links.length;
    const totalClicks = links.reduce((sum, link) => sum + link.clickCount, 0);
    const avgClicks = totalLinks ? Math.round(totalClicks / totalLinks) : 0;
    const mostClicked = links.reduce(
      (best, link) => (link.clickCount > (best?.clickCount || 0) ? link : best),
      null
    );
    const sorted = [...links].sort((a, b) => b.clickCount - a.clickCount);
    return { totalLinks, totalClicks, avgClicks, mostClicked, sorted };
  }, [links]);

  const maxClicks = summary.sorted[0]?.clickCount || 1;

  return (
    <div>
      <h1 className="font-extrabold text-3xl tracking-tight mb-1">Analytics</h1>
      <p className="font-mono text-sm text-[var(--muted)] mb-6">Understand how your links are performing.</p>

      {error && (
        <div className="mb-6 border-2 border-red-500 bg-red-100 px-4 py-3 text-sm font-mono">{error}</div>
      )}

      {loading ? (
        <div className="space-y-3">
          <div className="h-20 border-2 border-[var(--border)] bg-[var(--card)] animate-pulse" />
          <div className="h-40 border-2 border-[var(--border)] bg-[var(--card)] animate-pulse" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 border-2 border-[var(--border)] shadow-[var(--shadow)] bg-[var(--card)] mb-6">
            <div className="p-4 border-r-2 border-b-2 md:border-b-0 border-[var(--border)]">
              <div className="text-xs uppercase font-mono text-[var(--muted)]">Total Links</div>
              <div className="font-mono font-bold text-2xl">{summary.totalLinks}</div>
            </div>
            <div className="p-4 border-b-2 md:border-b-0 md:border-r-2 border-[var(--border)]">
              <div className="text-xs uppercase font-mono text-[var(--muted)]">Total Clicks</div>
              <div className="font-mono font-bold text-2xl">{summary.totalClicks}</div>
            </div>
            <div className="p-4 border-r-2 border-[var(--border)]">
              <div className="text-xs uppercase font-mono text-[var(--muted)]">Avg. Clicks</div>
              <div className="font-mono font-bold text-2xl">{summary.avgClicks}</div>
            </div>
            <div className="p-4">
              <div className="text-xs uppercase font-mono text-[var(--muted)]">Top Link</div>
              <div className="font-mono font-bold text-2xl">
                {summary.mostClicked ? <span className="bg-[var(--accent)] px-1 border-2 border-[var(--border)]">{summary.mostClicked.shortCode}</span> : 0}
              </div>
            </div>
          </div>

          {summary.sorted.length === 0 ? (
            <div className="border-2 border-[var(--border)] bg-[var(--card)] p-8 text-center shadow-[var(--shadow)]">
              <p className="font-bold text-xl mb-2">No clicks yet. Share a link first.</p>
              <a href="/dashboard" className="inline-block border-2 border-[var(--border)] bg-[var(--accent)] px-4 py-2 font-bold shadow-[var(--shadow)]">Go to Dashboard</a>
            </div>
          ) : (
            <>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-bold text-xl">Link Performance</h2>
                <span className="font-mono text-xs text-[var(--muted)]">{summary.sorted.length} links total</span>
              </div>
              <div className="border-2 border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow)] p-4 mb-6">
                {summary.sorted.map((link, i) => {
                  const pct = Math.max(4, Math.round((link.clickCount / maxClicks) * 100));
                  return (
                    <div key={link._id || link.id} className="flex items-center gap-3 py-2">
                      <div className="w-16 font-mono text-sm font-bold truncate">/{link.shortCode}</div>
                      <div className="flex-1 h-4 border-2 border-[var(--border)] bg-[var(--bg)]">
                        <div className="h-full bg-[var(--accent)] border-r-2 border-[var(--border)]" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="font-mono text-sm w-12 text-right">{link.clickCount}</div>
                    </div>
                  );
                })}
              </div>

              <div className="border-2 border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow)] p-4">
                <h2 className="font-bold text-xl mb-3">Top links</h2>
                {summary.sorted.map((link, i) => (
                  <div key={link._id || link.id} className="flex items-center gap-3 py-2 border-b border-[var(--border)] last:border-b-0">
                    <div className="font-mono font-bold w-6">{i + 1}</div>
                    <img src={`https://www.google.com/s2/favicons?domain=${new URL(link.originalUrl).hostname}&sz=64`} alt="" className="h-5 w-5" />
                    <div className="flex-1 min-w-0">
                      <div className="font-mono font-bold truncate">{link.shortCode}</div>
                      <div className="text-xs text-[var(--muted)] truncate" title={link.originalUrl}>{link.originalUrl}</div>
                    </div>
                    <div className="font-mono text-sm">{link.clickCount}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Analytics;

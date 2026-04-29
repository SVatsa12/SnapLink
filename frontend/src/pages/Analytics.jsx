import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const TrendingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
  </svg>
);

const LinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const BarChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

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

  const stats = [
    {
      icon: <LinkIcon />,
      label: "Total Links",
      value: summary.totalLinks,
      sub: "All time",
      gradient: "from-cyan-500 to-sky-500",
      border: "border-cyan-500/20",
      glow: "shadow-cyan-500/20",
    },
    {
      icon: <TrendingIcon />,
      label: "Total Clicks",
      value: summary.totalClicks,
      sub: "Across all links",
      gradient: "from-violet-500 to-purple-500",
      border: "border-violet-500/20",
      glow: "shadow-violet-500/20",
    },
    {
      icon: <BarChartIcon />,
      label: "Avg. Clicks",
      value: summary.avgClicks,
      sub: "Per link",
      gradient: "from-emerald-500 to-teal-500",
      border: "border-emerald-500/20",
      glow: "shadow-emerald-500/20",
    },
    {
      icon: <StarIcon />,
      label: "Top Link",
      value: summary.mostClicked?.clickCount ?? 0,
      sub: summary.mostClicked?.shortCode ? `/${summary.mostClicked.shortCode}` : "No data",
      gradient: "from-amber-500 to-orange-500",
      border: "border-amber-500/20",
      glow: "shadow-amber-500/20",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8 animate-slide-up">
        <div className="mb-1 flex items-center gap-2">
          <span className="badge">Analytics</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
          Performance{" "}
          <span className="text-gradient">Insights</span>
        </h1>
        <p className="mt-2 text-slate-400">
          Understand how your links are performing at a glance.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-400 animate-fade-in">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-500/20">
            <svg className="h-7 w-7 animate-spin text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <p className="text-sm text-slate-500">Loading analytics...</p>
        </div>
      ) : (
        <>
          {/* Stats grid */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-slide-up delay-100">
            {stats.map(({ icon, label, value, sub, gradient, border, glow }) => (
              <div
                key={label}
                className={`stat-card border ${border} flex flex-col gap-3`}
              >
                <div className="flex items-center justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg ${glow} text-white`}>
                    {icon}
                  </div>
                  <span className="text-xs text-slate-600">{sub}</span>
                </div>
                <div>
                  <p className="font-display text-3xl font-bold text-white">{value}</p>
                  <p className="mt-0.5 text-sm text-slate-400">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Link performance bars */}
          {summary.sorted.length > 0 && (
            <div className="animate-slide-up delay-200">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold text-white">
                  Link Performance
                </h2>
                <span className="text-xs text-slate-500">{summary.sorted.length} links total</span>
              </div>
              <div className="card divide-y divide-slate-800/60">
                {summary.sorted.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800/60">
                      <BarChartIcon />
                    </div>
                    <p className="font-medium text-slate-400">No link data yet</p>
                    <p className="mt-1 text-sm text-slate-600">Create some links to see analytics here.</p>
                  </div>
                ) : (
                  summary.sorted.map((link, i) => {
                    const pct = Math.max(4, Math.round((link.clickCount / maxClicks) * 100));
                    const barColors = [
                      "bg-gradient-to-r from-cyan-500 to-sky-500",
                      "bg-gradient-to-r from-violet-500 to-purple-500",
                      "bg-gradient-to-r from-emerald-500 to-teal-500",
                      "bg-gradient-to-r from-amber-500 to-orange-500",
                    ];
                    const barColor = barColors[i % barColors.length];

                    return (
                      <div
                        key={link._id}
                        className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:gap-4"
                      >
                        {/* Rank */}
                        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-slate-800/60 text-xs font-bold text-slate-400">
                          {i + 1}
                        </div>

                        {/* Link info */}
                        <div className="min-w-0 flex-1">
                          <a
                            href={`${frontendBase}/${link.shortCode}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 text-sm font-medium text-cyan-400 transition-colors hover:text-cyan-300"
                          >
                            <span className="truncate">/{link.shortCode}</span>
                            <ExternalLinkIcon />
                          </a>
                          <p className="mt-0.5 truncate text-xs text-slate-500">{link.originalUrl}</p>
                          {/* Progress bar */}
                          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800/60">
                            <div
                              className={`h-full rounded-full ${barColor} transition-all duration-700`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>

                        {/* Clicks badge */}
                        <div className="flex items-center gap-1.5 sm:flex-shrink-0">
                          <span className={`font-display text-xl font-bold ${i === 0 ? "text-cyan-400" : "text-white"}`}>
                            {link.clickCount}
                          </span>
                          <span className="text-xs text-slate-500">clicks</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Empty state */}
          {summary.sorted.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800/60 bg-slate-900/40 py-24 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/60">
                <BarChartIcon />
              </div>
              <h3 className="font-display text-xl font-semibold text-white">No data yet</h3>
              <p className="mt-2 max-w-sm text-sm text-slate-400">
                Create some short links and share them to start seeing your analytics here.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Analytics;

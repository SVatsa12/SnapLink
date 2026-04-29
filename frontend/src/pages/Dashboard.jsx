import { useEffect, useState } from "react";
import UrlForm from "../components/UrlForm";
import UrlTable from "../components/UrlTable";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const RefreshIcon = ({ spinning }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-4 w-4 transition-transform ${spinning ? "animate-spin" : ""}`}>
    <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

const LinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const ClickIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchLinks = async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      setError("");
      const { data } = await api.get("/url/my-links");
      setLinks(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch links");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/url/${id}`);
      fetchLinks(true);
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  const totalClicks = links.reduce((s, l) => s + l.clickCount, 0);
  const topLink = links.reduce((best, l) => (l.clickCount > (best?.clickCount || 0) ? l : best), null);

  const stats = [
    {
      icon: <LinkIcon />,
      label: "Total Links",
      value: links.length,
      gradient: "from-cyan-500 to-sky-500",
      glow: "shadow-cyan-500/20",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
    },
    {
      icon: <ClickIcon />,
      label: "Total Clicks",
      value: totalClicks,
      gradient: "from-violet-500 to-purple-500",
      glow: "shadow-violet-500/20",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
    },
    {
      icon: <StarIcon />,
      label: "Top Link Clicks",
      value: topLink?.clickCount ?? 0,
      gradient: "from-amber-500 to-orange-500",
      glow: "shadow-amber-500/20",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4 animate-slide-up">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="badge">Dashboard</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Welcome back,{" "}
            <span className="text-gradient">{user?.name?.split(" ")[0]}</span>
          </h1>
          <p className="mt-2 text-slate-400">
            Manage and track all your shortened links in one place.
          </p>
        </div>
        <button
          type="button"
          onClick={() => fetchLinks(true)}
          className="flex items-center gap-2 rounded-xl border border-slate-700/50 bg-slate-800/40 px-4 py-2 text-sm font-medium text-slate-400 transition-all duration-200 hover:border-slate-600 hover:text-white"
        >
          <RefreshIcon spinning={refreshing} />
          Refresh
        </button>
      </div>

      {/* Stats row */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3 animate-slide-up delay-100">
        {stats.map(({ icon, label, value, gradient, glow, bg, border }) => (
          <div
            key={label}
            className={`stat-card flex items-center gap-4 border ${border}`}
          >
            <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg ${glow} text-white`}>
              {icon}
            </div>
            <div>
              <p className="text-sm text-slate-400">{label}</p>
              <p className="font-display text-3xl font-bold text-white">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* URL Form */}
      <div className="mb-6 animate-slide-up delay-200">
        <UrlForm onCreated={() => fetchLinks(true)} />
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-400 animate-fade-in">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      {/* Table */}
      <div className="animate-slide-up delay-300">
        {loading ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800/60 bg-slate-900/40 py-20">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-500/20">
              <svg className="h-6 w-6 animate-spin text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
            <p className="text-sm text-slate-500">Loading your links...</p>
          </div>
        ) : (
          <UrlTable links={links} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;

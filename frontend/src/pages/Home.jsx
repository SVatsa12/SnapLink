import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

const ZapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const BarChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const GlobeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const features = [
  {
    icon: <ZapIcon />,
    title: "Instant Shortening",
    desc: "Transform any long URL into a compact, shareable link in milliseconds with our high-performance engine.",
    gradient: "from-cyan-500 to-sky-500",
    glow: "shadow-cyan-500/20",
  },
  {
    icon: <BarChartIcon />,
    title: "Deep Analytics",
    desc: "Track clicks, monitor performance, and gain insights into your link engagement with real-time data.",
    gradient: "from-violet-500 to-purple-500",
    glow: "shadow-violet-500/20",
  },
  {
    icon: <ShieldIcon />,
    title: "Secure & Reliable",
    desc: "Enterprise-grade security with JWT authentication protecting your links and data 24/7.",
    gradient: "from-emerald-500 to-teal-500",
    glow: "shadow-emerald-500/20",
  },
  {
    icon: <GlobeIcon />,
    title: "Global Reach",
    desc: "Share links anywhere — your audience gets fast redirects from anywhere around the world.",
    gradient: "from-amber-500 to-orange-500",
    glow: "shadow-amber-500/20",
  },
];

const stats = [
  { value: "10K+", label: "Links Created" },
  { value: "99.9%", label: "Uptime" },
  { value: "<50ms", label: "Redirect Speed" },
  { value: "Free", label: "Always" },
];

// Animated counter hook
const useCounter = (end, duration = 2000) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    const timeout = setTimeout(() => requestAnimationFrame(animate), 500);
    return () => clearTimeout(timeout);
  }, [end, duration]);
  return count;
};

const Home = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* ─── Hero ─── */}
      <section className="relative flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-4 py-20 text-center">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/4 top-20 h-64 w-64 animate-blob rounded-full bg-cyan-600/15 blur-3xl" />
          <div className="absolute right-1/4 top-40 h-64 w-64 animate-blob rounded-full bg-violet-600/15 blur-3xl delay-300" />
        </div>

        {/* Badge */}
        <div
          className={`mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 text-sm font-medium text-cyan-400 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
          </span>
          Smart URL Shortener & Analytics Platform
        </div>

        {/* Headline */}
        <h1
          className={`font-display mx-auto max-w-4xl text-5xl font-bold leading-[1.1] tracking-tight text-white transition-all duration-700 delay-100 sm:text-6xl lg:text-7xl ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Shorten Links,{" "}
          <span className="text-gradient">Amplify</span>
          {" "}Your Reach
        </h1>

        <p
          className={`mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400 transition-all duration-700 delay-200 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Create powerful short links with built-in analytics. Track performance,
          understand your audience, and grow your online presence — all in one place.
        </p>

        {/* CTAs */}
        <div
          className={`mt-10 flex flex-wrap items-center justify-center gap-4 transition-all duration-700 delay-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Link
            to="/register"
            id="hero-get-started-btn"
            className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:from-cyan-400 hover:to-violet-400 hover:shadow-cyan-500/40 hover:scale-105"
          >
            Get Started Free
            <ArrowRightIcon />
          </Link>
          <Link
            to="/login"
            id="hero-login-btn"
            className="flex items-center gap-2 rounded-xl border border-slate-600/50 bg-slate-800/40 px-7 py-3.5 text-base font-semibold text-slate-300 backdrop-blur-sm transition-all duration-300 hover:border-slate-500 hover:bg-slate-800/70 hover:text-white"
          >
            Sign In
          </Link>
        </div>

        {/* Floating URL pill demo */}
        <div
          className={`mt-14 w-full max-w-lg transition-all duration-700 delay-400 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="glass rounded-2xl p-4 glow-cyan">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/70" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                <div className="h-3 w-3 rounded-full bg-green-500/70" />
              </div>
              <div className="flex-1 rounded-lg bg-slate-800/60 px-3 py-1.5 text-xs text-slate-400">
                https://snaplink.io/s/<span className="text-cyan-400 font-medium">xK9mPq</span>
              </div>
              <div className="rounded-md bg-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-400">
                ↗ 2.4K clicks
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className="border-y border-slate-800/60 bg-slate-900/30 py-12">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="font-display text-3xl font-bold text-white sm:text-4xl">
                  {value}
                </p>
                <p className="mt-1 text-sm text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
              Everything You Need
            </p>
            <h2 className="font-display mt-3 text-4xl font-bold text-white sm:text-5xl">
              Built for performance
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-400">
              A powerful suite of tools to create, manage, and analyze your links with ease.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon, title, desc, gradient, glow }, i) => (
              <div
                key={title}
                className="card-hover group relative"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg ${glow} text-white transition-transform duration-300 group-hover:scale-110`}>
                  {icon}
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold text-white">{title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-slate-900/50 to-violet-500/10 p-12 text-center backdrop-blur-sm">
            {/* Background glow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
            </div>
            <div className="relative">
              <h2 className="font-display text-4xl font-bold text-white sm:text-5xl">
                Start for free today
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-slate-400">
                Join thousands of creators and businesses who trust SnapLink to power their link sharing.
              </p>
              <Link
                to="/register"
                id="cta-register-btn"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:from-cyan-400 hover:to-violet-400 hover:shadow-cyan-500/40 hover:scale-105"
              >
                Create Free Account
                <ArrowRightIcon />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 px-4 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-slate-500 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-cyan-500 to-violet-500 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3.5 w-3.5">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
            <span className="font-semibold text-slate-400">SnapLink</span>
          </div>
          <p>© {new Date().getFullYear()} SnapLink. Crafted with precision.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

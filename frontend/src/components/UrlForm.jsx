import { useState } from "react";
import api from "../services/api";

const LinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-slate-400">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-emerald-400">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const UrlForm = ({ onCreated }) => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { shortUrl, error }
  const [copied, setCopied] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setResult(null);
      const { data } = await api.post("/url/create", { originalUrl });
      setResult({ shortUrl: data.shortUrl, success: true });
      setOriginalUrl("");
      onCreated();
    } catch (error) {
      setResult({ error: error.response?.data?.message || "Failed to create short URL", success: false });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result?.shortUrl) return;
    try {
      await navigator.clipboard.writeText(result.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-6 backdrop-blur-sm shadow-xl">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/20">
          <LinkIcon />
        </div>
        <div>
          <h2 className="font-display text-base font-semibold text-white">Shorten a URL</h2>
          <p className="text-xs text-slate-500">Paste any link and get a short URL instantly</p>
        </div>
      </div>

      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2">
              <LinkIcon />
            </div>
            <input
              id="url-form-input"
              type="url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              required
              placeholder="https://your-long-url-here.com/path/to/page"
              className="input-field pl-10"
            />
          </div>
          <button
            id="url-form-submit"
            type="submit"
            disabled={loading}
            className="btn-primary flex flex-shrink-0 items-center justify-center gap-2 px-5 py-3"
          >
            {loading ? (
              <>
                <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Shortening...
              </>
            ) : (
              <>
                Shorten
                <ArrowRightIcon />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Result */}
      {result && (
        <div className={`mt-4 animate-slide-up rounded-xl border px-4 py-3 ${
          result.success
            ? "border-emerald-500/20 bg-emerald-500/10"
            : "border-rose-500/20 bg-rose-500/10"
        }`}>
          {result.success ? (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <CheckIcon />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-emerald-400 mb-0.5">Link created!</p>
                  <a
                    href={result.shortUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate text-sm font-medium text-white hover:text-cyan-300 transition-colors"
                  >
                    {result.shortUrl}
                  </a>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className={`copy-btn flex-shrink-0 transition-all ${
                  copied ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-400" : ""
                }`}
                title="Copy to clipboard"
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-rose-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {result.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UrlForm;

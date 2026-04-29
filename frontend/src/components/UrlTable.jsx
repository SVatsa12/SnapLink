import { useState } from "react";

const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const LinkEmptyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-slate-600">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Copy short URL"
      className={`copy-btn transition-all ${copied ? "border-emerald-500/50 bg-emerald-500/20 !text-emerald-400" : ""}`}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </button>
  );
};

const ConfirmDelete = ({ onConfirm, onCancel }) => (
  <div className="flex items-center gap-2 animate-fade-in">
    <span className="text-xs text-slate-400">Delete?</span>
    <button
      type="button"
      onClick={onConfirm}
      className="rounded-md bg-rose-500/20 border border-rose-500/30 px-2 py-1 text-xs font-semibold text-rose-400 hover:bg-rose-500/30 transition-all"
    >
      Yes
    </button>
    <button
      type="button"
      onClick={onCancel}
      className="rounded-md bg-slate-800/60 border border-slate-700/50 px-2 py-1 text-xs font-semibold text-slate-400 hover:text-white transition-all"
    >
      No
    </button>
  </div>
);

const UrlTable = ({ links, onDelete }) => {
  const frontendBase = import.meta.env.VITE_REDIRECT_BASE || "http://localhost:5000";
  const [confirmId, setConfirmId] = useState(null);

  const handleDeleteClick = (id) => setConfirmId(id);
  const handleConfirm = (id) => { setConfirmId(null); onDelete(id); };
  const handleCancel = () => setConfirmId(null);

  if (links.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800/60 border-dashed bg-slate-900/30 py-20 text-center">
        <LinkEmptyIcon />
        <h3 className="mt-4 font-display text-lg font-semibold text-slate-400">No links yet</h3>
        <p className="mt-1.5 max-w-xs text-sm text-slate-600">
          Paste a URL above and click "Shorten" to create your first short link.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/50 backdrop-blur-sm shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/60 px-5 py-3.5">
        <h2 className="font-display text-sm font-semibold text-white">
          Your Links{" "}
          <span className="ml-1.5 rounded-full bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-400">
            {links.length}
          </span>
        </h2>
        <p className="text-xs text-slate-500">Click count updates in real-time</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-slate-800/40">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Original URL
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Short URL
              </th>
              <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                Clicks
              </th>
              <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {links.map((link, i) => {
              const shortUrl = `${frontendBase}/${link.shortCode}`;
              return (
                <tr
                  key={link._id}
                  className="group transition-colors duration-150 hover:bg-slate-800/30"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  {/* Original URL */}
                  <td className="max-w-xs px-5 py-4">
                    <p className="truncate text-sm text-slate-400 transition-colors group-hover:text-slate-300">
                      {link.originalUrl}
                    </p>
                  </td>

                  {/* Short URL */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <a
                        href={shortUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-sm font-medium text-cyan-400 transition-colors hover:text-cyan-300"
                      >
                        <span className="truncate max-w-[180px]">{shortUrl}</span>
                        <ExternalLinkIcon />
                      </a>
                      <CopyButton text={shortUrl} />
                    </div>
                  </td>

                  {/* Clicks */}
                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex items-center justify-center rounded-full border border-slate-700/50 bg-slate-800/60 px-3 py-1 text-sm font-semibold text-white min-w-[48px]">
                      {link.clickCount}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center">
                      {confirmId === link._id ? (
                        <ConfirmDelete
                          onConfirm={() => handleConfirm(link._id)}
                          onCancel={handleCancel}
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(link._id)}
                          className="btn-danger flex items-center gap-1.5"
                          title="Delete link"
                        >
                          <TrashIcon />
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UrlTable;

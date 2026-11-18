import { useState } from "react";

export default function UrlTable({ links, onDelete }) {
  const [copied, setCopied] = useState(null);

  const copy = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-3">
      {links.map((l) => (
        <div key={l.id} className="border-2 border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--shadow)]">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <img src={`https://www.google.com/s2/favicons?domain=${new URL(l.originalUrl).hostname}&sz=64`} alt="" className="h-5 w-5" />
                <span className="font-mono font-bold truncate">{l.shortCode}</span>
                <button onClick={() => copy(l.shortCode)} className="border-2 border-[var(--border)] px-2 text-xs font-mono">
                  {copied === l.shortCode ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="truncate text-sm text-[var(--muted)]" title={l.originalUrl}>{l.originalUrl}</div>
            </div>
            <div className="text-right font-mono text-sm">
              <div>{l.clickCount} clicks</div>
              <div className="text-xs text-[var(--muted)]">{new Date(l.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
          <div className="mt-2 flex gap-2">
            <button onClick={() => onDelete(l.id)} className="border-2 border-[var(--border)] px-3 py-1 text-xs font-bold shadow-[var(--shadow)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

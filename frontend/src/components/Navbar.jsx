import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <nav className="border-b-2 border-[var(--border)] bg-[var(--bg)] px-4 py-3 flex items-center justify-between">
      <Link to="/" className="font-mono font-bold text-xl">snap.link</Link>
      <div className="flex items-center gap-4">
        {user && (
          <>
            <Link to="/dashboard" className="font-bold hover:underline">Links</Link>
            <Link to="/analytics" className="font-bold hover:underline">Analytics</Link>
          </>
        )}
        <button onClick={() => setDark(!dark)} className="border-2 border-[var(--border)] px-2 py-1 font-mono text-xs shadow-[var(--shadow)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
          {dark ? "Light" : "Dark"}
        </button>
        {user && (
          <button onClick={() => { logout(); navigate("/login"); }} className="border-2 border-[var(--border)] px-2 py-1 font-mono text-xs shadow-[var(--shadow)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import UrlForm from "../components/UrlForm";
import UrlTable from "../components/UrlTable";

export default function Dashboard() {
  const { user } = useAuth();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLinks = async () => {
    const { data } = await api.get("/url/my-links");
    setLinks(data);
    setLoading(false);
  };

  useEffect(() => { fetchLinks(); }, []);

  const create = async (originalUrl) => {
    await api.post("/url/create", { originalUrl });
    await fetchLinks();
  };

  const remove = async (id) => {
    await api.delete(`/url/${id}`);
    await fetchLinks();
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
            <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-extrabold tracking-tight mb-4">Paste. Snap. Share.</h1>
        <UrlForm onCreated={create} />
        <div className="mt-6">
          {loading ? <div className="animate-pulse h-20 bg-[var(--card)] border-2 border-[var(--border)]" /> : <UrlTable links={links} onDelete={remove} />}
        </div>
      </main>
    </div>
  );
}

import { useState } from "react";
import { Check, Trash2, ExternalLink, Plus, X, Link2 } from "lucide-react";
import { useTheme } from "./ThemeContext";

const platformColors: Record<string, string> = { Codeforces: "#58A6FF", AtCoder: "#7EE787", CSES: "#F2CC60" };

type Problem = { id: number; name: string; platform: string; rating: number; tags: string[]; status: string; tab: "upsolve" | "bookmarks" };

const initialProblems: Problem[] = [
  { id: 1, name: "Minimum Spanning Tree", platform: "Codeforces", rating: 1800, tags: ["Graphs", "Greedy"], status: "pending", tab: "upsolve" },
  { id: 2, name: "Range Query with Update", platform: "AtCoder", rating: 2000, tags: ["Segment Tree", "DS"], status: "solved", tab: "upsolve" },
  { id: 3, name: "DP on DAG", platform: "CSES", rating: 1600, tags: ["DP", "Graphs"], status: "pending", tab: "upsolve" },
  { id: 4, name: "Convex Hull Trick", platform: "Codeforces", rating: 2200, tags: ["Geometry", "DP"], status: "pending", tab: "bookmarks" },
  { id: 5, name: "Suffix Array Construction", platform: "AtCoder", rating: 2100, tags: ["Strings"], status: "solved", tab: "bookmarks" },
  { id: 6, name: "Centroid Decomposition", platform: "Codeforces", rating: 2300, tags: ["Trees", "D&C"], status: "pending", tab: "bookmarks" },
];

export function PracticeScreen() {
  const { c } = useTheme();
  const [activeTab, setActiveTab] = useState<"upsolve" | "bookmarks">("upsolve");
  const [problems, setProblems] = useState<Problem[]>(initialProblems);
  const [showModal, setShowModal] = useState(false);
  const [link, setLink] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const filtered = problems.filter((p) => p.tab === activeTab);

  const detectPlatform = (url: string): string => {
    const u = url.toLowerCase();
    if (u.includes("codeforces")) return "Codeforces";
    if (u.includes("atcoder")) return "AtCoder";
    if (u.includes("cses")) return "CSES";
    return "Codeforces";
  };

  const handleAdd = async () => {
    const url = link.trim();
    if (!url) return;
    setSubmitting(true);
    // TODO: backend will fetch problem name, rating, tags from the link
    const placeholder: Problem = {
      id: Date.now(),
      name: "Fetching problem…",
      platform: detectPlatform(url),
      rating: 0,
      tags: [],
      status: "pending",
      tab: activeTab,
    };
    setProblems([placeholder, ...problems]);
    setLink("");
    setSubmitting(false);
    setShowModal(false);
  };

  const handleDelete = (id: number) => setProblems(problems.filter((p) => p.id !== id));
  const handleToggleStatus = (id: number) =>
    setProblems(problems.map((p) => (p.id === id ? { ...p, status: p.status === "solved" ? "pending" : "solved" } : p)));

  return (
    <div className="px-5 pt-14 pb-4 relative min-h-screen">
      <div className="flex items-start justify-between">
        <div>
          <h1 style={{ color: c.text, fontSize: 22, fontWeight: 700 }}>Practice</h1>
          <p style={{ color: c.textSecondary, fontSize: 13, marginTop: 2 }}>Track your upsolving & bookmarks</p>
        </div>
      </div>

      <div className="flex gap-1 mt-5 p-1 rounded-xl" style={{ background: c.surface }}>
        {(["upsolve", "bookmarks"] as const).map((t) => (
          <button key={t} onClick={() => setActiveTab(t)} className="flex-1 py-2 rounded-lg transition-all capitalize"
            style={{ background: activeTab === t ? c.surfaceHover : "transparent", color: activeTab === t ? c.text : c.textSecondary, fontSize: 13, fontWeight: activeTab === t ? 600 : 400, border: activeTab === t ? `1px solid ${c.borderLight}` : "1px solid transparent" }}>
            {t}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-2xl p-8 text-center" style={{ background: c.surface, border: `1px dashed ${c.border}` }}>
            <p style={{ color: c.textSecondary, fontSize: 13 }}>No problems yet. Tap + to add one.</p>
          </div>
        )}
        {filtered.map((p) => (
          <div key={p.id} className="rounded-2xl p-4" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="truncate" style={{ color: c.text, fontSize: 14, fontWeight: 600 }}>{p.name}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="px-2 py-0.5 rounded-md" style={{ background: `${platformColors[p.platform]}15`, color: platformColors[p.platform], fontSize: 10, fontWeight: 600 }}>{p.platform}</span>
                  <span className="px-2 py-0.5 rounded-md" style={{ background: `${c.textSecondary}12`, color: c.textSecondary, fontSize: 10, fontWeight: 600 }}>{p.rating}</span>
                </div>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {p.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-full" style={{ background: `${c.textSecondary}10`, color: c.textSecondary, fontSize: 10, border: `1px solid ${c.border}` }}>{tag}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.status === "solved" ? "#7EE787" : "#F2CC60" }} />
                <div className="flex gap-1">
                  <button onClick={() => handleToggleStatus(p.id)} className="p-1.5 rounded-lg active:scale-90 transition-all" style={{ background: "rgba(126,231,135,0.1)" }}><Check size={13} color="#7EE787" /></button>
                  <button className="p-1.5 rounded-lg active:scale-90 transition-all" style={{ background: `${c.textSecondary}12` }}><ExternalLink size={13} color={c.textSecondary} /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg active:scale-90 transition-all" style={{ background: "rgba(248,81,73,0.1)" }}><Trash2 size={13} color="#F85149" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activeTab === "bookmarks" && (
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-24 right-1/2 translate-x-[190px] w-12 h-12 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all z-40"
          style={{ background: c.primary, boxShadow: `0 4px 20px ${c.primary}60` }}
          aria-label="Bookmark problem"
        >
          <Plus size={22} color="#fff" />
        </button>
      )}

      {showModal && (
        <div className="fixed inset-0 z-40 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.6)", paddingBottom: 64 }} onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md rounded-t-3xl p-5 pb-6" style={{ background: c.surface, border: `1px solid ${c.border}` }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ color: c.text, fontSize: 18, fontWeight: 700 }}>
                {activeTab === "bookmarks" ? "Bookmark Problem" : "Add to Upsolve"}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg" style={{ background: `${c.textSecondary}12` }}>
                <X size={16} color={c.textSecondary} />
              </button>
            </div>

            <label style={{ color: c.textSecondary, fontSize: 11, fontWeight: 600 }}>PROBLEM LINK</label>
            <div className="flex items-center gap-2 mt-1 px-3 py-2.5 rounded-xl" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
              <Link2 size={15} color={c.textSecondary} />
              <input
                type="url"
                autoFocus
                value={link}
                onChange={(e) => setLink(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                placeholder="https://codeforces.com/problemset/problem/..."
                className="flex-1 bg-transparent outline-none"
                style={{ color: c.text, fontSize: 13 }}
              />
            </div>

            <button
              onClick={handleAdd}
              disabled={!link.trim() || submitting}
              className="w-full py-3 rounded-xl active:scale-[0.98] transition-all mt-4 disabled:opacity-50"
              style={{ background: c.primary, color: "#fff", fontSize: 14, fontWeight: 600 }}
            >
              {submitting ? "Adding…" : "Add Problem"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

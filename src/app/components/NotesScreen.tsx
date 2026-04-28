import { useState } from "react";
import { Search, Plus, ArrowLeft, X } from "lucide-react";
import { useTheme } from "./ThemeContext";

const initialNotes = [
  { id: 1, title: "Segment Tree Template", preview: "Standard segment tree with lazy propagation. Supports range update and range query operations...", date: "Apr 12, 2026", tag: "Data Structures",
    content: `# Segment Tree with Lazy Propagation\n\n## Build\nvoid build(int node, int start, int end) {\n  if (start == end) {\n    tree[node] = arr[start];\n  } else {\n    int mid = (start + end) / 2;\n    build(2*node, start, mid);\n    build(2*node+1, mid+1, end);\n    tree[node] = tree[2*node] + tree[2*node+1];\n  }\n}\n\n## Key Points\n- Time: O(n log n) build, O(log n) query/update\n- Space: O(4n)\n- Lazy propagation for range updates` },
  { id: 2, title: "Binary Search Patterns", preview: "Common binary search patterns: lower_bound, upper_bound, answer on real numbers...", date: "Apr 10, 2026", tag: "Algorithms",
    content: `# Binary Search Patterns\n\n## Standard Lower Bound\nFind the first element >= target.\n\n## Fractional Binary Search\nUsed when the answer is a real number. Set eps = 1e-9.\n\n## Binary Search on Answer\nWhen you need to find min/max value satisfying a condition.` },
  { id: 3, title: "Graph Algorithms Cheatsheet", preview: "Quick reference for BFS, DFS, Dijkstra, Bellman-Ford, Floyd-Warshall and more...", date: "Apr 8, 2026", tag: "Graphs",
    content: `# Graph Algorithms\n\n## BFS - O(V+E)\nShortest path in unweighted graphs.\n\n## Dijkstra - O((V+E) log V)\nShortest path with non-negative weights.\n\n## Bellman-Ford - O(VE)\nHandles negative weights, detects negative cycles.` },
  { id: 4, title: "DP Optimization Tricks", preview: "Knuth's optimization, Divide and Conquer DP, Convex Hull Trick for advanced problems...", date: "Apr 5, 2026", tag: "DP",
    content: `# DP Optimization Techniques\n\n## Knuth's Optimization\nApplicable when C[a][c] + C[b][d] <= C[a][d] + C[b][c].\nReduces O(n^3) to O(n^2).\n\n## Convex Hull Trick\nWhen recurrence has form dp[i] = min(dp[j] + b[j]*a[i]).` },
];

export function NotesScreen() {
  const { c } = useTheme();
  const [search, setSearch] = useState("");
  const [activeNote, setActiveNote] = useState<typeof initialNotes[0] | null>(null);
  const filtered = initialNotes.filter((n) => n.title.toLowerCase().includes(search.toLowerCase()) || n.preview.toLowerCase().includes(search.toLowerCase()));

  if (activeNote) {
    return (
      <div className="px-5 pt-14 pb-4">
        <button onClick={() => setActiveNote(null)} className="flex items-center gap-1.5 mb-5 active:scale-95 transition-all" style={{ color: c.primary, fontSize: 13, fontWeight: 500 }}>
          <ArrowLeft size={16} /> Back
        </button>
        <h1 style={{ color: c.text, fontSize: 22, fontWeight: 700 }}>{activeNote.title}</h1>
        <div className="flex items-center gap-2 mt-2">
          <span className="px-2 py-0.5 rounded-md" style={{ background: `${c.primary}15`, color: c.primary, fontSize: 10, fontWeight: 600 }}>{activeNote.tag}</span>
          <span style={{ color: c.textSecondary, fontSize: 11 }}>{activeNote.date}</span>
        </div>
        <div className="mt-6 whitespace-pre-wrap" style={{ color: c.textSecondary, fontSize: 14, lineHeight: 1.8 }}>{activeNote.content}</div>
      </div>
    );
  }

  return (
    <div className="px-5 pt-14 pb-4">
      <h1 style={{ color: c.text, fontSize: 22, fontWeight: 700 }}>Notes</h1>
      <p style={{ color: c.textSecondary, fontSize: 13, marginTop: 2 }}>Your competitive programming notes</p>

      <div className="flex items-center gap-2 mt-5 px-4 py-2.5 rounded-xl" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
        <Search size={16} color={c.textSecondary} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search notes..." className="flex-1 bg-transparent outline-none" style={{ color: c.text, fontSize: 13 }} />
        {search && <button onClick={() => setSearch("")}><X size={14} color={c.textSecondary} /></button>}
      </div>

      <div className="mt-4 space-y-3">
        {filtered.map((n) => (
          <button key={n.id} onClick={() => setActiveNote(n)} className="w-full text-left rounded-2xl p-4 active:scale-[0.98] transition-all" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-md" style={{ background: `${c.primary}15`, color: c.primary, fontSize: 10, fontWeight: 600 }}>{n.tag}</span>
              <span style={{ color: c.textSecondary, fontSize: 10, marginLeft: "auto" }}>{n.date}</span>
            </div>
            <p style={{ color: c.text, fontSize: 14, fontWeight: 600, marginTop: 4 }}>{n.title}</p>
            <p className="mt-1 line-clamp-2" style={{ color: c.textSecondary, fontSize: 12, lineHeight: 1.5 }}>{n.preview}</p>
          </button>
        ))}
      </div>

      <button className="fixed bottom-24 right-1/2 translate-x-[190px] w-12 h-12 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all z-40" style={{ background: c.primary, boxShadow: `0 4px 20px ${c.primary}60` }}>
        <Plus size={22} color="#fff" />
      </button>
    </div>
  );
}

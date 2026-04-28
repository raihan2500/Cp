import { useState } from "react";
import { CheckCircle2, Github, Globe, Code2, UserPlus, X, ArrowUpDown, Check } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useTheme } from "./ThemeContext";

const comparisonData = [
  { topic: "DP", you: 85, friend: 72 }, { topic: "Graphs", you: 78, friend: 90 },
  { topic: "Math", you: 65, friend: 58 }, { topic: "Strings", you: 70, friend: 80 },
  { topic: "Trees", you: 90, friend: 75 },
];

type Platform = "codeforces" | "codechef" | "atcoder" | "leetcode";
type Friend = {
  name: string;
  delta: string;
  isYou?: boolean;
  ratings: Record<Platform, number>;
};

const initialFriends: Friend[] = [
  { name: "Sarah K.", delta: "+45", ratings: { codeforces: 1820, codechef: 1950, atcoder: 1600, leetcode: 2100 } },
  { name: "Alex C.", delta: "+80", isYou: true, ratings: { codeforces: 1560, codechef: 1700, atcoder: 1400, leetcode: 1950 } },
  { name: "Mike R.", delta: "+20", ratings: { codeforces: 1490, codechef: 1550, atcoder: 1380, leetcode: 1720 } },
  { name: "Priya S.", delta: "-10", ratings: { codeforces: 1450, codechef: 1800, atcoder: 1500, leetcode: 1880 } },
  { name: "John D.", delta: "+35", ratings: { codeforces: 1380, codechef: 1420, atcoder: 1250, leetcode: 1600 } },
];

const platformOptions: { key: Platform; label: string }[] = [
  { key: "codeforces", label: "Codeforces" },
  { key: "codechef", label: "CodeChef" },
  { key: "atcoder", label: "AtCoder" },
  { key: "leetcode", label: "LeetCode" },
];

const platformsList = [
  { name: "Codeforces", handle: "alex_chen", icon: Code2, color: "#58A6FF" },
  { name: "AtCoder", handle: "alexc", icon: Globe, color: "#7EE787" },
  { name: "GitHub", handle: "alexchen-dev", icon: Github, color: "#8B949E" },
];

const emptyForm = { name: "", codeforces: "", codechef: "", atcoder: "", leetcode: "" };

export function ProfileScreen() {
  const { c } = useTheme();
  const [friends, setFriends] = useState<Friend[]>(initialFriends);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [showSort, setShowSort] = useState(false);
  const [sortPlatform, setSortPlatform] = useState<Platform>("codeforces");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");

  const handleAdd = () => {
    if (!form.name.trim()) return;
    const newFriend: Friend = {
      name: form.name.trim(),
      delta: "+0",
      ratings: { codeforces: 0, codechef: 0, atcoder: 0, leetcode: 0 },
    };
    setFriends([...friends, newFriend]);
    setForm(emptyForm);
    setShowModal(false);
  };

  const sortedFriends = [...friends].sort((a, b) => {
    const diff = a.ratings[sortPlatform] - b.ratings[sortPlatform];
    return sortDir === "desc" ? -diff : diff;
  });

  const fields: { key: keyof typeof emptyForm; label: string; placeholder: string }[] = [
    { key: "name", label: "NAME", placeholder: "Jane Doe" },
    { key: "codeforces", label: "CODEFORCES HANDLE", placeholder: "jane_cf" },
    { key: "codechef", label: "CODECHEF HANDLE", placeholder: "jane_cc" },
    { key: "atcoder", label: "ATCODER HANDLE", placeholder: "jane_ac" },
    { key: "leetcode", label: "LEETCODE HANDLE", placeholder: "jane_lc" },
  ];

  return (
    <div className="px-5 pt-14 pb-4 space-y-5">
      <div className="rounded-2xl p-5 text-center relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${c.primary}15 0%, ${c.green}08 100%)`, border: `1px solid ${c.primary}20` }}>
        <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${c.primary}, ${c.green})`, fontSize: 24, fontWeight: 700, color: "#0D1117" }}>AC</div>
        <h2 className="mt-3" style={{ color: c.text, fontSize: 20, fontWeight: 700 }}>Alex Chen</h2>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="px-2.5 py-0.5 rounded-full" style={{ background: `${c.primary}18`, color: c.primary, fontSize: 11, fontWeight: 600 }}>Expert · 1560</span>
          <CheckCircle2 size={14} color={c.green} />
        </div>
      </div>

      <div className="rounded-2xl p-4" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
        <span style={{ color: c.text, fontSize: 14, fontWeight: 600 }}>Connected Platforms</span>
        <div className="mt-3 space-y-2.5">
          {platformsList.map((p) => (
            <div key={p.name} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${p.color}15` }}><p.icon size={16} color={p.color} /></div>
              <div>
                <p style={{ color: c.text, fontSize: 13, fontWeight: 500 }}>{p.name}</p>
                <p style={{ color: c.textSecondary, fontSize: 11 }}>@{p.handle}</p>
              </div>
              <CheckCircle2 size={14} color={c.green} className="ml-auto" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[{ label: "Rating", value: "1560", color: c.primary }, { label: "Solved", value: "342", color: c.green }, { label: "Streak", value: "12d", color: c.yellow }].map((s) => (
          <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
            <p style={{ color: s.color, fontSize: 20, fontWeight: 700 }}>{s.value}</p>
            <p style={{ color: c.textSecondary, fontSize: 11 }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-4" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
        <div className="flex items-center justify-between">
          <span style={{ color: c.text, fontSize: 14, fontWeight: 600 }}>Friends Leaderboard</span>
          <div className="flex items-center gap-2 relative">
            <button
              onClick={() => setShowSort((s) => !s)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg active:scale-95 transition-all"
              style={{ background: `${c.textSecondary}15`, color: c.text, fontSize: 11, fontWeight: 600, border: `1px solid ${c.border}` }}
            >
              <ArrowUpDown size={13} />
              Sort
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg active:scale-95 transition-all"
              style={{ background: `${c.primary}18`, color: c.primary, fontSize: 11, fontWeight: 600, border: `1px solid ${c.primary}30` }}
            >
              <UserPlus size={13} />
              Add Friend
            </button>
            {showSort && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowSort(false)} />
                <div
                  className="absolute right-0 top-9 w-56 rounded-xl p-2 z-40"
                  style={{ background: c.surface, border: `1px solid ${c.borderLight}`, boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}
                >
                  <p className="px-2 py-1" style={{ color: c.textSecondary, fontSize: 10, fontWeight: 600, letterSpacing: 1 }}>PLATFORM</p>
                  {platformOptions.map((p) => (
                    <button
                      key={p.key}
                      onClick={() => setSortPlatform(p.key)}
                      className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg"
                      style={{ background: sortPlatform === p.key ? `${c.primary}15` : "transparent", color: sortPlatform === p.key ? c.primary : c.text, fontSize: 12 }}
                    >
                      {p.label}
                      {sortPlatform === p.key && <Check size={13} />}
                    </button>
                  ))}
                  <div className="h-px my-1.5" style={{ background: c.border }} />
                  <p className="px-2 py-1" style={{ color: c.textSecondary, fontSize: 10, fontWeight: 600, letterSpacing: 1 }}>ORDER</p>
                  {(["desc", "asc"] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setSortDir(d)}
                      className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg"
                      style={{ background: sortDir === d ? `${c.primary}15` : "transparent", color: sortDir === d ? c.primary : c.text, fontSize: 12 }}
                    >
                      {d === "desc" ? "Highest first" : "Lowest first"}
                      {sortDir === d && <Check size={13} />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="mt-3 space-y-1.5">
          {sortedFriends.map((f, idx) => {
            const rank = idx + 1;
            return (
              <div key={f.name} className="flex items-center gap-3 rounded-xl px-3 py-2.5" style={{ background: f.isYou ? `${c.primary}10` : "transparent", border: f.isYou ? `1px solid ${c.primary}20` : "1px solid transparent" }}>
                <span style={{ color: rank <= 3 ? c.yellow : c.textSecondary, fontSize: 13, fontWeight: 700, width: 20, textAlign: "center" }}>{rank}</span>
                <div className="flex-1">
                  <span style={{ color: c.text, fontSize: 13, fontWeight: 500 }}>{f.name}{f.isYou && <span style={{ color: c.primary, fontSize: 10, marginLeft: 6 }}>YOU</span>}</span>
                </div>
                <span style={{ color: c.text, fontSize: 13, fontWeight: 600 }}>{f.ratings[sortPlatform]}</span>
                <span style={{ color: f.delta.startsWith("+") ? c.green : c.red, fontSize: 11, fontWeight: 500, width: 32, textAlign: "right" }}>{f.delta}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl p-4" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
        <div className="flex items-center justify-between mb-3">
          <span style={{ color: c.text, fontSize: 14, fontWeight: 600 }}>vs Sarah K.</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ background: c.primary }} /><span style={{ color: c.textSecondary, fontSize: 10 }}>You</span></div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ background: c.green }} /><span style={{ color: c.textSecondary, fontSize: 10 }}>Sarah</span></div>
          </div>
        </div>
        <div style={{ width: "100%", minWidth: 200, height: 160 }}>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={comparisonData} barGap={2}>
              <XAxis dataKey="topic" tick={{ fill: c.textSecondary, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: c.tooltipBg, border: `1px solid ${c.borderLight}`, borderRadius: 8, fontSize: 12, color: c.text }} />
              <Bar dataKey="you" fill={c.primary} radius={[4, 4, 0, 0]} barSize={14} isAnimationActive={false} />
              <Bar dataKey="friend" fill={c.green} radius={[4, 4, 0, 0]} barSize={14} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-40 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.6)", paddingBottom: 64 }} onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md rounded-t-3xl p-5 pb-6 overflow-y-auto" style={{ background: c.surface, border: `1px solid ${c.border}`, maxHeight: "calc(100vh - 120px)" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ color: c.text, fontSize: 18, fontWeight: 700 }}>Add Friend</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg" style={{ background: `${c.textSecondary}12` }}>
                <X size={16} color={c.textSecondary} />
              </button>
            </div>

            <div className="space-y-3">
              {fields.map((f) => (
                <div key={f.key}>
                  <label style={{ color: c.textSecondary, fontSize: 11, fontWeight: 600 }}>{f.label}</label>
                  <input
                    type="text"
                    value={form[f.key]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    className="w-full mt-1 px-3 py-2.5 rounded-lg outline-none"
                    style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}`, fontSize: 13 }}
                  />
                </div>
              ))}

              <button
                onClick={handleAdd}
                disabled={!form.name.trim()}
                className="w-full py-3 rounded-xl active:scale-[0.98] transition-all mt-2 disabled:opacity-50"
                style={{ background: c.primary, color: "#fff", fontSize: 14, fontWeight: 600 }}
              >
                Add Friend
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

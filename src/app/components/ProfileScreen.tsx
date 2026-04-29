import { useState } from "react";
import { CheckCircle2, Github, Globe, Code2, UserPlus, X, ArrowUpDown, Check, MapPin, Building2, Calendar, Award, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useTheme } from "./ThemeContext";
import { useUserInfo } from "./UserInfo";

const rankColor = (rank?: string): string => {
  if (!rank) return "#808080";
  const r = rank.toLowerCase();
  if (r.includes("legendary")) return "#FF0000";
  if (r.includes("international grandmaster")) return "#FF0000";
  if (r.includes("grandmaster")) return "#FF0000";
  if (r.includes("international master")) return "#FF8C00";
  if (r.includes("master")) return "#FF8C00";
  if (r.includes("candidate")) return "#AA00AA";
  if (r.includes("expert")) return "#0000FF";
  if (r.includes("specialist")) return "#03A89E";
  if (r.includes("pupil")) return "#008000";
  return "#808080";
};

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
  { name: "Benq", delta: "+0", ratings: { codeforces: 3792, codechef: 0, atcoder: 0, leetcode: 0 } },
  { name: "VivaciousAubergine", delta: "+0", ratings: { codeforces: 3647, codechef: 0, atcoder: 0, leetcode: 0 } },
  { name: "Kevin114514", delta: "+0", ratings: { codeforces: 3603, codechef: 0, atcoder: 0, leetcode: 0 } },
  { name: "jiangly", delta: "+0", ratings: { codeforces: 3583, codechef: 0, atcoder: 0, leetcode: 0 } },
  { name: "strapple", delta: "+0", ratings: { codeforces: 3515, codechef: 0, atcoder: 0, leetcode: 0 } },
  { name: "tourist", delta: "+0", isYou: true, ratings: { codeforces: 3470, codechef: 0, atcoder: 0, leetcode: 0 } },
  { name: "dXqwq", delta: "+0", ratings: { codeforces: 3436, codechef: 0, atcoder: 0, leetcode: 0 } },
  { name: "Radewoosh", delta: "+0", ratings: { codeforces: 3415, codechef: 0, atcoder: 0, leetcode: 0 } },
  { name: "Otomachi_Una", delta: "+0", ratings: { codeforces: 3413, codechef: 0, atcoder: 0, leetcode: 0 } },
  { name: "Um_nik", delta: "+0", ratings: { codeforces: 3400, codechef: 0, atcoder: 0, leetcode: 0 } },
];

const platformOptions: { key: Platform; label: string }[] = [
  { key: "codeforces", label: "Codeforces" },
  { key: "codechef", label: "CodeChef" },
  { key: "atcoder", label: "AtCoder" },
  { key: "leetcode", label: "LeetCode" },
];

const platformsList = [
  { name: "AtCoder", handle: "tourist", icon: Globe, color: "#7EE787" },
  { name: "GitHub", handle: "tourist", icon: Github, color: "#8B949E" },
];

const emptyForm = { name: "", codeforces: "", codechef: "", atcoder: "", leetcode: "" };

export function ProfileScreen() {
  const { c } = useTheme();
  const { handle: HANDLE, displayName: fullName, cfUser, cfStatus, contestCount } = useUserInfo();
  const rank = cfUser?.rank ?? "legendary grandmaster";
  const maxRank = cfUser?.maxRank ?? rank;
  const rColor = rankColor(rank);
  const mColor = rankColor(maxRank);
  const avatar = cfUser?.titlePhoto || cfUser?.avatar;
  const registered = cfUser?.registrationTimeSeconds
    ? new Date(cfUser.registrationTimeSeconds * 1000).toLocaleDateString(undefined, { year: "numeric", month: "short" })
    : null;

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
      <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background: c.surface, border: `1px solid ${rColor}30` }}>
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${rColor}25, transparent 70%)`, transform: "translate(35%, -35%)" }} />
        <div className="flex items-center gap-4">
          {avatar ? (
            <img src={avatar} alt={HANDLE} className="w-20 h-20 rounded-2xl object-cover" style={{ border: `2px solid ${rColor}` }} />
          ) : (
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${rColor}, ${rColor}99)`, color: "#fff", fontSize: 28, fontWeight: 700 }}>
              {fullName.split(" ").map((s) => s[0]).slice(0, 2).join("")}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p style={{ color: rColor, fontSize: 11, fontWeight: 700, textTransform: "capitalize", letterSpacing: 0.3 }}>{rank}</p>
            <h2 className="truncate" style={{ color: rColor, fontSize: 18, fontWeight: 800, marginTop: 1 }}>{fullName}</h2>
            <p style={{ color: c.textSecondary, fontSize: 12, marginTop: 2 }}>@{HANDLE}</p>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span style={{ color: rColor, fontSize: 22, fontWeight: 800, lineHeight: 1 }}>{cfUser?.rating ?? "—"}</span>
              <span style={{ color: c.textSecondary, fontSize: 11 }}>
                (max. <span style={{ color: mColor, fontWeight: 600, textTransform: "capitalize" }}>{maxRank}</span>, {cfUser?.maxRating ?? "—"})
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4" style={{ color: c.textSecondary, fontSize: 11 }}>
          {cfUser?.country && (
            <span className="flex items-center gap-1"><MapPin size={11} />{cfUser.city ? `${cfUser.city}, ` : ""}{cfUser.country}</span>
          )}
          {cfUser?.organization && (
            <span className="flex items-center gap-1"><Building2 size={11} />{cfUser.organization}</span>
          )}
          {registered && (
            <span className="flex items-center gap-1"><Calendar size={11} />Joined {registered}</span>
          )}
          {typeof cfUser?.contribution === "number" && (
            <span className="flex items-center gap-1"><Award size={11} color={cfUser.contribution >= 0 ? c.green : c.red} />Contrib {cfUser.contribution >= 0 ? "+" : ""}{cfUser.contribution}</span>
          )}
          {typeof cfUser?.friendOfCount === "number" && (
            <span className="flex items-center gap-1"><Users size={11} />{cfUser.friendOfCount.toLocaleString()} friends</span>
          )}
        </div>
      </div>

      <div className="rounded-2xl p-4" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
        <span style={{ color: c.text, fontSize: 14, fontWeight: 600 }}>Connected Platforms</span>
        <div className="mt-3 space-y-2.5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#58A6FF15" }}>
              <Code2 size={16} color="#58A6FF" />
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ color: c.text, fontSize: 13, fontWeight: 500 }}>Codeforces</p>
              <p className="truncate" style={{ color: c.textSecondary, fontSize: 11 }}>
                @{HANDLE} · <span style={{ color: rColor, fontWeight: 600 }}>{cfUser?.rating ?? "—"}</span>
              </p>
            </div>
            <CheckCircle2 size={14} color={c.green} />
          </div>
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

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Rating", value: cfUser?.rating ?? "—", color: rColor },
          { label: "Max Rating", value: cfUser?.maxRating ?? "—", color: mColor },
          { label: "Solved", value: cfStatus.loading ? "…" : cfStatus.solved, color: c.green },
          { label: "Contests", value: contestCount ?? "…", color: c.primary },
          { label: "Streak", value: cfStatus.loading ? "…" : `${cfStatus.streak}d`, color: c.yellow },
          { label: "Upsolve", value: cfStatus.loading ? "…" : cfStatus.upsolve, color: c.orange },
        ].map((s) => (
          <div key={s.label} className="rounded-xl p-3" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
            <p style={{ color: c.textSecondary, fontSize: 11 }}>{s.label}</p>
            <p style={{ color: s.color, fontSize: 20, fontWeight: 700, marginTop: 2 }}>{s.value}</p>
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

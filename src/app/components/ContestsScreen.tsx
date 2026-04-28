import { useState } from "react";
import { Bell, BellOff, Clock, Calendar } from "lucide-react";
import { useTheme } from "./ThemeContext";

const platforms = ["All", "Codeforces", "AtCoder", "CodeChef"];
const platformColors: Record<string, string> = { Codeforces: "#58A6FF", AtCoder: "#7EE787", CodeChef: "#F2CC60" };

const contests = [
  { id: 1, name: "Codeforces Round #945", platform: "Codeforces", date: "Apr 15, 2026", duration: "2h 30m", countdown: "1d 2h" },
  { id: 2, name: "AtCoder Beginner Contest 380", platform: "AtCoder", date: "Apr 16, 2026", duration: "1h 40m", countdown: "2d 5h" },
  { id: 3, name: "CodeChef Starters 180", platform: "CodeChef", date: "Apr 17, 2026", duration: "3h", countdown: "3d 1h" },
  { id: 4, name: "Codeforces Educational #170", platform: "Codeforces", date: "Apr 19, 2026", duration: "2h", countdown: "5d 3h" },
  { id: 5, name: "AtCoder Regular Contest 185", platform: "AtCoder", date: "Apr 20, 2026", duration: "2h", countdown: "6d 0h" },
];

const calendarDays = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(2026, 3, 14 + i);
  return { day: d.toLocaleDateString("en", { weekday: "short" }), date: d.getDate(), hasContest: [15, 16, 17, 19, 20].includes(d.getDate()) };
});

export function ContestsScreen() {
  const { c } = useTheme();
  const [activePlatform, setActivePlatform] = useState("All");
  const [reminders, setReminders] = useState<Set<number>>(new Set([1]));
  const filtered = activePlatform === "All" ? contests : contests.filter((x) => x.platform === activePlatform);
  const toggleReminder = (id: number) => {
    setReminders((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };

  return (
    <div className="px-5 pt-14 pb-4">
      <h1 style={{ color: c.text, fontSize: 22, fontWeight: 700 }}>Contests</h1>
      <p style={{ color: c.textSecondary, fontSize: 13, marginTop: 2 }}>Upcoming competitive programming contests</p>

      <div className="flex gap-2 mt-5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {calendarDays.map((d, i) => (
          <div key={i} className="flex flex-col items-center flex-shrink-0 rounded-xl px-3 py-2 min-w-[46px]"
            style={{ background: i === 1 ? `${c.primary}20` : c.surface, border: i === 1 ? `1px solid ${c.primary}40` : `1px solid ${c.border}` }}>
            <span style={{ color: c.textSecondary, fontSize: 10 }}>{d.day}</span>
            <span style={{ color: i === 1 ? c.primary : c.text, fontSize: 16, fontWeight: 600, marginTop: 2 }}>{d.date}</span>
            {d.hasContest && <div className="w-1 h-1 rounded-full mt-1" style={{ background: c.green }} />}
          </div>
        ))}
      </div>

      <div className="flex gap-1 mt-5 p-1 rounded-xl overflow-x-auto" style={{ background: c.surface, scrollbarWidth: "none" }}>
        {platforms.map((p) => (
          <button key={p} onClick={() => setActivePlatform(p)} className="px-3 py-1.5 rounded-lg transition-all whitespace-nowrap flex-shrink-0"
            style={{ background: activePlatform === p ? c.surfaceHover : "transparent", color: activePlatform === p ? c.text : c.textSecondary, fontSize: 12, fontWeight: activePlatform === p ? 600 : 400, border: activePlatform === p ? `1px solid ${c.borderLight}` : "1px solid transparent" }}>
            {p}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {filtered.map((x) => (
          <div key={x.id} className="rounded-2xl p-4" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded-md" style={{ background: `${platformColors[x.platform]}15`, color: platformColors[x.platform], fontSize: 10, fontWeight: 600 }}>{x.platform}</span>
                </div>
                <p className="truncate" style={{ color: c.text, fontSize: 14, fontWeight: 600 }}>{x.name}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1"><Calendar size={11} color={c.textSecondary} /><span style={{ color: c.textSecondary, fontSize: 11 }}>{x.date}</span></div>
                  <div className="flex items-center gap-1"><Clock size={11} color={c.textSecondary} /><span style={{ color: c.textSecondary, fontSize: 11 }}>{x.duration}</span></div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="px-2 py-0.5 rounded-md" style={{ background: `${c.primary}15`, color: c.primary, fontSize: 11, fontWeight: 600 }}>{x.countdown}</span>
                <button onClick={() => toggleReminder(x.id)} className="p-1.5 rounded-lg transition-all active:scale-90" style={{ background: reminders.has(x.id) ? `${c.green}18` : `${c.textSecondary}15` }}>
                  {reminders.has(x.id) ? <Bell size={14} color={c.green} /> : <BellOff size={14} color={c.textSecondary} />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

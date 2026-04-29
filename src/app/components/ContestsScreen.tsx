import { useMemo, useState } from "react";
import { Bell, BellOff, Clock, Calendar, ExternalLink } from "lucide-react";
import { useTheme } from "./ThemeContext";
import { useClistContests, platformFromHost, formatDuration, formatCountdown } from "./useClistContests";

const platforms = ["All", "Codeforces", "AtCoder", "CodeChef", "LeetCode"];
const platformColors: Record<string, string> = {
  Codeforces: "#58A6FF",
  AtCoder: "#7EE787",
  CodeChef: "#F2CC60",
  LeetCode: "#FFA116",
};

export function ContestsScreen() {
  const { c } = useTheme();
  const [activePlatform, setActivePlatform] = useState("All");
  const [reminders, setReminders] = useState<Set<number>>(new Set());
  const { contests, loading, error } = useClistContests(50);

  const enriched = useMemo(
    () =>
      (contests ?? []).map((x) => ({
        ...x,
        platform: platformFromHost(x.host),
        startDate: new Date(x.start + "Z"),
      })),
    [contests],
  );

  const filtered = activePlatform === "All"
    ? enriched
    : enriched.filter((x) => x.platform === activePlatform);

  const calendarDays = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const set = new Set(enriched.map((x) => {
      const d = new Date(x.startDate);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    }));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return {
        day: d.toLocaleDateString("en", { weekday: "short" }),
        date: d.getDate(),
        hasContest: set.has(d.getTime()),
        isToday: i === 0,
      };
    });
  }, [enriched]);

  const toggleReminder = (id: number) => {
    setReminders((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="px-5 pt-14 pb-4">
      <h1 style={{ color: c.text, fontSize: 22, fontWeight: 700 }}>Contests</h1>
      <p style={{ color: c.textSecondary, fontSize: 13, marginTop: 2 }}>Upcoming competitive programming contests</p>

      <div className="flex gap-2 mt-5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {calendarDays.map((d, i) => (
          <div key={i} className="flex flex-col items-center flex-shrink-0 rounded-xl px-3 py-2 min-w-[46px]"
            style={{ background: d.isToday ? `${c.primary}20` : c.surface, border: d.isToday ? `1px solid ${c.primary}40` : `1px solid ${c.border}` }}>
            <span style={{ color: c.textSecondary, fontSize: 10 }}>{d.day}</span>
            <span style={{ color: d.isToday ? c.primary : c.text, fontSize: 16, fontWeight: 600, marginTop: 2 }}>{d.date}</span>
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

      {loading && (
        <p className="mt-6" style={{ color: c.textSecondary, fontSize: 13 }}>Loading contests from clist.by…</p>
      )}
      {error && (
        <p className="mt-6" style={{ color: c.red, fontSize: 13 }}>Failed to load: {error}</p>
      )}

      <div className="mt-4 space-y-3">
        {filtered.map((x) => {
          const color = platformColors[x.platform] ?? c.primary;
          const dateStr = x.startDate.toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
          return (
            <div key={x.id} className="rounded-2xl p-4" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded-md" style={{ background: `${color}15`, color, fontSize: 10, fontWeight: 600 }}>{x.platform}</span>
                  </div>
                  <p className="truncate" style={{ color: c.text, fontSize: 14, fontWeight: 600 }}>{x.event}</p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <div className="flex items-center gap-1"><Calendar size={11} color={c.textSecondary} /><span style={{ color: c.textSecondary, fontSize: 11 }}>{dateStr}</span></div>
                    <div className="flex items-center gap-1"><Clock size={11} color={c.textSecondary} /><span style={{ color: c.textSecondary, fontSize: 11 }}>{formatDuration(x.duration)}</span></div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="px-2 py-0.5 rounded-md" style={{ background: `${c.primary}15`, color: c.primary, fontSize: 11, fontWeight: 600 }}>{formatCountdown(x.startDate)}</span>
                  <div className="flex gap-1">
                    <a href={x.href} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg active:scale-90 transition-all" style={{ background: `${c.textSecondary}15` }}>
                      <ExternalLink size={13} color={c.textSecondary} />
                    </a>
                    <button onClick={() => toggleReminder(x.id)} className="p-1.5 rounded-lg transition-all active:scale-90" style={{ background: reminders.has(x.id) ? `${c.green}18` : `${c.textSecondary}15` }}>
                      {reminders.has(x.id) ? <Bell size={14} color={c.green} /> : <BellOff size={14} color={c.textSecondary} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {!loading && !error && filtered.length === 0 && (
          <p style={{ color: c.textSecondary, fontSize: 13, textAlign: "center", padding: 24 }}>No upcoming contests for this platform.</p>
        )}
      </div>
    </div>
  );
}

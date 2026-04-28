import { useState } from "react";
import {
  TrendingUp, Zap, Flame, RotateCcw, Bell,
  CheckCircle2, XCircle, Clock, ArrowUp,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useTheme } from "./ThemeContext";

const ratingData = [
  { date: "Jan", rating: 1200 }, { date: "Feb", rating: 1280 },
  { date: "Mar", rating: 1350 }, { date: "Apr", rating: 1310 },
  { date: "May", rating: 1420 }, { date: "Jun", rating: 1510 },
  { date: "Jul", rating: 1480 }, { date: "Aug", rating: 1560 },
];

const recentActivity = [
  { name: "Two Sum", status: "accepted", platform: "LeetCode", time: "2h ago" },
  { name: "Segment Tree", status: "attempted", platform: "Codeforces", time: "5h ago" },
  { name: "DP on Trees", status: "accepted", platform: "AtCoder", time: "1d ago" },
  { name: "FFT Problems", status: "pending", platform: "CSES", time: "2d ago" },
];

const statusConfig: Record<string, { icon: typeof CheckCircle2; color: string }> = {
  accepted: { icon: CheckCircle2, color: "#7EE787" },
  attempted: { icon: XCircle, color: "#F85149" },
  pending: { icon: Clock, color: "#F2CC60" },
};

function generateHeatmap() {
  const weeks = 15;
  const data: number[][] = [];
  for (let w = 0; w < weeks; w++) {
    const week: number[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(Math.random() > 0.35 ? Math.floor(Math.random() * 4) + 1 : 0);
    }
    data.push(week);
  }
  return data;
}

const heatmapData = generateHeatmap();
const darkHeatColors = ["#161B22", "#0e4429", "#006d32", "#26a641", "#39d353"];
const lightHeatColors = ["#EBEDF0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];

const cfRanks = [
  { min: 0, max: 1199, title: "Newbie", color: "#808080" },
  { min: 1200, max: 1399, title: "Pupil", color: "#008000" },
  { min: 1400, max: 1599, title: "Specialist", color: "#03A89E" },
  { min: 1600, max: 1899, title: "Expert", color: "#0000FF" },
  { min: 1900, max: 2099, title: "Candidate Master", color: "#AA00AA" },
  { min: 2100, max: 2299, title: "Master", color: "#FF8C00" },
  { min: 2300, max: 2399, title: "International Master", color: "#FF8C00" },
  { min: 2400, max: 2599, title: "Grandmaster", color: "#FF0000" },
  { min: 2600, max: 2999, title: "Intl. Grandmaster", color: "#FF0000" },
  { min: 3000, max: 9999, title: "Legendary GM", color: "#FF0000" },
];

function getCfRank(rating: number) {
  return cfRanks.find((r) => rating >= r.min && rating <= r.max) || cfRanks[0];
}

const userRating = 1560;
const currentRank = getCfRank(userRating);
const nextRank = cfRanks[cfRanks.indexOf(currentRank) + 1];
const progressInTier = nextRank
  ? ((userRating - currentRank.min) / (nextRank.min - currentRank.min)) * 100
  : 100;

export function HomeScreen() {
  const { theme, c } = useTheme();
  const [reminderSet, setReminderSet] = useState(false);
  const heatColors = theme === "dark" ? darkHeatColors : lightHeatColors;

  return (
    <div className="px-5 pt-14 pb-4 space-y-5">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <p style={{ color: c.textSecondary, fontSize: 13 }}>Good evening</p>
          <h1 style={{ color: c.text, fontSize: 22, fontWeight: 700 }}>Alex Chen</h1>
        </div>
        <div
          className="px-3 py-1.5 rounded-full flex items-center gap-2"
          style={{ background: `${currentRank.color}18`, border: `1px solid ${currentRank.color}40` }}
        >
          <div className="w-2 h-2 rounded-full" style={{ background: currentRank.color, boxShadow: `0 0 6px ${currentRank.color}80` }} />
          <span style={{ color: currentRank.color, fontSize: 12, fontWeight: 600 }}>{currentRank.title}</span>
        </div>
      </div>

      {/* CF-style Rating Card */}
      <div
        className="rounded-2xl p-4 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${currentRank.color}15, ${currentRank.color}08)`,
          border: `1px solid ${currentRank.color}30`,
        }}
      >
        <div className="absolute top-0 right-0 w-24 h-24 rounded-full" style={{
          background: `radial-gradient(circle, ${currentRank.color}12, transparent 70%)`,
          transform: "translate(30%, -30%)",
        }} />
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} color={currentRank.color} />
            <span style={{ color: c.textSecondary, fontSize: 12, fontWeight: 500 }}>Codeforces Rating</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md" style={{ background: `${c.green}18` }}>
            <ArrowUp size={10} color={c.green} />
            <span style={{ color: c.green, fontSize: 11, fontWeight: 600 }}>+80</span>
          </div>
        </div>
        <div className="flex items-end gap-3">
          <span style={{ color: currentRank.color, fontSize: 36, fontWeight: 700, lineHeight: 1, textShadow: `0 0 20px ${currentRank.color}30` }}>
            {userRating}
          </span>
          <div className="mb-1">
            <span style={{ color: currentRank.color, fontSize: 13, fontWeight: 600 }}>{currentRank.title}</span>
            {nextRank && (
              <p style={{ color: c.textSecondary, fontSize: 10, marginTop: 1 }}>
                {nextRank.min - userRating} to {nextRank.title}
              </p>
            )}
          </div>
        </div>
        {nextRank && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span style={{ color: currentRank.color, fontSize: 9, fontWeight: 600 }}>{currentRank.min}</span>
              <span style={{ color: nextRank.color, fontSize: 9, fontWeight: 600 }}>{nextRank.min}</span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: c.progressTrack }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${progressInTier}%`,
                  background: `linear-gradient(90deg, ${currentRank.color}, ${nextRank.color})`,
                  boxShadow: `0 0 8px ${currentRank.color}60`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Stat Cards */}
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-5 px-5" style={{ scrollbarWidth: "none" }}>
        {[
          { label: "Solved", value: "342", icon: Zap, color: c.green },
          { label: "Streak", value: "12d", icon: Flame, color: c.yellow },
          { label: "Upsolve", value: "8", icon: RotateCcw, color: c.orange },
          { label: "Max Rating", value: "1580", icon: TrendingUp, color: "#03A89E" },
        ].map((s) => (
          <div
            key={s.label}
            className="flex-shrink-0 rounded-xl p-3.5 min-w-[105px]"
            style={{ background: c.surface, border: `1px solid ${c.border}` }}
          >
            <s.icon size={18} color={s.color} />
            <p style={{ color: c.text, fontSize: 22, fontWeight: 700, marginTop: 8 }}>{s.value}</p>
            <span style={{ color: c.textSecondary, fontSize: 11 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Next Contest */}
      <div
        className="rounded-2xl p-5 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${c.primary}18 0%, ${c.green}10 100%)`,
          border: `1px solid ${c.primary}30`,
        }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full" style={{
          background: `radial-gradient(circle, ${c.primary}15 0%, transparent 70%)`,
          transform: "translate(30%, -30%)",
        }} />
        <p style={{ color: c.textSecondary, fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
          Next Contest
        </p>
        <h2 style={{ color: c.text, fontSize: 18, fontWeight: 700, marginTop: 6 }}>Codeforces Round #945</h2>
        <p style={{ color: c.textSecondary, fontSize: 12, marginTop: 2 }}>Div. 2 · Apr 15, 2026 · 19:35 UTC</p>
        <div className="flex items-center gap-4 mt-4">
          <div className="flex gap-2">
            {["02", "14", "37"].map((v, i) => (
              <div key={i} className="rounded-lg px-2.5 py-1.5 text-center" style={{ background: `${c.primary}20` }}>
                <span style={{ color: c.primary, fontSize: 18, fontWeight: 700 }}>{v}</span>
                <span style={{ color: c.textSecondary, fontSize: 8, display: "block" }}>{["HRS", "MIN", "SEC"][i]}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setReminderSet(!reminderSet)}
            className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all active:scale-95"
            style={{
              background: reminderSet ? `${c.green}20` : c.primary,
              color: reminderSet ? c.green : "#fff",
              fontSize: 12, fontWeight: 600,
              border: reminderSet ? `1px solid ${c.green}40` : "none",
            }}
          >
            <Bell size={13} />
            {reminderSet ? "Set" : "Remind"}
          </button>
        </div>
      </div>

      {/* Activity Heatmap */}
      <div className="rounded-2xl p-4" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
        <div className="flex items-center justify-between mb-3">
          <span style={{ color: c.text, fontSize: 14, fontWeight: 600 }}>Activity</span>
          <span style={{ color: c.textSecondary, fontSize: 11 }}>Last 15 weeks</span>
        </div>
        <div className="flex gap-[3px] overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {heatmapData.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((val, di) => (
                <div key={di} className="rounded-[2px]" style={{ width: 14, height: 14, background: heatColors[val] }} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Rating Graph */}
      <div className="rounded-2xl p-4" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
        <span style={{ color: c.text, fontSize: 14, fontWeight: 600 }}>Rating Progress</span>
        <div className="mt-3" style={{ width: "100%", minWidth: 200, height: 140 }}>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={ratingData}>
              <XAxis dataKey="date" tick={{ fill: c.textSecondary, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide domain={["dataMin - 50", "dataMax + 50"]} />
              <Tooltip
                contentStyle={{
                  background: c.tooltipBg, border: `1px solid ${c.borderLight}`,
                  borderRadius: 8, fontSize: 12, color: c.text,
                }}
              />
              <Line type="monotone" dataKey="rating" stroke={c.primary} strokeWidth={2} dot={{ r: 3, fill: c.primary }} activeDot={{ r: 5 }} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <span style={{ color: c.text, fontSize: 14, fontWeight: 600 }}>Recent Activity</span>
        <div className="mt-3 space-y-2">
          {recentActivity.map((a, i) => {
            const cfg = statusConfig[a.status];
            const Icon = cfg.icon;
            return (
              <div key={i} className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
                <Icon size={16} color={cfg.color} />
                <div className="flex-1 min-w-0">
                  <p className="truncate" style={{ color: c.text, fontSize: 13, fontWeight: 500 }}>{a.name}</p>
                  <p style={{ color: c.textSecondary, fontSize: 11 }}>{a.platform}</p>
                </div>
                <span style={{ color: c.textSecondary, fontSize: 11 }}>{a.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

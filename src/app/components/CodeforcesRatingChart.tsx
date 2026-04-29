import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip,
  ReferenceArea, CartesianGrid,
} from "recharts";
import { useTheme } from "./ThemeContext";

type Point = { t: number; rating: number; contest: string; rank: number; delta: number };

const cfBands = [
  { min: 0,    max: 1200, color: "#CCCCCC" },
  { min: 1200, max: 1400, color: "#77FF77" },
  { min: 1400, max: 1600, color: "#77DDBB" },
  { min: 1600, max: 1900, color: "#AAAAFF" },
  { min: 1900, max: 2100, color: "#FF88FF" },
  { min: 2100, max: 2300, color: "#FFCC88" },
  { min: 2300, max: 2400, color: "#FFBB55" },
  { min: 2400, max: 2600, color: "#FF7777" },
  { min: 2600, max: 3000, color: "#FF3333" },
  { min: 3000, max: 4000, color: "#AA0000" },
];

export function CodeforcesRatingChart({ handle }: { handle: string }) {
  const { c, theme } = useTheme();
  const [data, setData] = useState<Point[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setError(null);
    fetch(`https://codeforces.com/api/user.rating?handle=${encodeURIComponent(handle)}`)
      .then((r) => r.json())
      .then((j) => {
        if (cancelled) return;
        if (j.status !== "OK") throw new Error(j.comment || "API error");
        const points: Point[] = j.result.map((e: any) => ({
          t: e.ratingUpdateTimeSeconds * 1000,
          rating: e.newRating,
          contest: e.contestName,
          rank: e.rank,
          delta: e.newRating - e.oldRating,
        }));
        setData(points);
      })
      .catch((e) => !cancelled && setError(e.message));
    return () => { cancelled = true; };
  }, [handle]);

  if (error) {
    return <div style={{ color: c.textSecondary, fontSize: 12, padding: 12 }}>Failed to load: {error}</div>;
  }
  if (!data) {
    return <div style={{ color: c.textSecondary, fontSize: 12, padding: 12 }}>Loading rating history…</div>;
  }
  if (data.length === 0) {
    return <div style={{ color: c.textSecondary, fontSize: 12, padding: 12 }}>No contests yet.</div>;
  }

  const minR = Math.min(...data.map((d) => d.rating));
  const maxR = Math.max(...data.map((d) => d.rating));
  const yMin = Math.floor((minR - 100) / 100) * 100;
  const yMax = Math.ceil((maxR + 100) / 100) * 100;
  const opacity = theme === "dark" ? 0.35 : 0.55;

  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 4, left: 4 }}>
          <CartesianGrid stroke={c.border} strokeDasharray="2 4" vertical={false} />
          {cfBands.map((b) => (
            <ReferenceArea
              key={b.min}
              y1={Math.max(b.min, yMin)}
              y2={Math.min(b.max, yMax)}
              fill={b.color}
              fillOpacity={opacity}
              stroke="none"
              ifOverflow="hidden"
            />
          ))}
          <XAxis
            dataKey="t"
            type="number"
            domain={["dataMin", "dataMax"]}
            tick={{ fill: c.textSecondary, fontSize: 9 }}
            tickFormatter={(v) => new Date(v).getFullYear().toString()}
            axisLine={{ stroke: c.border }}
            tickLine={false}
          />
          <YAxis
            type="number"
            domain={[yMin, yMax]}
            tick={{ fill: c.textSecondary, fontSize: 9 }}
            ticks={[1200, 1400, 1600, 1900, 2100, 2300, 2400, 2600, 3000, 3500, 4000].filter((t) => t >= yMin && t <= yMax)}
            axisLine={{ stroke: c.border }}
            tickLine={false}
            width={32}
            interval={0}
          />
          <Tooltip
            contentStyle={{
              background: c.tooltipBg, border: `1px solid ${c.borderLight}`,
              borderRadius: 8, fontSize: 11, color: c.text,
            }}
            labelFormatter={(v) => new Date(v as number).toLocaleDateString()}
            formatter={(_v: any, _n: any, p: any) => {
              const d: Point = p.payload;
              const sign = d.delta >= 0 ? "+" : "";
              return [`${d.rating} (${sign}${d.delta}) · #${d.rank}`, d.contest];
            }}
          />
          <Line
            type="linear"
            dataKey="rating"
            stroke={theme === "dark" ? "#FFFFFF" : "#1F2937"}
            strokeWidth={1.5}
            dot={{ r: 2.5, fill: theme === "dark" ? "#FFFFFF" : "#1F2937", stroke: "none" }}
            activeDot={{ r: 4 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export async function fetchCodeforcesUser(handle: string) {
  const res = await fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`);
  const j = await res.json();
  if (j.status !== "OK") throw new Error(j.comment || "API error");
  return j.result[0] as {
    handle: string; firstName?: string; lastName?: string;
    rating?: number; maxRating?: number; rank?: string; maxRank?: string;
  };
}

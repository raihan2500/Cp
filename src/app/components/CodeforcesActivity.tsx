import { useTheme } from "./ThemeContext";

const darkScale = ["#1f2428", "#0e4429", "#006d32", "#26a641", "#39d353"];
const lightScale = ["#EBEDF0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];

const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function CodeforcesActivity({ perDay, year }: { perDay: Map<string, number>; year?: number }) {
  const { theme, c } = useTheme();
  const scale = theme === "dark" ? darkScale : lightScale;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let start: Date, end: Date;
  if (year !== undefined) {
    const yStart = new Date(year, 0, 1);
    const yEnd = new Date(year, 11, 31);
    start = new Date(yStart);
    start.setDate(yStart.getDate() - yStart.getDay());
    end = new Date(yEnd);
    end.setDate(yEnd.getDate() + (6 - yEnd.getDay()));
  } else {
    end = new Date(today);
    end.setDate(end.getDate() + (6 - end.getDay()));
    start = new Date(end);
    start.setDate(end.getDate() - (53 * 7 - 1));
  }
  const weeks = Math.round((end.getTime() - start.getTime()) / (7 * 86400000)) + 1;

  const cells: { date: Date; count: number }[][] = [];
  for (let w = 0; w < weeks; w++) {
    const col: { date: Date; count: number }[] = [];
    for (let d = 0; d < 7; d++) {
      const cur = new Date(start);
      cur.setDate(start.getDate() + w * 7 + d);
      const count = perDay.get(dayKey(cur)) ?? 0;
      col.push({ date: cur, count });
    }
    cells.push(col);
  }

  const level = (n: number) => {
    if (n === 0) return 0;
    if (n <= 2) return 1;
    if (n <= 5) return 2;
    if (n <= 9) return 3;
    return 4;
  };

  // month labels along the top: print label when the first row of week is the 1st-7th of a month
  const monthMarkers: { col: number; label: string }[] = [];
  let lastMonth = -1;
  cells.forEach((col, i) => {
    const m = col[0].date.getMonth();
    if (m !== lastMonth && col[0].date.getDate() <= 7) {
      monthMarkers.push({ col: i, label: monthLabels[m] });
      lastMonth = m;
    }
  });

  const totalThisYear = cells.reduce((acc, col) => acc + col.reduce((a, x) => a + x.count, 0), 0);

  const cell = 11;
  const gap = 3;

  return (
    <div className="overflow-x-auto" style={{ scrollbarWidth: "none" }}>
      <div style={{ display: "inline-block", minWidth: weeks * (cell + gap) + 24 }}>
        <div className="flex" style={{ paddingLeft: 22 }}>
          {monthMarkers.map((m, i) => {
            const next = monthMarkers[i + 1]?.col ?? weeks;
            const width = (next - m.col) * (cell + gap);
            return (
              <span key={`${m.col}-${m.label}`} style={{ width, color: c.textSecondary, fontSize: 9 }}>{m.label}</span>
            );
          })}
        </div>
        <div className="flex" style={{ marginTop: 4 }}>
          <div className="flex flex-col justify-between" style={{ width: 22, height: 7 * cell + 6 * gap, fontSize: 9, color: c.textSecondary }}>
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>
          <div className="flex" style={{ gap }}>
            {cells.map((col, ci) => (
              <div key={ci} className="flex flex-col" style={{ gap }}>
                {col.map((day, di) => (
                  <div
                    key={di}
                    title={`${day.count} solved on ${day.date.toDateString()}`}
                    style={{
                      width: cell, height: cell, borderRadius: 2,
                      background: scale[level(day.count)],
                      opacity: day.date > today ? 0.25 : 1,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between mt-3" style={{ paddingLeft: 22 }}>
          <span style={{ color: c.textSecondary, fontSize: 11 }}>{totalThisYear} solved {year !== undefined ? `in ${year}` : "in last year"}</span>
          <div className="flex items-center gap-1">
            <span style={{ color: c.textSecondary, fontSize: 10 }}>Less</span>
            {scale.map((bg, i) => (
              <div key={i} style={{ width: cell, height: cell, borderRadius: 2, background: bg }} />
            ))}
            <span style={{ color: c.textSecondary, fontSize: 10 }}>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}

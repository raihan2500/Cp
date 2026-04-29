import { useEffect, useState } from "react";
import {
  TrendingUp,
  Zap,
  Flame,
  RotateCcw,
  Bell,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUp,
} from "lucide-react";
import { useTheme } from "./ThemeContext";
import { CodeforcesRatingChart } from "./CodeforcesRatingChart";
import { CodeforcesActivity } from "./CodeforcesActivity";
import {
  useClistContests,
  platformFromHost,
  countdownParts,
  formatDuration,
} from "./useClistContests";
import { useUserInfo } from "./UserInfo";

function verdictMeta(v: string): {
  icon: typeof CheckCircle2;
  color: string;
  label: string;
} {
  if (v === "OK")
    return {
      icon: CheckCircle2,
      color: "#7EE787",
      label: "Accepted",
    };
  if (v === "TESTING" || v === "PARTIAL")
    return {
      icon: Clock,
      color: "#F2CC60",
      label: v === "TESTING" ? "Testing" : "Partial",
    };
  if (v === "COMPILATION_ERROR")
    return {
      icon: XCircle,
      color: "#F85149",
      label: "Compile Error",
    };
  if (v === "TIME_LIMIT_EXCEEDED")
    return { icon: XCircle, color: "#F85149", label: "TLE" };
  if (v === "MEMORY_LIMIT_EXCEEDED")
    return { icon: XCircle, color: "#F85149", label: "MLE" };
  if (v === "WRONG_ANSWER")
    return {
      icon: XCircle,
      color: "#F85149",
      label: "Wrong Answer",
    };
  if (v === "RUNTIME_ERROR")
    return {
      icon: XCircle,
      color: "#F85149",
      label: "Runtime Error",
    };
  return {
    icon: XCircle,
    color: "#F85149",
    label: v.replace(/_/g, " ").toLowerCase(),
  };
}

function timeAgo(sec: number): string {
  const diff = Date.now() / 1000 - sec;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 86400 * 30)
    return `${Math.floor(diff / 86400)}d ago`;
  if (diff < 86400 * 365)
    return `${Math.floor(diff / 86400 / 30)}mo ago`;
  return `${Math.floor(diff / 86400 / 365)}y ago`;
}

function rankFromTitle(title: string): string {
  return title.toLowerCase();
}

const cfRanks = [
  { min: 0, max: 1199, title: "Newbie", color: "#808080" },
  { min: 1200, max: 1399, title: "Pupil", color: "#008000" },
  {
    min: 1400,
    max: 1599,
    title: "Specialist",
    color: "#03A89E",
  },
  { min: 1600, max: 1899, title: "Expert", color: "#0000FF" },
  {
    min: 1900,
    max: 2099,
    title: "Candidate Master",
    color: "#AA00AA",
  },
  { min: 2100, max: 2299, title: "Master", color: "#FF8C00" },
  {
    min: 2300,
    max: 2399,
    title: "International Master",
    color: "#FF8C00",
  },
  {
    min: 2400,
    max: 2599,
    title: "Grandmaster",
    color: "#FF0000",
  },
  {
    min: 2600,
    max: 2999,
    title: "Intl. Grandmaster",
    color: "#FF0000",
  },
  {
    min: 3000,
    max: 9999,
    title: "Legendary GM",
    color: "#FF0000",
  },
];

function getCfRank(rating: number) {
  return (
    cfRanks.find((r) => rating >= r.min && rating <= r.max) ||
    cfRanks[0]
  );
}

export function HomeScreen() {
  const { c } = useTheme();
  const [reminderSet, setReminderSet] = useState(false);
  const [recentLimit, setRecentLimit] = useState(8);
  const { handle, displayName, cfUser, cfStatus, lastDelta } = useUserInfo();
  const currentYear = new Date().getFullYear();
  const [activityYear, setActivityYear] = useState<number>(currentYear);
  const availableYears = (() => {
    const years = new Set<number>([currentYear]);
    cfStatus.perDay.forEach((_, key) => years.add(Number(key.slice(0, 4))));
    return Array.from(years).sort((a, b) => b - a);
  })();
  const { contests: upcoming } = useClistContests(20);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const nextContest = upcoming?.[0];
  const nextContestStart = nextContest
    ? new Date(nextContest.start + "Z")
    : null;
  const nextParts = nextContestStart
    ? countdownParts(nextContestStart)
    : { d: 0, h: 0, m: 0, s: 0 };
  void tick;

  const userRating = cfUser?.rating ?? 0;
  const maxRating = cfUser?.maxRating ?? userRating;
  const currentRank = getCfRank(userRating);
  const nextRank = cfRanks[cfRanks.indexOf(currentRank) + 1];
  const progressInTier = nextRank
    ? ((userRating - currentRank.min) /
        (nextRank.min - currentRank.min)) *
      100
    : 100;

  return (
    <div className="px-5 pt-14 pb-4 space-y-5">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <p style={{ color: c.textSecondary, fontSize: 13 }}>
            Good evening
          </p>
          <h1
            style={{
              color: c.text,
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            {displayName}
          </h1>
        </div>
        <div
          className="px-3 py-1.5 rounded-full flex items-center gap-2"
          style={{
            background: `${currentRank.color}18`,
            border: `1px solid ${currentRank.color}40`,
          }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background: currentRank.color,
              boxShadow: `0 0 6px ${currentRank.color}80`,
            }}
          />
          <span
            style={{
              color: currentRank.color,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {currentRank.title}
          </span>
        </div>
      </div>

      {/* CF Profile-style Rating Card */}
      <div
        className="rounded-2xl p-5 relative overflow-hidden"
        style={{
          background: c.surface,
          border: `1px solid ${c.border}`,
        }}
      >
        <div
          className="absolute top-0 right-0 w-32 h-32 rounded-full"
          style={{
            background: `radial-gradient(circle, ${currentRank.color}18, transparent 70%)`,
            transform: "translate(30%, -30%)",
          }}
        />
        <div className="flex items-center gap-2">
          <span
            style={{
              color: c.textSecondary,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Codeforces
          </span>
          <span
            style={{ color: c.textSecondary, fontSize: 11 }}
          >
            ·
          </span>
          <span
            style={{ color: c.textSecondary, fontSize: 11 }}
          >
            @{handle}
          </span>
        </div>

        <div style={{ marginTop: 8 }}>
          <span
            style={{
              color: currentRank.color,
              fontSize: 16,
              fontWeight: 700,
              textTransform: "capitalize",
            }}
          >
            {cfUser?.rank ?? rankFromTitle(currentRank.title)}
          </span>
          <span
            style={{
              color: currentRank.color,
              fontWeight: 700,
              marginLeft: 6,
            }}
          >
            {displayName}
          </span>
        </div>

        <div
          className="flex items-baseline gap-2"
          style={{ marginTop: 10 }}
        >
          <span
            style={{ color: c.textSecondary, fontSize: 12 }}
          >
            Contest rating:
          </span>
          <span
            style={{
              color: currentRank.color,
              fontSize: 28,
              fontWeight: 800,
              lineHeight: 1,
            }}
          >
            {userRating || "—"}
          </span>
          {lastDelta !== null && (
            <span
              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded"
              style={{
                background:
                  lastDelta >= 0
                    ? `${c.green}18`
                    : `${c.red}18`,
                color: lastDelta >= 0 ? c.green : c.red,
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              {lastDelta >= 0 ? (
                <ArrowUp size={10} />
              ) : (
                <span style={{ fontSize: 11 }}>↓</span>
              )}
              {lastDelta >= 0 ? "+" : ""}
              {lastDelta}
            </span>
          )}
        </div>

        <div
          style={{
            color: c.textSecondary,
            fontSize: 12,
            marginTop: 4,
          }}
        >
          (max.{" "}
          <span
            style={{
              color: getCfRank(maxRating).color,
              fontWeight: 600,
              textTransform: "capitalize",
            }}
          >
            {cfUser?.maxRank ??
              rankFromTitle(getCfRank(maxRating).title)}
          </span>
          , {maxRating || "—"})
        </div>

        {nextRank && userRating > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <span
                style={{
                  color: currentRank.color,
                  fontSize: 10,
                  fontWeight: 600,
                }}
              >
                {currentRank.min}
              </span>
              <span
                style={{ color: c.textSecondary, fontSize: 10 }}
              >
                {nextRank.min - userRating} to {nextRank.title}
              </span>
              <span
                style={{
                  color: nextRank.color,
                  fontSize: 10,
                  fontWeight: 600,
                }}
              >
                {nextRank.min}
              </span>
            </div>
            <div
              className="w-full h-1.5 rounded-full overflow-hidden"
              style={{ background: c.progressTrack }}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${progressInTier}%`,
                  background: `linear-gradient(90deg, ${currentRank.color}, ${nextRank.color})`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Stat Cards */}
      <div
        className="flex gap-3 overflow-x-auto pb-1 -mx-5 px-5"
        style={{ scrollbarWidth: "none" }}
      >
        {[
          {
            label: "Solved",
            value: cfStatus.loading
              ? "…"
              : String(cfStatus.solved),
            icon: Zap,
            color: c.green,
          },
          {
            label: "Streak",
            value: cfStatus.loading
              ? "…"
              : `${cfStatus.streak}d`,
            icon: Flame,
            color: c.yellow,
          },
          {
            label: "Upsolve",
            value: cfStatus.loading
              ? "…"
              : String(cfStatus.upsolve),
            icon: RotateCcw,
            color: c.orange,
          },
          {
            label: "Max Rating",
            value: maxRating ? String(maxRating) : "—",
            icon: TrendingUp,
            color: "#03A89E",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="flex-shrink-0 rounded-xl p-3.5 min-w-[105px]"
            style={{
              background: c.surface,
              border: `1px solid ${c.border}`,
            }}
          >
            <s.icon size={18} color={s.color} />
            <p
              style={{
                color: c.text,
                fontSize: 22,
                fontWeight: 700,
                marginTop: 8,
              }}
            >
              {s.value}
            </p>
            <span
              style={{ color: c.textSecondary, fontSize: 11 }}
            >
              {s.label}
            </span>
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
        <div
          className="absolute top-0 right-0 w-32 h-32 rounded-full"
          style={{
            background: `radial-gradient(circle, ${c.primary}15 0%, transparent 70%)`,
            transform: "translate(30%, -30%)",
          }}
        />
        <p
          style={{
            color: c.textSecondary,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          Next Contest
        </p>
        <h2
          style={{
            color: c.text,
            fontSize: 18,
            fontWeight: 700,
            marginTop: 6,
          }}
        >
          {nextContest
            ? nextContest.event
            : "Loading next contest…"}
        </h2>
        <p
          style={{
            color: c.textSecondary,
            fontSize: 12,
            marginTop: 2,
          }}
        >
          {nextContest && nextContestStart
            ? `${platformFromHost(nextContest.host)} · ${nextContestStart.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })} · ${formatDuration(nextContest.duration)}`
            : "Fetching schedule from clist.by…"}
        </p>
        <div className="flex items-center gap-4 mt-4">
          <div className="flex gap-2">
            {[
              { v: nextParts.d, l: "DAY" },
              { v: nextParts.h, l: "HRS" },
              { v: nextParts.m, l: "MIN" },
              { v: nextParts.s, l: "SEC" },
            ].map((p, i) => (
              <div
                key={i}
                className="rounded-lg px-2.5 py-1.5 text-center"
                style={{
                  background: `${c.primary}20`,
                  minWidth: 38,
                }}
              >
                <span
                  style={{
                    color: c.primary,
                    fontSize: 18,
                    fontWeight: 700,
                  }}
                >
                  {String(p.v).padStart(2, "0")}
                </span>
                <span
                  style={{
                    color: c.textSecondary,
                    fontSize: 8,
                    display: "block",
                  }}
                >
                  {p.l}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setReminderSet(!reminderSet)}
            className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all active:scale-95"
            style={{
              background: reminderSet
                ? `${c.green}20`
                : c.primary,
              color: reminderSet ? c.green : "#fff",
              fontSize: 12,
              fontWeight: 600,
              border: reminderSet
                ? `1px solid ${c.green}40`
                : "none",
            }}
          >
            <Bell size={13} />
            {reminderSet ? "Set" : "Remind"}
          </button>
        </div>
      </div>

      {/* Activity Heatmap (Codeforces-style) */}
      <div
        className="rounded-2xl p-4"
        style={{
          background: c.surface,
          border: `1px solid ${c.border}`,
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <span
            style={{
              color: c.text,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Activity
          </span>
          <div className="flex items-center gap-2">
            <select
              value={activityYear}
              onChange={(e) => setActivityYear(Number(e.target.value))}
              className="rounded-md outline-none cursor-pointer"
              style={{
                background: c.bg,
                color: c.text,
                border: `1px solid ${c.border}`,
                fontSize: 11,
                padding: "3px 6px",
              }}
            >
              {availableYears.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <span style={{ color: c.textSecondary, fontSize: 11 }}>
              @{handle}
            </span>
          </div>
        </div>
        {cfStatus.loading ? (
          <p style={{ color: c.textSecondary, fontSize: 12 }}>
            Loading activity…
          </p>
        ) : cfStatus.error ? (
          <p style={{ color: c.textSecondary, fontSize: 12 }}>
            Failed to load activity.
          </p>
        ) : (
          <CodeforcesActivity perDay={cfStatus.perDay} year={activityYear} />
        )}
      </div>

      {/* Rating Graph (Codeforces-style) */}
      <div
        className="rounded-2xl p-4"
        style={{
          background: c.surface,
          border: `1px solid ${c.border}`,
        }}
      >
        <div className="flex items-center justify-between">
          <span
            style={{
              color: c.text,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Rating Progress
          </span>
          <span
            style={{ color: c.textSecondary, fontSize: 11 }}
          >
            @{handle}
          </span>
        </div>
        <div className="mt-3">
          <CodeforcesRatingChart handle={handle} />
        </div>
      </div>

      {/* Recent Activity (live from Codeforces) */}
      <div>
        <div className="flex items-center justify-between">
          <span
            style={{
              color: c.text,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Recent Submissions
          </span>
          <span
            style={{ color: c.textSecondary, fontSize: 11 }}
          >
            Codeforces
          </span>
        </div>
        <div className="mt-3 space-y-2">
          {cfStatus.loading && (
            <p style={{ color: c.textSecondary, fontSize: 12 }}>
              Loading submissions…
            </p>
          )}
          {!cfStatus.loading &&
            cfStatus.recent.length === 0 && (
              <p
                style={{ color: c.textSecondary, fontSize: 12 }}
              >
                No submissions found.
              </p>
            )}
          {cfStatus.recent.slice(0, recentLimit).map((s) => {
            const meta = verdictMeta(s.verdict);
            const Icon = meta.icon;
            const url = s.contestId
              ? `https://codeforces.com/contest/${s.contestId}/problem/${s.index}`
              : `https://codeforces.com/problemset/problem/${s.contestId ?? ""}/${s.index}`;
            return (
              <a
                key={s.id}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl px-4 py-3 active:scale-[0.99] transition-all"
                style={{
                  background: c.surface,
                  border: `1px solid ${c.border}`,
                }}
              >
                <Icon size={16} color={meta.color} />
                <div className="flex-1 min-w-0">
                  <p
                    className="truncate"
                    style={{
                      color: c.text,
                      fontSize: 13,
                      fontWeight: 500,
                    }}
                  >
                    {s.contestId
                      ? `${s.contestId}${s.index} · `
                      : ""}
                    {s.problem}
                  </p>
                  <p
                    style={{
                      color: meta.color,
                      fontSize: 11,
                      fontWeight: 500,
                    }}
                  >
                    {meta.label}
                    {s.participantType === "PRACTICE" && (
                      <span
                        style={{
                          color: c.textSecondary,
                          marginLeft: 6,
                        }}
                      >
                        · practice
                      </span>
                    )}
                  </p>
                </div>
                <span
                  style={{
                    color: c.textSecondary,
                    fontSize: 11,
                  }}
                >
                  {timeAgo(s.time)}
                </span>
              </a>
            );
          })}
          {!cfStatus.loading && cfStatus.recent.length > recentLimit && (
            <button
              onClick={() => setRecentLimit((n) => n + 8)}
              className="w-full py-2.5 rounded-xl active:scale-[0.99] transition-all"
              style={{
                background: `${c.primary}15`,
                color: c.primary,
                border: `1px solid ${c.primary}30`,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Show more
            </button>
          )}
          {!cfStatus.loading &&
            recentLimit > 8 &&
            cfStatus.recent.length <= recentLimit && (
              <button
                onClick={() => setRecentLimit(8)}
                className="w-full py-2.5 rounded-xl active:scale-[0.99] transition-all"
                style={{
                  background: `${c.textSecondary}12`,
                  color: c.textSecondary,
                  border: `1px solid ${c.border}`,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                Show less
              </button>
            )}
        </div>
      </div>
    </div>
  );
}
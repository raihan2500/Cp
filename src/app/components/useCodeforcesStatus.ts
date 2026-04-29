import { useEffect, useState } from "react";

type Submission = {
  creationTimeSeconds: number;
  verdict?: string;
  problem: { contestId?: number; index: string; name: string };
  author: { participantType: string };
};

export type CfRecent = {
  id: string;
  problem: string;
  contestId?: number;
  index: string;
  verdict: string;
  time: number; // seconds
  participantType: string;
};

export type CfStats = {
  solved: number;
  streak: number;
  upsolve: number;
  perDay: Map<string, number>; // yyyy-mm-dd -> solved count
  recent: CfRecent[];
  loading: boolean;
  error: string | null;
};

const dayKey = (sec: number) => {
  const d = new Date(sec * 1000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export function useCodeforcesStatus(handle: string): CfStats {
  const [stats, setStats] = useState<CfStats>({
    solved: 0, streak: 0, upsolve: 0, perDay: new Map(), recent: [], loading: true, error: null,
  });

  useEffect(() => {
    let cancelled = false;
    setStats((s) => ({ ...s, loading: true, error: null }));
    fetch(`https://codeforces.com/api/user.status?handle=${encodeURIComponent(handle)}&from=1&count=2000`)
      .then((r) => r.json())
      .then((j) => {
        if (cancelled) return;
        if (j.status !== "OK") throw new Error(j.comment || "API error");
        const subs: Submission[] = j.result;

        const solvedKeys = new Set<string>();
        const upsolveKeys = new Set<string>();
        const perDay = new Map<string, number>();

        for (const s of subs) {
          if (s.verdict !== "OK") continue;
          const key = `${s.problem.contestId ?? "?"}-${s.problem.index}`;
          if (solvedKeys.has(key)) continue;
          solvedKeys.add(key);
          if (s.author.participantType === "PRACTICE") upsolveKeys.add(key);
          const d = dayKey(s.creationTimeSeconds);
          perDay.set(d, (perDay.get(d) ?? 0) + 1);
        }

        // streak: consecutive days ending today (or yesterday if no submission today)
        let streak = 0;
        const cursor = new Date();
        cursor.setHours(0, 0, 0, 0);
        const todayKey = dayKey(cursor.getTime() / 1000);
        if (!perDay.has(todayKey)) cursor.setDate(cursor.getDate() - 1);
        while (true) {
          const k = dayKey(cursor.getTime() / 1000);
          if (perDay.has(k)) {
            streak += 1;
            cursor.setDate(cursor.getDate() - 1);
          } else break;
        }

        const recent: CfRecent[] = subs.slice(0, 50).map((s, i) => ({
          id: `${s.creationTimeSeconds}-${s.problem.contestId ?? "x"}-${s.problem.index}-${i}`,
          problem: s.problem.name,
          contestId: s.problem.contestId,
          index: s.problem.index,
          verdict: s.verdict ?? "TESTING",
          time: s.creationTimeSeconds,
          participantType: s.author.participantType,
        }));

        setStats({
          solved: solvedKeys.size,
          upsolve: upsolveKeys.size,
          streak,
          perDay,
          recent,
          loading: false,
          error: null,
        });
      })
      .catch((e) => !cancelled && setStats((s) => ({ ...s, loading: false, error: e.message })));
    return () => { cancelled = true; };
  }, [handle]);

  return stats;
}

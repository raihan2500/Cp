import { useEffect, useState } from "react";

const CLIST_AUTH = "ApiKey raihan2500:70f4a70b12282d45372d9b66e5b6a4603226afc9";

export type ClistContest = {
  id: number;
  event: string;
  host: string;
  resource: string;
  start: string; // ISO
  end: string;
  duration: number; // seconds
  href: string;
};

const HOST_TO_PLATFORM: Record<string, string> = {
  "codeforces.com": "Codeforces",
  "atcoder.jp": "AtCoder",
  "codechef.com": "CodeChef",
  "leetcode.com": "LeetCode",
  "topcoder.com": "TopCoder",
  "hackerrank.com": "HackerRank",
  "hackerearth.com": "HackerEarth",
  "kattis.com": "Kattis",
  "csacademy.com": "CS Academy",
};

export function platformFromHost(host: string): string {
  return HOST_TO_PLATFORM[host] ?? host.split(".")[0].replace(/^\w/, (s) => s.toUpperCase());
}

export function useClistContests(limit = 30) {
  const [contests, setContests] = useState<ClistContest[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const now = new Date().toISOString();
    const url = `https://clist.by/api/v4/contest/?upcoming=true&order_by=start&limit=${limit}&start__gt=${encodeURIComponent(now)}`;
    fetch(url, { headers: { Authorization: CLIST_AUTH } })
      .then((r) => r.json())
      .then((j) => {
        if (cancelled) return;
        const objs = (j.objects ?? []) as any[];
        setContests(
          objs.map((o) => ({
            id: o.id,
            event: o.event,
            host: o.host,
            resource: o.resource ?? o.host,
            start: o.start,
            end: o.end,
            duration: o.duration,
            href: o.href,
          })),
        );
      })
      .catch((e) => !cancelled && setError(e.message ?? "Failed to load"));
    return () => { cancelled = true; };
  }, [limit]);

  return { contests, error, loading: contests === null && !error };
}

export function formatDuration(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

export function formatCountdown(target: Date, now: Date = new Date()): string {
  let diff = Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000));
  const d = Math.floor(diff / 86400); diff %= 86400;
  const h = Math.floor(diff / 3600); diff %= 3600;
  const m = Math.floor(diff / 60);
  const s = diff % 60;
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function countdownParts(target: Date, now: Date = new Date()) {
  let diff = Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000));
  const d = Math.floor(diff / 86400); diff %= 86400;
  const h = Math.floor(diff / 3600); diff %= 3600;
  const m = Math.floor(diff / 60);
  const s = diff % 60;
  return { d, h, m, s };
}

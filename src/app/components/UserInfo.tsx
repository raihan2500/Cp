import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { fetchCodeforcesUser } from "./CodeforcesRatingChart";
import {
  useCodeforcesStatus,
  CfStats,
} from "./useCodeforcesStatus";

export const DEFAULT_HANDLE = "tourist";
export const DEFAULT_NAME = "Gennady Korotkevich";

export type CfUser = {
  handle: string;
  firstName?: string;
  lastName?: string;
  rating?: number;
  maxRating?: number;
  rank?: string;
  maxRank?: string;
  avatar?: string;
  titlePhoto?: string;
  contribution?: number;
  friendOfCount?: number;
  country?: string;
  city?: string;
  organization?: string;
  registrationTimeSeconds?: number;
};

type UserInfoContextValue = {
  handle: string;
  displayName: string;
  cfUser: CfUser | null;
  cfStatus: CfStats;
  lastDelta: number | null;
  contestCount: number | null;
};

const UserInfoContext =
  createContext<UserInfoContextValue | null>(null);

export function UserInfoProvider({
  children,
  handle = DEFAULT_HANDLE,
}: {
  children: ReactNode;
  handle?: string;
}) {
  const [cfUser, setCfUser] = useState<CfUser | null>(null);
  const [lastDelta, setLastDelta] = useState<number | null>(
    null,
  );
  const [contestCount, setContestCount] = useState<
    number | null
  >(null);
  const cfStatus = useCodeforcesStatus(handle);

  useEffect(() => {
    fetchCodeforcesUser(handle)
      .then((u) => setCfUser(u as CfUser))
      .catch(() => setCfUser({ handle } as CfUser));
    fetch(
      `https://codeforces.com/api/user.rating?handle=${encodeURIComponent(handle)}`,
    )
      .then((r) => r.json())
      .then((j) => {
        if (j.status !== "OK") return;
        setContestCount(j.result.length);
        if (j.result.length) {
          const last = j.result[j.result.length - 1];
          setLastDelta(last.newRating - last.oldRating);
        }
      })
      .catch(() => {});
  }, [handle]);

  const displayName =
    cfUser?.firstName && cfUser?.lastName
      ? `${cfUser.firstName} ${cfUser.lastName}`
      : DEFAULT_NAME;

  return (
    <UserInfoContext.Provider
      value={{
        handle,
        displayName,
        cfUser,
        cfStatus,
        lastDelta,
        contestCount,
      }}
    >
      {children}
    </UserInfoContext.Provider>
  );
}

export function useUserInfo(): UserInfoContextValue {
  const ctx = useContext(UserInfoContext);
  if (!ctx)
    throw new Error(
      "useUserInfo must be used inside <UserInfoProvider>",
    );
  return ctx;
}
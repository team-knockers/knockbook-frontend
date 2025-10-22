import { UserService } from "../../features/account/services/UserService";
import type { UserProfile } from "../../features/account/types";
import { BookHistoryService } from "../../features/feeds/services/BookHistoryService";

export type InsightLoaderData = {
  profile: UserProfile;
  categoryRatioStat: Awaited<ReturnType<typeof BookHistoryService.getCategoryPreferenceAll>>;
  readCountStat: Awaited<ReturnType<typeof BookHistoryService.getReadCountInPeriod>>;
};

export async function InsightPageLoader(): Promise<InsightLoaderData> {
  const profile = await UserService.getMyProfile();

  const [categoryRatioStat, readCountStat] = await Promise.all([
    BookHistoryService.getCategoryPreferenceAll(),
    BookHistoryService.getReadCountInPeriod("2025-05-01", "2025-10-30"),
  ]);
  return { profile, categoryRatioStat, readCountStat };
}

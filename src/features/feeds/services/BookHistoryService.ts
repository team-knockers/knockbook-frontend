import { useSession } from "../../../hooks/useSession";
import { apiAuthPath, apiAuthPathAndQuery } from "../../../shared/api";
import type { GetCategoryPreferenceAllResponse, GetReadCountInPeriodResponse } from "../types";

export const BookHistoryService = {

  // from: YYYY-MM-DD ISO string (ex: 2025-05-01)
  // to: YYYY-MM-DD ISO string (ex: 2025-10-30)
  async getReadCountInPeriod(from: string, to: string) {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }
    return await apiAuthPathAndQuery<GetReadCountInPeriodResponse>(
      "/users/{userId}/history/books/stat/average",
      { userId },
      { from, to },
      { method: "GET" }
    )
  },

  async getCategoryPreferenceAll() {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER"); }
    return await apiAuthPath<GetCategoryPreferenceAllResponse>(
      "/users/{userId}/history/books/stat/category-preference",
      { userId },
      { method: "GET" }
    )
  },
}
import { useSession } from "../../../hooks/useSession";
import { apiAuthPathAndQuery } from "../../../shared/api";
import type { FaqPage } from "../types";

export const FaqService = {
  async Getlist(page: string, size: string) {
    const { userId } = useSession.getState();
    if (!userId) { throw new Error("NO_USER") };
    return apiAuthPathAndQuery<FaqPage>(
      "/faqs/{userId}",
      { userId },
      { page, size },
      { method: "GET" }
    );
  },
}

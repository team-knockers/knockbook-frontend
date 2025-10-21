import { UserService } from "../../features/account/services/UserService";
import type { PointTransaction } from "../../features/purchase/type";

export type PointTransactionsEarnedPageLoaderData = {
  pointTransactionsEarned: PointTransaction[];
};

export async function PointTransactionsEarnedPageLoader() {
  const pointTransactions = await UserService.getPointTransactions();
  const pointTransactionsEarned = pointTransactions.filter(t => t.kind === "EARN");
  return { pointTransactionsEarned } satisfies PointTransactionsEarnedPageLoaderData;
}


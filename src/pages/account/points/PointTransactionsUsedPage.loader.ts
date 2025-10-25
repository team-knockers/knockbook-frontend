import { UserService } from "../../../features/account/services/UserService";
import type { PointTransaction } from "../../../features/purchase/type";

export type PointTransactionsUsedPageLoaderData = {
  pointTransactionsUsed: PointTransaction[];
};

export async function PointTransactionsUsedPageLoader() {
  const pointTransactions = await UserService.getPointTransactions();
  const pointTransactionsUsed = pointTransactions.filter(t => t.kind === "SPEND");
  return { pointTransactionsUsed } satisfies PointTransactionsUsedPageLoaderData;
}


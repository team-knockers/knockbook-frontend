import { UserService } from "../../features/account/services/UserService";
import type { PointTransaction } from "../../features/purchase/type";

export type PointTransactionsAllPageLoaderData = {
  pointTransactions: PointTransaction[];
};

export async function PointTransactionsAllPageLoader() {
  const pointTransactions = await UserService.getPointTransactions();
  return { pointTransactions } satisfies PointTransactionsAllPageLoaderData;
}


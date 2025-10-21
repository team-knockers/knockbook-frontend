import { UserService } from "../../features/account/services/UserService";

export type PointTransactionsPageLoaderData = {
  pointBalance: number;
};

export async function PointTransactionsPageLoader() {
  const pointBalance = (await UserService.getPoints()).balance;
  return { pointBalance } satisfies PointTransactionsPageLoaderData;
}
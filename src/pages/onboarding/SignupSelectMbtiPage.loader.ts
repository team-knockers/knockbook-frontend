import { ensureUser } from "../../shared/authReady";

export type SignupSelectMbtiPageLoaderData = {
  displayName: string;
};

export async function SignupSelectMbtiPageLoader()
: Promise<SignupSelectMbtiPageLoaderData> {
  const user = await ensureUser();
  const displayName = user.displayName;
  return { displayName };
}

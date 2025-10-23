import { UserService } from "../../features/account/services/UserService";

export type SignupSelectMbtiPageLoaderData = {
  displayName: string;
};

export async function SignupSelectMbtiPageLoader()
: Promise<SignupSelectMbtiPageLoaderData> {
  const displayName = (await UserService.getMyProfile()).displayName;
  return { displayName };
}

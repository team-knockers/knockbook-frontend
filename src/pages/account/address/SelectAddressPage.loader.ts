import { UserService } from "../../../features/account/services/UserService";

export async function SelectAddressPageLoader() {
  const res = await UserService.getAddresses();
  res.sort((a, b) => Number(a.id) - Number(b.id));
  return res;
}

export const SELECT_ADDRESS_LOADER_ID = "SELECT_ADDRESS_LOADER";

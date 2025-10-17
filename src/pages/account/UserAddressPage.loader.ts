import type { ActionFunctionArgs } from "react-router-dom";
import { UserService } from "../../features/account/services/UserService";
import type { InsertAddressRequest, UpdateAddressRequest } from "../../features/account/types";

export async function UserAddressPageLoader() {
  const res = await UserService.getAddresses();
  res.sort((a, b) => Number(a.id) - Number(b.id));
  return res;
}

export async function UserAddressAction({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const intent = form.get("intent");

  if (intent === "change-default") {
    const addressId = form.get("addressId");
    if (!addressId) {
      return new Response("Missing addressId", { status: 400 });
    }
    await UserService.setDefaultAddressAs(String(addressId));
    return new Response(null, { status: 204 });
  }

  if (intent === "delete") {
    const addressId = form.get("addressId");
    if (!addressId) {
      return new Response("Missing addressId", { status: 400 });
    }
    await UserService.deleteAddress(String(addressId));
    return new Response(null, { status: 204 });
  }

  if (intent === "insert") {
    const current = await UserService.getAddresses();
    const isFirst = !current || current.length === 0;
    const req : InsertAddressRequest = {
      recipientName: String(form.get("recipientName")),
      phone: String(form.get("phone")),
      postalCode: String(form.get("postalCode")),
      address1: String(form.get("address1")),
      address2: String(form.get("address2")),
      label: String(form.get("label")),
      isDefault: isFirst ? true : String(form.get("isDefault")).trim().toLowerCase() === "true",
    }
    await UserService.insertAddress(req);
    return new Response(null, { status: 200 });
  }

  if (intent == "get") {
    const addressId = form.get("addressId");
    if (!addressId) {
      return new Response("Missing addressId", { status: 400 });
    }
    const address = await UserService.getAddress(String(addressId));
    return Response.json(address);
  }

  if (intent == "update") {
    const addressId = form.get("addressId");
    if (!addressId) {
      return new Response("Missing addressId", { status: 400 });
    }
    const req : UpdateAddressRequest = {
      recipientName: String(form.get("recipientName")),
      phone: String(form.get("phone")),
      postalCode: String(form.get("postalCode")),
      address1: String(form.get("address1")),
      address2: String(form.get("address2")),
      label: String(form.get("label")),
      isDefault: String(form.get("isDefault")).trim().toLowerCase() === "true",
    }
    console.log(req);
    await UserService.updateAddress(String(addressId), req);
    return new Response(null, { status: 204 });
  }
}

export const USER_ADDRESS_LOADER_ID = "USER_ADDRESS_LOADER";

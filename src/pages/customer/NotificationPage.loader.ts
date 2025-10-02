import { CustomerService } from "../../features/customer/services/CustomerService";
import type { NotificationList } from "../../features/customer/types";

export async function NotificationPageLoader({ 
  request
} : { request: Request}) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") ?? "1");
  const size = Number(url.searchParams.get("size") ?? "10");
  const res = await CustomerService.GetNotificationList(page, size);
  return { 
    content: res.notifications,
    size: Number(size),
    totalItems: res.totalCounts
  } as NotificationList;
}

export const NOTIFICATION_LOADER_ID = "NOTIFICATION_LOADER";


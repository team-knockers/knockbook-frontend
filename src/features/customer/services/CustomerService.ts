import { apiAuthMultipartPath, apiAuthPathAndQuery } from "../../../shared/api";
import { ensureUserId } from "../../../shared/authReady";
import type { 
  CustomerQnaResponse, 
  FaqList, 
  GetNotificationListResponse, 
  GetQnAListResponse 
} from "../types";

export const CustomerService = {
  async GetFAQlist(
    page: string,
    size: string) {
      const userId = await ensureUserId();
      return apiAuthPathAndQuery<FaqList>(
        "/customers/{userId}/faq",
        { userId },
        { page, size },
        { method: "GET" }
      );
  },

  async RegisterQnA(
    title : string,
    content: string,
    files: File[]) {
      const userId = await ensureUserId();
      const form = new FormData();
      form.append("title", title);
      form.append("content", content);
      files?.forEach((f: File) => form.append("files", f));
      return apiAuthMultipartPath<CustomerQnaResponse>(
        "/customers/{userId}/qna",
        { userId },
        form,
        { method: "POST" }
      );
  },

  async GetQnAList(
    page: string,
    size: string) {
      const userId = await ensureUserId();
      return apiAuthPathAndQuery<GetQnAListResponse>(
        "/customers/{userId}/qna",
        { userId },
        { page, size },
        { method: "GET" }
      );
  },

  async GetNotificationList(
    page: number,
    size: number) {
      const userId = await ensureUserId();
      return apiAuthPathAndQuery<GetNotificationListResponse>(
        "/customers/{userId}/notification",
        { userId },
        { page, size },
        { method: "GET" }
      );
  },
}


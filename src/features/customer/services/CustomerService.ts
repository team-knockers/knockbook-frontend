import { useSession } from "../../../hooks/useSession";
import { apiAuthMultipartPath, apiAuthPathAndQuery } from "../../../shared/api";
import type { CustomerQnaResponse, FaqList, GetQnAListResponse } from "../types";

export const CustomerService = {
  async GetFAQlist(
    page: string,
    size: string) {
      const { userId } = useSession.getState();
      if (!userId) { throw new Error("NO_USER") }
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
      const { userId } = useSession.getState();
      if (!userId) { throw new Error("NO_USER") }
      const form = new FormData();
      form.append("title", title);
      form.append("content", content);
      files?.forEach((f: File) => form.append("files", f));
      console.log(files);
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
      const { userId } = useSession.getState();
      if (!userId) { throw new Error("NO_USER") }
      return apiAuthPathAndQuery<GetQnAListResponse>(
        "/customers/{userId}/qna",
        { userId },
        { page, size },
        { method: "GET" }
      );
  },
}

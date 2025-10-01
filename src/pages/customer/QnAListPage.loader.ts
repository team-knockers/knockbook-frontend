import { CustomerService } from "../../features/customer/services/CustomerService";
import type { QnaList } from "../../features/customer/types";

export async function QnAListPageLoader({ request } : { request: Request }) {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") ?? "1";
  const size = url.searchParams.get("size") ?? "5";
  const res = await CustomerService.GetQnAList( page, size );
  console.log(res);
  return { 
    content: res.qnas,
    size: Number(size),
    totalItems: res.totalQnas
  } as QnaList;
}

export const QNA_LOADER_ID = "QNA_LOADER";


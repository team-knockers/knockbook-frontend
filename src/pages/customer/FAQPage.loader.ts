// import { FaqService } from "../../features/customer/services/FaqService";
import { getFaqPage } from "../../features/customer/resources/faq.dummy";

export async function faqLoader({ request } : { request: Request}) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") ?? "1");
  const size = Number(url.searchParams.get("size") ?? "5");
  // return FaqService.list( page, size ); // return Promise<FaqPage>
  return getFaqPage(page, size);
}

export const FAQ_LOADER_ID = "FAQ_LOADER";


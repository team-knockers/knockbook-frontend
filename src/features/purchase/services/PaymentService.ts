import { apiAuthPathWithJson } from "../../../shared/api";
import type { KakaoReadyResponse } from "../type";

export const PaymentService = {

  // Select Kakao redirect URL based on device
  pickKakaoRedirectUrl(data: KakaoReadyResponse): string | undefined {
    const ua = navigator.userAgent;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(ua);
    return (
      (isMobile && (data.next_redirect_app_url || data.next_redirect_mobile_url)) ||
      data.next_redirect_pc_url
    );
  },

  // Redirect to Kakao payment page
  redirectToKakao(data: KakaoReadyResponse) {
    const url = this.pickKakaoRedirectUrl(data);
    if (!url) throw new Error("No redirect URL from KakaoPay");
    window.location.href = url;
  },

  // KakaoPay Ready (authentication required)
  kakaoReady(userId: string | number, orderId: string | number) {
    // POST /users/:userId/orders/:orderId/payments/kakao/ready
    return apiAuthPathWithJson<KakaoReadyResponse, void>(
      "/users/:userId/orders/:orderId/payments/kakao/ready",
      { userId, orderId },
      { method: "POST" }
    );
  },
}
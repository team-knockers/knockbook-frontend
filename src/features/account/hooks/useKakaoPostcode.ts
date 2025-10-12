import { useCallback } from "react";
declare global { interface Window { daum?: any } }

export function useKakaoPostcode() {
  const load = () =>
    new Promise<void>((res, rej) => {
      if (window.daum?.Postcode) { res(); return; }
      const s = document.createElement("script");
      s.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
      s.onload = () => res();
      s.onerror = () => rej(new Error("Failed to load Daum Postcode"));
      document.head.appendChild(s);
    });

  return useCallback(async (onComplete: (d: {
    zonecode: string; address: string; addressType: string; bname?: string; buildingName?: string;
    roadAddress?: string; jibunAddress?: string;
  }) => void) => {
    await load();
    new window.daum.Postcode({ oncomplete: onComplete }).open();
  }, []);
}

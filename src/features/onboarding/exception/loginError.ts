import type { ApiError } from "../../../types/http";

type Variant = "info" | "warn" | "error";

export function parseLoginError(err: ApiError): 
  { msg: string; variant: Variant } {

  const { status = 0, code, detail, title, type } = err.problem;

  const fallback = detail ?? title ?? "오류가 발생했습니다.";

  if (status === 0 || type === "about:blank#network") {
    return { 
      msg: "네트워크 오류입니다. 연결을 확인해 주세요.",
      variant: "error" 
    };
  }
    
  if (code === "AUTH_INVALID" || status === 401) {
    return { 
      msg: detail ?? "이메일 또는 비밀번호가 올바르지 않습니다.",
      variant: "error" 
    };
  }
    
  if (code === "VALIDATION_ERROR" || status === 400) {
    return { 
      msg: "이메일 또는 비밀번호가 유효하지 않습니다",
      variant: "warn"
    };
  }

  if (code === "DB_UNAVAILABLE") {
    return { 
      msg: "일시적인 장애입니다. 잠시 후 다시 시도해 주세요.",
      variant: "error"
    };
  }

  if (code === "SERVER_ERROR" || status >= 500) {
    return { 
      msg: "일시적인 오류입니다. 잠시 후 다시 시도해 주세요.",
      variant: "error"
    };
  }
    
  return { msg: fallback, variant: "error" };
}


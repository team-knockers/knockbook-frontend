import { API_BASE_URL } from "../config";
import type { ProblemDetails } from "../types/http";
import { ApiError } from "../types/http";
import { sessionStore } from "../types/sessionStore";

// JSON Request without authentication header 
// (public, no authentication required)
export function apiPublicJson<TRes, TBody = unknown>(
  url: string,
  init?: RequestInit & { json?: TBody }) {
    return requestJson<TRes, TBody>(url, init);
}

// JSON Request with Authorization 
// (Bearer <token> header + one automatic 401 refresh)
export async function apiAuthJson<TRes, TBody = unknown>(
  url: string,
  init?: RequestInit & { json?: TBody },
  retried = false
): Promise<TRes> {
  const token = sessionStore.getToken();
  const withAuth: RequestInit = {
    ...init,
    headers: { 
      ...(init?.headers ?? {}),
      Authorization: token ? `Bearer ${token}` : "",
    },
  };

  try {
    return await requestJson<TRes,TBody>(url, withAuth);
  } catch (e) {
    // On 401, refresh once → retry if refresh succeeds
    if (e instanceof ApiError && e.problem.status === 401 && !retried) {
        await tryRefereshAccessToken();
        return apiAuthJson<TRes, TBody>(url, init, true);
    }
    throw e;
  }
}

// Issue a new access token using the refresh cookie
async function tryRefereshAccessToken() {
  const res = await doFetch("/auth/token/refresh", { method: "POST" });
  await ensureOK(res);
  const data = (await res.json()) as { accessToken: string };
  sessionStore.updateToken(data.accessToken);
}

// Low-level fetch with credentials included 
// (needed for refresh cookie handling)
async function doFetch(url: string, init: RequestInit = {}) {
  return fetch(`${API_BASE_URL}${url}`, {
    credentials: "include", // Required when using the refresh cookie
    headers: { "Content-Type": "application/json", ...init.headers },
    ...init,
  });
}

// Ensures RFC 7807 / 9457-compliant error response
async function ensureOK(res: Response): Promise<Response> {
  if (res.ok) {
    return res;
  }
  const problem: ProblemDetails = await res.json().catch(() => ({
    type: "about:blank",
    title: res.status,
    status: res.status,
  }));
  throw new ApiError(problem);
}

// Generic JSON request (safe for both request and response bodies)
export async function requestJson<TRes, TBody = unknown>(
  url: string,
  init?: RequestInit & { json?: TBody }
) : Promise<TRes> {
  
  let finalInit: RequestInit = init ?? {};
  if ("json" in (init ?? {}) && init?.json !== undefined) {
    finalInit = { ...finalInit, body: JSON.stringify(init.json) };
  }
  
  const res = await doFetch(url, finalInit);
  await ensureOK(res);
  if (res.status === 204) {
    return undefined as unknown as TRes;
  }
  return res.json() as Promise<TRes>;
}


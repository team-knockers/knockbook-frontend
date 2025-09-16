import { API_BASE_URL } from "../config";
import type { ProblemDetails } from "../types/http";
import { ApiError } from "../types/http";
import { sessionStore } from "../types/sessionStore";

//#region Public API
// JSON Request without authentication header 
// (public, no authentication required)
export function apiPublicJson<TRes, TBody = unknown>(
  url: string,
  init?: RequestInit & { json?: TBody }) {
    return requestJson<TRes, TBody>(url, init);
}

// use path parameter
export function apiPublicPath<TRes>(
  tpl: string,
  path: Record<string, string | number>,
  init?: RequestInit
) {
  return apiPublicJson<TRes>(buildPath(tpl, path), init);
}

// use path parameter with query
export function apiPublicPathAndQuery<TRes>(
  tpl: string,
  path: Record<string, string | number> = {},
  q?: Record<string, any>,
  init?: RequestInit
) {
  return apiPublicJson<TRes>(withQuery(buildPath(tpl, path), q), init);
}

//#endregion

//#region Auth API
// JSON Request with Authorization 
// (Bearer <token> header + one automatic 401 refresh)
export async function apiAuthJson<TRes, TBody = unknown>(
  url: string,
  init?: RequestInit & { json?: TBody },
  retried = false
): Promise<TRes> {
  const token = sessionStore.getAccessToken();
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

export function apiAuthPath<TRes>(
  tpl: string,
  path: Record<string, string | number>,
  init?: RequestInit
) {
  return apiAuthJson<TRes>(buildPath(tpl, path), init);
}

// Auth + Query
export function apiAuthPathAndQuery<TRes>(
  tpl: string,
  path: Record<string, string | number> = {},
  q?: Record<string, any>,
  init?: RequestInit
) {
  return apiAuthJson<TRes>(withQuery(buildPath(tpl, path), q), init);
}

//#endregion

//#region URL helpers
export function buildPath(
  tpl: string,
  path: Record<string, string | number>) {
  return tpl.replace(/\{(\w+)\}|:(\w+)/g, (_, a, b) =>
    encodeURIComponent(String(path[a ?? b]))
  );
}

export function buildQuery(
  q?: Record<string, any>) {
  if (!q) { return ""; }
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(q)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v)) v.forEach(x => sp.append(k, String(x)));
    else sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export function withQuery(
  path: string,
  q?: Record<string, any>) {
  return `${path}${buildQuery(q)}`;
}
//#endregion

//#region implementations 
// Issue a new access token using the refresh cookie
async function tryRefereshAccessToken() {
  const res = await doFetch("/auth/token/refresh", { method: "POST" });
  await ensureOK(res);
  const data = (await res.json()) as { accessToken: string };
  sessionStore.updateAccessToken(data.accessToken);
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
//#endregion

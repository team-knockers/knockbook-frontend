import { UserService } from "../features/account/services/UserService";
import type { UserProfile } from "../features/account/types";
import { apiPublicJson } from "./api";

let _accessToken: string | undefined;
let _userId: string | undefined;
let _me: UserProfile | undefined;

let _refreshInflight: Promise<{ accessToken: string; userId: string }> | null = null;
let _profileInflight: { userId: string; p: Promise<UserProfile> } | null = null;

const setAccessToken = (t: string) => { _accessToken = t; };

const setUserId = (id: string) => {
  if (_userId !== id) {
    _userId = id;
    _me = undefined; 
    _profileInflight = null;
  }
};

const setUser = (user?: UserProfile) => { _me = user; };

export const clearAuth = () => {
  _accessToken = undefined;
  _userId = undefined;
  _me = undefined;
  _refreshInflight = null;
  _profileInflight = null;
};

export const getAccessToken = () => _accessToken;

async function refreshAuth(): Promise<{ accessToken: string; userId: string }> {
  if (!_refreshInflight) {
    _refreshInflight = (async () => {
      const res = await apiPublicJson<{ accessToken: string; userId: string }>(
        "/auth/token/refresh",
        { method: "POST" }
      );
      setAccessToken(res.accessToken);
      setUserId(res.userId);
      return res;
    })().finally(() => { _refreshInflight = null; });
  }
  return _refreshInflight;
}

export async function ensureAuth()
: Promise<{ accessToken: string; userId: string }> {
  if (_accessToken && _userId) {
    return { accessToken: _accessToken, userId: _userId };
  }
  return refreshAuth();
}

export async function ensureUser(): Promise<UserProfile> {
  const { userId } = await ensureAuth();

  if (_me) { return _me; }

  if (_profileInflight && _profileInflight.userId === userId) {
    return _profileInflight.p;
  }

  const p = (async () => {
    const snapshotId = userId;
    const user = await UserService.getProfile(snapshotId);
    if (_userId === snapshotId) {
      setUser(user);
    }
    return user;
  })();
  _profileInflight = { userId, p };
  try {
    return await p;
  } finally {
    if (_profileInflight?.userId === userId) {
      _profileInflight = null;
    }
  }
}

export async function ensureAccessToken(): Promise<string> {
  const { accessToken } = await ensureAuth();
  if (!accessToken) { throw new Error("NO_TOKEN"); }
  return accessToken;
}

export async function ensureUserId(): Promise<string> {
  const { userId } = await ensureAuth();
  if (!userId) { throw new Error("NO_USER"); }
  return userId;
}

export async function resetAuthCacheForLogin(newToken: string, newUserId: string) {
  setAccessToken(newToken);
  setUserId(newUserId);
  try { await ensureUser(); } catch {}
}

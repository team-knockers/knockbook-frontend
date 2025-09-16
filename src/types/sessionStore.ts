interface SessionState {
  accessToken: string | null;
  userId: string | null;

  init(token: string, id: string) : void;
  updateToken(token: string) : void;
  getToken(): string | null;
  getUserId(): string | null;
  clear(): void;
  isAuthenticated() : boolean;
}

export const sessionStore : SessionState = {
  accessToken: null,
  userId: null,

  init(token: string, id: string) {
    this.accessToken = token;
    this.userId = id;
  },

  updateToken(token: string) {
    this.accessToken = token;
  },

  getToken() {
    return this.accessToken;
  },

  getUserId() {
    return this.userId;
  },

  clear() {
    this.accessToken = null;
    this.userId = null;
  },

  isAuthenticated() {
    return !!this.accessToken;
  },
};
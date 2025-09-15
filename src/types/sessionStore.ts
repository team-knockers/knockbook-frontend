export const sessionStore = {
  accessToken: null as string | null,
  userId: null as string | null,

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
  }
};
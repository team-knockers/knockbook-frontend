interface SessionState {
  accessToken: string | null;
  emailVerificationToken: string | null;
  registrationToken: string | null;
  userId: string | null;

  init(token: string, id: string) : void;
  updateAccessToken(token: string) : void;
  getAccessToken(): string | null;
  setEmailVerificationToken(token: string) : void;
  getEmailVerificationToken() : string | null;
  setRegistrationToken(token: string) : void;
  getRegistrationToken() : string | null;
  clear() : void;

  getUserId(): string | null;
  isAuthenticated() : boolean;
}

export const sessionStore : SessionState = {
  accessToken: null,
  userId: null,
  emailVerificationToken: null,
  registrationToken: null,

  init(token: string, id: string) {
    this.accessToken = token;
    this.userId = id;
  },

  updateAccessToken(token: string) {
    this.accessToken = token;
  },

  getAccessToken() {
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

  setEmailVerificationToken(token: string): void {
    this.emailVerificationToken = token;
  },

  getEmailVerificationToken(): string | null {
    return this.emailVerificationToken;
  },

  setRegistrationToken(token: string): void {
    this.registrationToken = token;
  },

  getRegistrationToken(): string | null {
    return this.registrationToken;
  }
};

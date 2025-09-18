import { create } from 'zustand';

interface SessionState {
  accessToken: string | null;
  emailVerificationToken: string | null;
  registrationToken: string | null;
  userId: string | null;

  init: (token: string, id: string) => void;
  updateAccessToken: (token: string) => void;
  setEmailVerificationToken: (t: string|null) => void;
  setRegistrationToken: (t: string|null) => void;
  clear: () => void;
  isAuthenticated: () => boolean;
}

export const useSession = create<SessionState>((set, get) => ({
  accessToken: null,
  emailVerificationToken: null,
  registrationToken: null,
  userId: null,
  init: (token, id) => set({ 
    accessToken: token,
    userId: id }),
  updateAccessToken: (token) => set({ accessToken: token }),
  setEmailVerificationToken: (t) => set({ emailVerificationToken: t }),
  setRegistrationToken: (t) => set({ registrationToken: t }),
  clear: () => set({ 
    accessToken: null,
    userId: null,
    emailVerificationToken: null,
    registrationToken: null }),
  isAuthenticated: () => !!get().accessToken,
}));
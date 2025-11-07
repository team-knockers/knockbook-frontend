import { create } from "zustand";

type SignupFlowState = {
  email?: string;
  password?: string;
  displayName?: string;
  emailVerificationToken?: string;
  registrationToken?: string;

  setEmail: (v?: string) => void;
  setPassword: (v?: string) => void;
  setDisplayName: (v?: string) => void;
  setVerificationToken: (v?: string) => void;
  setRegistrationToken: (v?: string) => void;
  reset: (opts?: { keepEmail?: boolean }) => void;
};

export const useSignupFlow = create<SignupFlowState>((set, get) => ({
  setEmail: (v) => set({ email: v }),
  setPassword: (v) => set({ password: v }),
  setDisplayName: (v) => set({ displayName: v }),
  setVerificationToken: (v) => set({ emailVerificationToken: v }),
  setRegistrationToken: (v) => set({ registrationToken: v }),
  reset: ({ keepEmail } = {}) => {
    const email = keepEmail ? get().email : undefined;
    set({
      email,
      password: undefined,
      displayName: undefined,
      emailVerificationToken: undefined,
      registrationToken: undefined,
    });
  },
}));

import { create } from 'zustand';

interface SignupFlowState {
  email: string;
  password: string;
  displayName: string;
  setEmail: (email: string) => void;
  setPassword: (pw: string) => void;
  setDisplayName: (name: string) => void;
  reset: () => void;
}

export const useSignupFlow = create<SignupFlowState>((set) => ({
  email: '',
  password: '',
  displayName: '',
  setEmail: email => set({ email: email }),
  setPassword: pw => set({ password: pw }),
  setDisplayName: name => set({ displayName: name}),
  reset: () => set({password: '', displayName: '' }),
}));

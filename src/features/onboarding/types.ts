export type GetCodeRequest = {
  email: string;
}

export type GetCodeResponse = {
  EmailVerificationToken: string;
  code: string;
}

export type SendCodeRequest = {
  EmailVerificationToken: string;
  code: string;
}

export type SendCodeResponse = {
  registrationToken: string;
}

export type LoginRequest = { 
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  userId: string;
};

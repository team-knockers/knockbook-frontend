export type GetCodeRequest = {
  email: string;
}

export type GetCodeResponse = {
  emailVerificationToken: string;
}

export type SendCodeRequest = {
  emailVerificationToken: string;
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

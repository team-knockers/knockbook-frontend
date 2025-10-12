export type GetMyProfileResponse = {
  displayName: string;
  email: string;
}

export type ChangePasswordRequest = {
  password: string;
}

export type VerifyPasswordRequest = {
  password: string;
}

export type Address = {
  id: string;
  userId: string;
  label: string;
  recipientName: string;
  phone: string;
  postalCode: string;
  address1: string;
  address2: string;
  entryInfo: string;
  deliveryMemo: string;
  isDefault: boolean;
}

export type InsertAddressRequest = {
  recipientName: string;
  phone: string;
  postalCode: string;
  address1: string;
  address2?: string;
  label: string;
  entryInfo?: string;
  deliveryMemo?: string;
  isDefault: boolean;
}

export type UpdateAddressRequest = {
  recipientName: string;
  phone: string;
  postalCode: string;
  address1: string;
  address2?: string;
  label: string;
  entryInfo?: string;
  deliveryMemo?: string;
  isDefault: boolean;
}


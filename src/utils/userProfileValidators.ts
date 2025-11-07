export const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&+=])[A-Za-z\d@$!%*?&+=]{8,12}$/;

export const DISPLAYNAME_REGEX = /^[A-Za-z가-힣]{2,10}$/;

export function isPasswordValid(value: string) {
  return value.length > 0 && PASSWORD_REGEX.test(value);
}

export function checkPasswordLength(value: string) {
  return /^.{8,12}$/.test(value);
}

export function checkPasswordAlphaLetter(value: string) {
  return /[A-Za-z]/.test(value);
}

export function checkPasswordDigit(value: string) {
  return /\d/.test(value);
}

export function checkPasswordSpecialLetter(value: string) {
  return /[@$!%*?&+=]/.test(value);
}

export function isDisplayNameValid(value: string) {
  return value.length > 0 && DISPLAYNAME_REGEX.test(value);
}

export function checkDisplayNameLength(value: string) {
  return /^.{2,10}$/.test(value);
}

export function checkDisplayNameLetter(value: string) {
  return /^[A-Za-z가-힣]+$/.test(value);
}


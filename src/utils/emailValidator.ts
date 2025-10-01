export function isValidEmail(email: string): boolean {
  // RFC 5322
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

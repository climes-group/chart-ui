export function isValidPhone(value) {
  if (!value) return false;
  const digits = value.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) return true;
  return digits.length === 10;
}

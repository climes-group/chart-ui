export function formatDate(value, locale, options) {
  if (value === null || value === undefined || value === "") return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(locale, options).format(date);
}

export function formatNumber(value, locale, options) {
  if (value === null || value === undefined || value === "") return "";
  const num = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(num)) return "";
  return new Intl.NumberFormat(locale, options).format(num);
}

export function formatPhone(value) {
  if (!value) return "";
  const digits = String(value).replace(/\D/g, "");
  const local = digits.length === 11 && digits.startsWith("1")
    ? digits.slice(1)
    : digits;
  if (local.length !== 10) return value;
  return `${local.slice(0, 3)}-${local.slice(3, 6)}-${local.slice(6)}`;
}

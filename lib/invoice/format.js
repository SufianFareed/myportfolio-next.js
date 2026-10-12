const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const pad = (n) => String(n).padStart(2, "0");

export function toISO(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function todayISO() {
  return toISO(new Date());
}

export function isISODate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value || "");
}

export function addDaysISO(iso, days) {
  if (!isISODate(iso)) return todayISO();
  const [y, m, d] = iso.split("-").map(Number);
  return toISO(new Date(y, m - 1, d + days));
}

export function diffDaysISO(fromISO, toISOValue) {
  if (!isISODate(fromISO) || !isISODate(toISOValue)) return 0;
  const [y1, m1, d1] = fromISO.split("-").map(Number);
  const [y2, m2, d2] = toISOValue.split("-").map(Number);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000);
}

export function formatDate(iso) {
  if (!isISODate(iso)) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return `${pad(d)} ${MONTHS[m - 1]} ${y}`;
}

// Amounts are handled as integer "minor units" (paisa/cents) everywhere,
// so there is no floating point drift in totals.
export function formatNumber(minor) {
  const abs = Math.abs(minor);
  const whole = Math.floor(abs / 100);
  const frac = pad(abs % 100);
  return `${whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.${frac}`;
}

export function formatMoney(minor, currency) {
  const sign = minor < 0 ? "-" : "";
  return `${sign}${currency} ${formatNumber(minor)}`;
}

export function trimNumber(n, maxDecimals = 3) {
  return String(parseFloat(Number(n).toFixed(maxDecimals)));
}

// jsPDF's built-in fonts only cover WinAnsi (Latin) characters.
// Anything else would come out garbled, so we detect and replace it.
const UNSUPPORTED = /[^\t\n\r\x20-\x7E\xA0-\xFF\u2018\u2019\u201C\u201D\u2013\u2014\u2022\u2026\u20AC\u2122]/g;

export function hasUnsupportedChars(value) {
  UNSUPPORTED.lastIndex = 0;
  return UNSUPPORTED.test(String(value ?? ""));
}

export function sanitizePdfText(value) {
  return String(value ?? "").replace(UNSUPPORTED, "?");
}

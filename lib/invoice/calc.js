const MAX = 1e12;

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
const round = (n) => Math.round(parseFloat(n.toFixed(6)));

export const isBlank = (v) => v === null || v === undefined || String(v).trim() === "";

export function toNumber(v) {
  if (isBlank(v)) return 0;
  const n = Number(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function isValidNumber(v) {
  return isBlank(v) || Number.isFinite(Number(String(v).replace(/,/g, "")));
}

export function toMinor(v) {
  return round(clamp(toNumber(v), -MAX, MAX) * 100);
}

export function fromMinor(minor) {
  return (minor / 100).toFixed(2);
}

export function computeLine(item) {
  const qty = clamp(toNumber(item.qty), 0, MAX);
  const priceMinor = Math.max(0, toMinor(item.price));
  const gross = round(qty * priceMinor);
  const discPct = clamp(toNumber(item.discountPct), 0, 100);
  const discount = round((gross * discPct) / 100);
  return { qty, priceMinor, gross, discPct, discount, total: gross - discount };
}

export function isBlankItem(item) {
  return isBlank(item.description) && toNumber(item.price) === 0 && toNumber(item.discountPct) === 0;
}

export function getOutputItems(invoice) {
  return invoice.items.filter((item) => !isBlankItem(item));
}

export function computeTotals(invoice) {
  const subtotal = getOutputItems(invoice).reduce((sum, item) => sum + computeLine(item).total, 0);

  const discountPct = clamp(toNumber(invoice.discountPct), 0, 100);
  const pctDiscount = round((subtotal * discountPct) / 100);
  const fixedDiscount = Math.max(0, toMinor(invoice.discountFixed));
  const discountTotal = Math.min(pctDiscount + fixedDiscount, subtotal);

  const taxable = subtotal - discountTotal;
  const taxPct = clamp(toNumber(invoice.taxPct), 0, 100);
  const tax = round((taxable * taxPct) / 100);
  const fees = Math.max(0, toMinor(invoice.fees));

  const total = taxable + tax + fees;
  const paid = Math.max(0, toMinor(invoice.amountPaid));
  const balance = total - paid;

  return { subtotal, discountPct, pctDiscount, fixedDiscount, discountTotal, taxable, taxPct, tax, fees, total, paid, balance };
}

// "Unpaid" invoices past their due date are treated as Overdue automatically.
export function effectiveStatus(invoice, totals, today) {
  if (invoice.status === "Unpaid" && invoice.dueDate && invoice.dueDate < today && totals.balance > 0) {
    return "Overdue";
  }
  return invoice.status;
}

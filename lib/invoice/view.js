import { computeLine, computeTotals, effectiveStatus, getOutputItems, isBlank } from "./calc";
import { formatDate, formatMoney, todayISO, trimNumber } from "./format";

const lines = (text) =>
  String(text || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

// One shared "what goes on the invoice" model, used by both the HTML
// preview and the PDF so they always show exactly the same content.
export function buildView(invoice, profile, today = todayISO()) {
  const cur = invoice.currency;
  const money = (minor) => formatMoney(minor, cur);
  const totals = computeTotals(invoice);
  const status = effectiveStatus(invoice, totals, today);

  const items = getOutputItems(invoice).map((item) => {
    const line = computeLine(item);
    return {
      description: item.description.trim() || "(no description)",
      qty: trimNumber(line.qty),
      unit: money(line.priceMinor),
      discount: line.discPct > 0 ? `${trimNumber(line.discPct, 2)}%` : "",
      amount: money(line.total),
    };
  });

  const rows = [{ key: "subtotal", label: "Subtotal", value: money(totals.subtotal) }];
  if (totals.discountTotal > 0) {
    const parts = [];
    if (totals.discountPct > 0) parts.push(`${trimNumber(totals.discountPct, 2)}%`);
    if (totals.fixedDiscount > 0) parts.push(money(totals.fixedDiscount));
    rows.push({ key: "discount", label: `Discount (${parts.join(" + ")})`, value: `-${money(totals.discountTotal)}` });
  }
  if (totals.taxPct > 0) rows.push({ key: "tax", label: `Tax (${trimNumber(totals.taxPct, 2)}%)`, value: money(totals.tax) });
  if (totals.fees > 0) rows.push({ key: "fees", label: "Additional fees", value: money(totals.fees) });
  rows.push({ key: "total", label: "Total", value: money(totals.total), strong: true });
  if (totals.paid > 0) rows.push({ key: "paid", label: "Amount paid", value: `-${money(totals.paid)}` });

  const pay = profile.payment;
  const paymentRows = [
    ["Bank", pay.bankName],
    ["Account title", pay.accountTitle],
    ["Account no.", pay.accountNumber],
    ["IBAN", pay.iban],
    ["Easypaisa / JazzCash", pay.wallet],
  ]
    .filter(([, value]) => !isBlank(value))
    .map(([label, value]) => ({ label, value: value.trim() }));

  const fromLines = [
    ...lines(profile.address),
    profile.country.trim(),
    profile.email.trim(),
    profile.phone.trim(),
    profile.website.trim(),
    profile.taxId.trim() ? `Tax reg. no: ${profile.taxId.trim()}` : "",
  ].filter(Boolean);

  const c = invoice.client;
  const billLines = [
    c.company.trim(),
    ...lines(c.address),
    c.email.trim(),
    c.phone.trim(),
    c.website.trim(),
  ].filter(Boolean);

  const details = [
    { label: "Issue date", value: formatDate(invoice.issueDate) },
    { label: "Due date", value: formatDate(invoice.dueDate) },
    ...(isBlank(invoice.poNumber) ? [] : [{ label: "PO number", value: invoice.poNumber.trim() }]),
    { label: "Status", value: status, tone: status },
    { label: "Currency", value: cur },
  ];

  const footerBits = [profile.name.trim(), profile.email.trim(), profile.website.trim()].filter(Boolean);

  return {
    number: invoice.number.trim(),
    status,
    currency: cur,
    business: {
      name: profile.name.trim() || "Your business",
      profession: profile.profession.trim(),
      logo: profile.logo,
      lines: fromLines,
    },
    billTo: { name: c.name.trim() || "Client name", lines: billLines },
    details,
    hasDiscountColumn: items.some((i) => i.discount),
    items,
    totals: rows,
    balance: {
      label: totals.balance < 0 ? "Credit balance" : "Balance due",
      value: money(totals.balance),
      isPaid: totals.balance <= 0,
    },
    payment: { rows: paymentRows, custom: pay.custom.trim() },
    notes: invoice.notes.trim(),
    terms: invoice.terms.trim(),
    thankYou: invoice.thankYou.trim(),
    footer: footerBits.join("  |  "),
    raw: totals,
  };
}

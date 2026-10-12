import { formatDate, formatMoney } from "./format";
import { computeTotals } from "./calc";
import { effectiveStatus } from "./calc";
import { todayISO } from "./format";

export function invoiceSummary(invoice, profile) {
  const totals = computeTotals(invoice);
  const cur = invoice.currency;
  const status = effectiveStatus(invoice, totals, todayISO());
  const clientLine = [invoice.client.name, invoice.client.company].filter(Boolean).join(" - ");
  const rows = [
    `Invoice ${invoice.number}`,
    `From: ${profile.name}`,
    clientLine ? `To: ${clientLine}` : "",
    `Issue date: ${formatDate(invoice.issueDate)}`,
    `Due date: ${formatDate(invoice.dueDate)}`,
    `Total: ${formatMoney(totals.total, cur)}`,
    totals.paid > 0 ? `Paid: ${formatMoney(totals.paid, cur)}` : "",
    `Balance due: ${formatMoney(totals.balance, cur)}`,
    `Status: ${status}`,
  ];
  const pay = profile.payment;
  const payRows = [
    pay.bankName && `Bank: ${pay.bankName}`,
    pay.accountTitle && `Account title: ${pay.accountTitle}`,
    pay.accountNumber && `Account no.: ${pay.accountNumber}`,
    pay.iban && `IBAN: ${pay.iban}`,
    pay.wallet && `Easypaisa / JazzCash: ${pay.wallet}`,
  ].filter(Boolean);
  if (payRows.length) rows.push("", "Payment details:", ...payRows);
  return rows.filter((r, i, arr) => r !== "" || (arr[i - 1] !== "" && i !== 0)).join("\n");
}

export function emailLink(invoice, profile) {
  const subject = `Invoice ${invoice.number} from ${profile.name}`;
  const body = `Hello${invoice.client.name ? ` ${invoice.client.name}` : ""},\n\nHere is a summary of invoice ${invoice.number}.\n\n${invoiceSummary(invoice, profile)}\n\nThe full invoice PDF is attached separately.\n\nRegards,\n${profile.name}`;
  const to = encodeURIComponent((invoice.client.email || "").trim());
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function whatsappLink(invoice, profile) {
  const text = `Hello${invoice.client.name ? ` ${invoice.client.name}` : ""}, invoice ${invoice.number} from ${profile.name}.\n\n${invoiceSummary(invoice, profile)}`;
  const phone = (invoice.client.phone || "").trim();
  // Only use the client's number when it already has an international prefix.
  const digits = phone.startsWith("+") || phone.startsWith("00") ? phone.replace(/\D/g, "").replace(/^00/, "") : "";
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const el = document.createElement("textarea");
      el.value = text;
      el.setAttribute("readonly", "");
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(el);
      return ok;
    } catch {
      return false;
    }
  }
}

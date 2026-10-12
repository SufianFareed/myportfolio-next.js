import { isBlank, isValidNumber, toNumber, getOutputItems, computeTotals } from "./calc";
import { hasUnsupportedChars } from "./format";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const URL_RE = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/i;
const LIMIT = 1e9;

// Returns { errors: { key: { message, required } }, warnings: [string] }
// `required` errors only show after the user tries to save/export.
export function validate(invoice, profile, { strict = true } = {}) {
  const errors = {};
  const add = (key, message, required = false) => {
    if (!errors[key]) errors[key] = { message, required };
  };

  if (isBlank(invoice.number)) add("number", "Invoice number is required.", true);
  if (isBlank(invoice.issueDate)) add("issueDate", "Issue date is required.", true);
  if (invoice.issueDate && invoice.dueDate && invoice.dueDate < invoice.issueDate) {
    add("dueDate", "Due date cannot be before the issue date.");
  }

  if (strict) {
    if (isBlank(profile.name)) add("business.name", "Business name is required.", true);
    if (isBlank(invoice.client.name)) add("client.name", "Client name is required.", true);
    if (isBlank(invoice.dueDate)) add("dueDate", "Due date is required.", true);
    if (getOutputItems(invoice).length === 0) add("items", "Add at least one line item.", true);
  }

  if (!isBlank(profile.email) && !EMAIL_RE.test(profile.email.trim())) add("business.email", "Enter a valid email address.");
  if (!isBlank(invoice.client.email) && !EMAIL_RE.test(invoice.client.email.trim())) add("client.email", "Enter a valid email address.");
  if (!isBlank(profile.website) && !URL_RE.test(profile.website.trim())) add("business.website", "Enter a valid website URL.");
  if (!isBlank(invoice.client.website) && !URL_RE.test(invoice.client.website.trim())) add("client.website", "Enter a valid website URL.");

  invoice.items.forEach((item) => {
    const blank = isBlank(item.description) && toNumber(item.price) === 0 && toNumber(item.discountPct) === 0;
    const k = `item.${item.id}`;
    if (!isValidNumber(item.qty) || toNumber(item.qty) < 0) add(`${k}.qty`, "Quantity must be 0 or more.");
    else if (toNumber(item.qty) > LIMIT) add(`${k}.qty`, "Quantity is too large.");
    if (!isValidNumber(item.price) || toNumber(item.price) < 0) add(`${k}.price`, "Price must be 0 or more.");
    else if (toNumber(item.price) > LIMIT) add(`${k}.price`, "Price is too large.");
    if (!isValidNumber(item.discountPct) || toNumber(item.discountPct) < 0 || toNumber(item.discountPct) > 100) {
      add(`${k}.discountPct`, "Discount must be 0 to 100%.");
    }
    if (!blank) {
      if (isBlank(item.description)) add(`${k}.description`, "Description is required.", true);
      if (strict && isBlank(item.qty)) add(`${k}.qty`, "Quantity is required.", true);
      if (strict && toNumber(item.qty) === 0 && isValidNumber(item.qty)) add(`${k}.qty`, "Quantity must be above 0.", true);
    }
  });

  const pct = (key, value, label) => {
    if (!isValidNumber(value) || toNumber(value) < 0 || toNumber(value) > 100) add(key, `${label} must be 0 to 100%.`);
  };
  const money = (key, value, label) => {
    if (!isValidNumber(value) || toNumber(value) < 0) add(key, `${label} must be 0 or more.`);
    else if (toNumber(value) > LIMIT) add(key, `${label} is too large.`);
  };
  pct("discountPct", invoice.discountPct, "Discount");
  pct("taxPct", invoice.taxPct, "Tax");
  money("discountFixed", invoice.discountFixed, "Fixed discount");
  money("fees", invoice.fees, "Additional fees");
  money("amountPaid", invoice.amountPaid, "Amount paid");

  const warnings = [];
  const totals = computeTotals(invoice);
  if (totals.paid > totals.total && totals.total > 0) warnings.push("Amount paid is higher than the invoice total.");
  const pdfTexts = [
    profile.name, profile.profession, profile.address, profile.country, profile.taxId,
    invoice.client.name, invoice.client.company, invoice.client.address, invoice.notes, invoice.terms, invoice.thankYou,
    ...Object.values(profile.payment), ...invoice.items.map((i) => i.description),
  ];
  if (pdfTexts.some(hasUnsupportedChars)) {
    warnings.push("Some characters (for example Urdu, Arabic or emoji) cannot be shown in the PDF and will appear as ?. Use English text for PDF output.");
  }

  return { errors, warnings };
}

export function visibleErrors(errors, showRequired) {
  const out = {};
  for (const [key, value] of Object.entries(errors)) {
    if (!value.required || showRequired) out[key] = value.message;
  }
  return out;
}

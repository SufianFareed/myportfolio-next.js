"use client";

import { useRef } from "react";
import { CURRENCIES, STATUSES, SERVICE_SUGGESTIONS } from "@/lib/invoice/constants";
import { computeLine } from "@/lib/invoice/calc";
import { formatMoney } from "@/lib/invoice/format";
import { Field, Icon, Section } from "./ui";

const has = (errors, prefix) => Object.keys(errors).some((k) => k === prefix || k.startsWith(`${prefix}.`) || k.startsWith(prefix));

export default function EditorForm({
  profile, invoice, view, errors, status,
  onProfile, onPayment, onInvoice, onClient, onItem, onAddItem, onRemoveItem, onCurrency, onLogoFile, onLogoRemove, logoError,
}) {
  const fileRef = useRef(null);
  const e = errors;
  const itemErr = Object.keys(e).some((k) => k === "items" || k.startsWith("item."));

  return (
    <div className="inv-editor">
      <Section title="Invoice details" defaultOpen hasError={has(e, "number") || has(e, "issueDate") || has(e, "dueDate")}>
        <div className="inv-grid">
          <Field label="Invoice number" error={e.number}>
            <input type="text" value={invoice.number} onChange={(ev) => onInvoice({ number: ev.target.value })} maxLength={40} />
          </Field>
          <Field label="Status" hint={status !== invoice.status ? `Past its due date, so it shows as ${status}.` : undefined}>
            <select className="inv-select" value={invoice.status} onChange={(ev) => onInvoice({ status: ev.target.value })}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Issue date" error={e.issueDate}>
            <input type="date" value={invoice.issueDate} onChange={(ev) => onInvoice({ issueDate: ev.target.value })} />
          </Field>
          <Field label="Due date" error={e.dueDate}>
            <input type="date" value={invoice.dueDate} onChange={(ev) => onInvoice({ dueDate: ev.target.value })} />
          </Field>
          <Field label="Currency">
            <select className="inv-select" value={invoice.currency} onChange={(ev) => onCurrency(ev.target.value)}>
              {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="PO number (optional)">
            <input type="text" value={invoice.poNumber} onChange={(ev) => onInvoice({ poNumber: ev.target.value })} maxLength={40} />
          </Field>
        </div>
      </Section>

      <Section title="Client details" defaultOpen hasError={has(e, "client")}>
        <div className="inv-grid">
          <Field label="Client name" error={e["client.name"]}>
            <input type="text" value={invoice.client.name} onChange={(ev) => onClient({ name: ev.target.value })} maxLength={120} autoComplete="off" />
          </Field>
          <Field label="Company">
            <input type="text" value={invoice.client.company} onChange={(ev) => onClient({ company: ev.target.value })} maxLength={120} />
          </Field>
          <Field label="Email" error={e["client.email"]}>
            <input type="email" value={invoice.client.email} onChange={(ev) => onClient({ email: ev.target.value })} maxLength={120} />
          </Field>
          <Field label="Phone" hint="Add the country code (e.g. +92) to message them on WhatsApp directly.">
            <input type="tel" value={invoice.client.phone} onChange={(ev) => onClient({ phone: ev.target.value })} maxLength={40} />
          </Field>
          <Field label="Website" error={e["client.website"]}>
            <input type="text" value={invoice.client.website} onChange={(ev) => onClient({ website: ev.target.value })} maxLength={120} />
          </Field>
          <Field label="Billing address" className="inv-span">
            <textarea rows={3} value={invoice.client.address} onChange={(ev) => onClient({ address: ev.target.value })} maxLength={400} />
          </Field>
        </div>
      </Section>

      <Section title="Line items" defaultOpen hasError={itemErr}>
        {e.items && <p className="inv-inline-error" role="alert">{e.items}</p>}
        <datalist id="inv-services">
          {SERVICE_SUGGESTIONS.map((s) => <option value={s} key={s} />)}
        </datalist>
        <div className="inv-items">
          {invoice.items.map((item, index) => {
            const line = computeLine(item);
            const k = `item.${item.id}`;
            return (
              <div className="inv-item" key={item.id}>
                <div className="inv-item__num" aria-hidden="true">{index + 1}</div>
                <Field label="Description" error={e[`${k}.description`]} className="inv-item__desc">
                  <textarea
                    rows={2}
                    list="inv-services"
                    value={item.description}
                    onChange={(ev) => onItem(item.id, { description: ev.target.value })}
                    placeholder="Service or product"
                    maxLength={1000}
                  />
                </Field>
                <Field label="Qty" error={e[`${k}.qty`]}>
                  <input type="number" inputMode="decimal" min="0" step="any" value={item.qty} onChange={(ev) => onItem(item.id, { qty: ev.target.value })} />
                </Field>
                <Field label="Unit price" error={e[`${k}.price`]}>
                  <input type="number" inputMode="decimal" min="0" step="any" value={item.price} onChange={(ev) => onItem(item.id, { price: ev.target.value })} placeholder="0.00" />
                </Field>
                <Field label="Disc. %" error={e[`${k}.discountPct`]}>
                  <input type="number" inputMode="decimal" min="0" max="100" step="any" value={item.discountPct} onChange={(ev) => onItem(item.id, { discountPct: ev.target.value })} placeholder="0" />
                </Field>
                <div className="inv-item__total">
                  <span className="field__label">Line total</span>
                  <strong>{formatMoney(line.total, invoice.currency)}</strong>
                </div>
                <button type="button" className="inv-iconbtn inv-item__remove" onClick={() => onRemoveItem(item.id)} aria-label={`Remove item ${index + 1}`}>
                  <Icon name="trash" />
                </button>
              </div>
            );
          })}
        </div>
        <div className="inv-items__actions">
          <button type="button" className="inv-btn" onClick={() => onAddItem("")}><Icon name="plus" /> Add item</button>
          <select className="inv-select inv-select--inline" aria-label="Quick add a common service" value="" onChange={(ev) => ev.target.value && onAddItem(ev.target.value)}>
            <option value="">Quick add a service...</option>
            {SERVICE_SUGGESTIONS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </Section>

      <Section title="Discounts, tax and payments" defaultOpen hasError={["discountPct", "discountFixed", "taxPct", "fees", "amountPaid"].some((x) => e[x])}>
        <div className="inv-grid">
          <Field label="Discount (%)" error={e.discountPct}>
            <input type="number" inputMode="decimal" min="0" max="100" step="any" value={invoice.discountPct} onChange={(ev) => onInvoice({ discountPct: ev.target.value })} placeholder="0" />
          </Field>
          <Field label={`Fixed discount (${invoice.currency})`} error={e.discountFixed}>
            <input type="number" inputMode="decimal" min="0" step="any" value={invoice.discountFixed} onChange={(ev) => onInvoice({ discountFixed: ev.target.value })} placeholder="0.00" />
          </Field>
          <Field label="Tax (%)" error={e.taxPct}>
            <input type="number" inputMode="decimal" min="0" max="100" step="any" value={invoice.taxPct} onChange={(ev) => onInvoice({ taxPct: ev.target.value })} placeholder="0" />
          </Field>
          <Field label={`Shipping / extra fees (${invoice.currency})`} error={e.fees}>
            <input type="number" inputMode="decimal" min="0" step="any" value={invoice.fees} onChange={(ev) => onInvoice({ fees: ev.target.value })} placeholder="0.00" />
          </Field>
          <Field label={`Amount paid (${invoice.currency})`} error={e.amountPaid} className="inv-span">
            <input type="number" inputMode="decimal" min="0" step="any" value={invoice.amountPaid} onChange={(ev) => onInvoice({ amountPaid: ev.target.value })} placeholder="0.00" />
          </Field>
        </div>
        <dl className="inv-summary" aria-label="Invoice totals">
          {view.totals.map((row) => (
            <div className={row.strong ? "is-strong" : ""} key={row.key}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
          <div className="inv-summary__due">
            <dt>{view.balance.label}</dt>
            <dd>{view.balance.value}</dd>
          </div>
        </dl>
      </Section>

      <Section title="Your business details" hasError={has(e, "business")}>
        <div className="inv-logo">
          <div className="inv-logo__preview">
            {profile.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.logo.dataUrl} alt="Business logo preview" />
            ) : (
              <span>No logo</span>
            )}
          </div>
          <div className="inv-logo__actions">
            <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" hidden onChange={(ev) => { const f = ev.target.files?.[0]; if (f) onLogoFile(f); ev.target.value = ""; }} />
            <button type="button" className="inv-btn" onClick={() => fileRef.current?.click()}><Icon name="upload" /> {profile.logo ? "Replace logo" : "Upload logo"}</button>
            {profile.logo && <button type="button" className="inv-btn" onClick={onLogoRemove}><Icon name="trash" /> Remove</button>}
          </div>
          {logoError && <p className="inv-inline-error" role="alert">{logoError}</p>}
        </div>
        <div className="inv-grid">
          <Field label="Business or freelancer name" error={e["business.name"]}>
            <input type="text" value={profile.name} onChange={(ev) => onProfile({ name: ev.target.value })} maxLength={120} />
          </Field>
          <Field label="Profession">
            <input type="text" value={profile.profession} onChange={(ev) => onProfile({ profession: ev.target.value })} maxLength={120} />
          </Field>
          <Field label="Email" error={e["business.email"]}>
            <input type="email" value={profile.email} onChange={(ev) => onProfile({ email: ev.target.value })} maxLength={120} />
          </Field>
          <Field label="Phone">
            <input type="tel" value={profile.phone} onChange={(ev) => onProfile({ phone: ev.target.value })} maxLength={40} />
          </Field>
          <Field label="Website" error={e["business.website"]}>
            <input type="text" value={profile.website} onChange={(ev) => onProfile({ website: ev.target.value })} maxLength={120} />
          </Field>
          <Field label="Tax registration no. (optional)">
            <input type="text" value={profile.taxId} onChange={(ev) => onProfile({ taxId: ev.target.value })} maxLength={60} />
          </Field>
          <Field label="Country">
            <input type="text" value={profile.country} onChange={(ev) => onProfile({ country: ev.target.value })} maxLength={80} />
          </Field>
          <Field label="Invoice number prefix" hint="Used for new numbers, e.g. SF gives SF-2026-001.">
            <input type="text" value={profile.invoicePrefix} onChange={(ev) => onProfile({ invoicePrefix: ev.target.value })} maxLength={10} />
          </Field>
          <Field label="Address" className="inv-span">
            <textarea rows={3} value={profile.address} onChange={(ev) => onProfile({ address: ev.target.value })} maxLength={400} />
          </Field>
        </div>
      </Section>

      <Section title="Payment details (optional)">
        <p className="tool-hint inv-hint-top">Anything you leave empty is hidden from the invoice. Only enter details you are happy to share with clients.</p>
        <div className="inv-grid">
          <Field label="Bank name"><input type="text" value={profile.payment.bankName} onChange={(ev) => onPayment({ bankName: ev.target.value })} maxLength={80} /></Field>
          <Field label="Account title"><input type="text" value={profile.payment.accountTitle} onChange={(ev) => onPayment({ accountTitle: ev.target.value })} maxLength={80} /></Field>
          <Field label="Account number"><input type="text" value={profile.payment.accountNumber} onChange={(ev) => onPayment({ accountNumber: ev.target.value })} maxLength={60} /></Field>
          <Field label="IBAN"><input type="text" value={profile.payment.iban} onChange={(ev) => onPayment({ iban: ev.target.value })} maxLength={60} /></Field>
          <Field label="Easypaisa / JazzCash"><input type="text" value={profile.payment.wallet} onChange={(ev) => onPayment({ wallet: ev.target.value })} maxLength={60} /></Field>
          <Field label="Custom payment instructions" className="inv-span">
            <textarea rows={3} value={profile.payment.custom} onChange={(ev) => onPayment({ custom: ev.target.value })} maxLength={600} />
          </Field>
        </div>
      </Section>

      <Section title="Notes and terms">
        <Field label="Notes"><textarea rows={3} value={invoice.notes} onChange={(ev) => onInvoice({ notes: ev.target.value })} maxLength={1500} /></Field>
        <Field label="Terms and conditions"><textarea rows={3} value={invoice.terms} onChange={(ev) => onInvoice({ terms: ev.target.value })} maxLength={1500} /></Field>
        <Field label="Thank-you message"><input type="text" value={invoice.thankYou} onChange={(ev) => onInvoice({ thankYou: ev.target.value })} maxLength={160} /></Field>
      </Section>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { computeTotals, effectiveStatus } from "@/lib/invoice/calc";
import { computeStats } from "@/lib/invoice/stats";
import { formatDate, formatMoney, todayISO } from "@/lib/invoice/format";
import { Icon, StatusBadge } from "./ui";

function MoneyList({ map }) {
  const entries = Object.entries(map);
  if (!entries.length) return <span className="inv-stat__value">-</span>;
  return (
    <span className="inv-stat__value inv-stat__value--list">
      {entries.map(([cur, minor]) => <span key={cur}>{formatMoney(minor, cur)}</span>)}
    </span>
  );
}

export default function HistoryPanel({ history, currentId, onView, onEdit, onDuplicate, onDelete, onNew }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const today = todayISO();

  const stats = useMemo(() => computeStats(history, today), [history, today]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return history
      .map((invoice) => {
        const totals = computeTotals(invoice);
        return { invoice, totals, status: effectiveStatus(invoice, totals, today) };
      })
      .filter((r) => filter === "All" || r.status === filter)
      .filter((r) => {
        if (!q) return true;
        const hay = `${r.invoice.number} ${r.invoice.client.name} ${r.invoice.client.company}`.toLowerCase();
        return hay.includes(q);
      })
      .sort((a, b) => (b.invoice.issueDate + b.invoice.updatedAt).localeCompare(a.invoice.issueDate + a.invoice.updatedAt));
  }, [history, query, filter, today]);

  return (
    <div className="inv-history">
      <div className="inv-stats">
        <div className="inv-stat"><span className="inv-stat__label">Total invoices</span><span className="inv-stat__value">{stats.total}</span></div>
        <div className="inv-stat"><span className="inv-stat__label">Paid</span><span className="inv-stat__value">{stats.paid}</span></div>
        <div className="inv-stat">
          <span className="inv-stat__label">Unpaid</span>
          <span className="inv-stat__value">{stats.unpaid}</span>
          {stats.overdue > 0 && <span className="inv-stat__sub">{stats.overdue} overdue</span>}
        </div>
        <div className="inv-stat inv-stat--accent"><span className="inv-stat__label">Outstanding</span><MoneyList map={stats.outstanding} /></div>
        <div className="inv-stat"><span className="inv-stat__label">Collected</span><MoneyList map={stats.collected} /></div>
      </div>
      <p className="tool-hint">Outstanding only counts unpaid and overdue invoices. Drafts are not counted as revenue or outstanding. Amounts are grouped per currency.</p>

      <div className="inv-filters">
        <label className="inv-search">
          <Icon name="search" size={15} />
          <span className="sr-only">Search invoices</span>
          <input type="search" placeholder="Search by number or client" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        <label>
          <span className="sr-only">Filter by status</span>
          <select className="inv-select inv-select--inline" value={filter} onChange={(e) => setFilter(e.target.value)}>
            {["All", "Draft", "Unpaid", "Paid", "Overdue"].map((s) => <option key={s} value={s}>{s === "All" ? "All statuses" : s}</option>)}
          </select>
        </label>
      </div>

      {history.length === 0 ? (
        <div className="inv-empty">
          <p>No saved invoices yet.</p>
          <button type="button" className="inv-btn inv-btn--primary" onClick={onNew}><Icon name="plus" /> Create your first invoice</button>
        </div>
      ) : rows.length === 0 ? (
        <div className="inv-empty"><p>No invoices match your search.</p></div>
      ) : (
        <div className="inv-table-wrap">
          <table className="inv-table">
            <thead>
              <tr>
                <th>Invoice</th><th>Client</th><th>Date</th><th className="r">Total</th><th>Status</th><th className="r">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ invoice, totals, status }) => (
                <tr key={invoice.id} className={invoice.id === currentId ? "is-current" : ""}>
                  <td data-label="Invoice"><strong>{invoice.number}</strong></td>
                  <td data-label="Client">{invoice.client.name || "-"}{invoice.client.company ? <span className="inv-table__sub">{invoice.client.company}</span> : null}</td>
                  <td data-label="Date">{formatDate(invoice.issueDate)}</td>
                  <td data-label="Total" className="r">{formatMoney(totals.total, invoice.currency)}</td>
                  <td data-label="Status"><StatusBadge status={status} /></td>
                  <td className="r inv-table__actions">
                    <button type="button" className="inv-iconbtn" onClick={() => onView(invoice)} aria-label={`View ${invoice.number}`} title="View"><Icon name="eye" /></button>
                    <button type="button" className="inv-iconbtn" onClick={() => onEdit(invoice)} aria-label={`Edit ${invoice.number}`} title="Edit"><Icon name="edit" /></button>
                    <button type="button" className="inv-iconbtn" onClick={() => onDuplicate(invoice)} aria-label={`Duplicate ${invoice.number}`} title="Duplicate"><Icon name="copy" /></button>
                    <button type="button" className="inv-iconbtn inv-iconbtn--danger" onClick={() => onDelete(invoice)} aria-label={`Delete ${invoice.number}`} title="Delete"><Icon name="trash" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

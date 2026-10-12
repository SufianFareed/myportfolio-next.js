import { computeTotals, effectiveStatus } from "./calc";
import { todayISO } from "./format";

function addTo(map, currency, minor) {
  map[currency] = (map[currency] || 0) + minor;
}

// Drafts never count as revenue or outstanding. Money is grouped per
// currency because different currencies can't be added together.
export function computeStats(history, today = todayISO()) {
  const stats = { total: history.length, paid: 0, unpaid: 0, overdue: 0, draft: 0, outstanding: {}, collected: {} };
  for (const invoice of history) {
    const totals = computeTotals(invoice);
    const status = effectiveStatus(invoice, totals, today);
    if (status === "Draft") {
      stats.draft += 1;
      continue;
    }
    if (status === "Paid") stats.paid += 1;
    else {
      stats.unpaid += 1;
      if (status === "Overdue") stats.overdue += 1;
      if (totals.balance > 0) addTo(stats.outstanding, invoice.currency, totals.balance);
    }
    const received = Math.min(totals.paid, totals.total);
    if (received > 0) addTo(stats.collected, invoice.currency, received);
  }
  return stats;
}

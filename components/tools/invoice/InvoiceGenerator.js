"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ACCENT_PRESETS, STORAGE_KEYS, TEMPLATES } from "@/lib/invoice/constants";
import { computeTotals, effectiveStatus, fromMinor } from "@/lib/invoice/calc";
import {
  blankInvoice, blankItem, defaultProfile, duplicateInvoice, sampleInvoice,
  sanitizeHistory, sanitizeInvoice, sanitizeProfile, stableKey,
} from "@/lib/invoice/defaults";
import { todayISO } from "@/lib/invoice/format";
import { readJSON, storageAvailable, writeJSON } from "@/lib/invoice/storage";
import { validate, visibleErrors } from "@/lib/invoice/validate";
import { buildView } from "@/lib/invoice/view";
import { buildInvoicePdf, pdfFileName } from "@/lib/invoice/pdf";
import { copyText, emailLink, invoiceSummary, whatsappLink } from "@/lib/invoice/share";
import { processLogoFile } from "@/lib/invoice/logo";
import EditorForm from "./EditorForm";
import HistoryPanel from "./HistoryPanel";
import InvoicePreview from "./InvoicePreview";
import { ConfirmDialog, Icon, Modal, MoreMenu, StatusBadge, Toast } from "./ui";

const STORAGE_MESSAGE =
  "Your browser is blocking or has run out of storage, so changes can't be saved on this device. You can still download the PDF.";

export default function InvoiceGenerator() {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [history, setHistory] = useState([]);
  const [baseline, setBaseline] = useState("");
  const [tab, setTab] = useState("create");
  const [pane, setPane] = useState("editor");
  const [showErrors, setShowErrors] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [previewInvoice, setPreviewInvoice] = useState(null);
  const [busy, setBusy] = useState("");
  const [storageError, setStorageError] = useState("");
  const [logoError, setLogoError] = useState("");

  const latest = useRef({ profile: null, invoice: null, baseline: "" });
  latest.current = { profile, invoice, baseline };

  const notify = useCallback((type, message) => setToast({ type, message, id: Date.now() }), []);
  const clearToast = useCallback(() => setToast(null), []);

  // ---------- Load from localStorage ----------
  useEffect(() => {
    const p = sanitizeProfile(readJSON(STORAGE_KEYS.profile, null));
    const h = sanitizeHistory(readJSON(STORAGE_KEYS.history, []), p);
    const d = readJSON(STORAGE_KEYS.draft, null);
    let inv;
    let base = "";
    if (d && d.invoice) {
      inv = sanitizeInvoice(d.invoice, p);
      base = typeof d.baseline === "string" ? d.baseline : "";
    } else {
      inv = blankInvoice(p, h);
      base = stableKey(inv);
    }
    setProfile(p);
    setHistory(h);
    setInvoice(inv);
    setBaseline(base);
    if (!storageAvailable()) setStorageError(STORAGE_MESSAGE);
    setReady(true);
  }, []);

  // ---------- Persist (debounced) ----------
  useEffect(() => {
    if (!ready) return undefined;
    const t = setTimeout(() => {
      const a = writeJSON(STORAGE_KEYS.profile, profile);
      const b = writeJSON(STORAGE_KEYS.draft, { invoice, baseline });
      setStorageError(a.ok && b.ok ? "" : STORAGE_MESSAGE);
    }, 400);
    return () => clearTimeout(t);
  }, [ready, profile, invoice, baseline]);

  // Flush immediately when the tab is hidden or closed, so a quick
  // reload never loses the last edit made inside the debounce window.
  useEffect(() => {
    if (!ready) return undefined;
    const flush = () => {
      const l = latest.current;
      if (!l.profile || !l.invoice) return;
      writeJSON(STORAGE_KEYS.profile, l.profile);
      writeJSON(STORAGE_KEYS.draft, { invoice: l.invoice, baseline: l.baseline });
    };
    const onVisibility = () => document.visibilityState === "hidden" && flush();
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    const r = writeJSON(STORAGE_KEYS.history, history);
    if (!r.ok) setStorageError(STORAGE_MESSAGE);
  }, [ready, history]);

  // ---------- Derived data ----------
  const today = todayISO();
  const totals = useMemo(() => (invoice ? computeTotals(invoice) : null), [invoice]);
  const status = invoice && totals ? effectiveStatus(invoice, totals, today) : "Draft";
  const view = useMemo(() => (invoice && profile ? buildView(invoice, profile, today) : null), [invoice, profile, today]);
  const strictResult = useMemo(() => (invoice && profile ? validate(invoice, profile, { strict: true }) : { errors: {}, warnings: [] }), [invoice, profile]);
  const shownErrors = visibleErrors(strictResult.errors, showErrors);
  const errorCount = Object.keys(strictResult.errors).length;
  const dirty = invoice ? stableKey(invoice) !== baseline : false;

  // ---------- Field updates ----------
  const onInvoice = (patch) => setInvoice((i) => ({ ...i, ...patch }));
  const onClient = (patch) => setInvoice((i) => ({ ...i, client: { ...i.client, ...patch } }));
  const onItem = (id, patch) => setInvoice((i) => ({ ...i, items: i.items.map((it) => (it.id === id ? { ...it, ...patch } : it)) }));
  const onAddItem = (description) => setInvoice((i) => ({ ...i, items: [...i.items, { ...blankItem(), description }] }));
  const onRemoveItem = (id) => setInvoice((i) => {
    const items = i.items.filter((it) => it.id !== id);
    return { ...i, items: items.length ? items : [blankItem()] };
  });
  const onProfile = (patch) => setProfile((p) => ({ ...p, ...patch }));
  const onPayment = (patch) => setProfile((p) => ({ ...p, payment: { ...p.payment, ...patch } }));
  const onCurrency = (currency) => {
    setInvoice((i) => ({ ...i, currency }));
    setProfile((p) => ({ ...p, currency })); // remembered as the default for new invoices
  };

  const onLogoFile = async (file) => {
    setLogoError("");
    try {
      const logo = await processLogoFile(file);
      setProfile((p) => ({ ...p, logo }));
    } catch (err) {
      setLogoError(err.message || "Could not use that image.");
    }
  };

  // ---------- Guards ----------
  const guard = () => {
    if (errorCount > 0) {
      setShowErrors(true);
      setTab("create");
      setPane("editor");
      notify("error", `Please fix ${errorCount} highlighted ${errorCount === 1 ? "field" : "fields"} first.`);
      return false;
    }
    return true;
  };

  // ---------- Actions ----------
  const doSave = () => {
    const lenient = validate(invoice, profile, { strict: invoice.status !== "Draft" });
    if (Object.keys(lenient.errors).length) {
      setShowErrors(true);
      setPane("editor");
      notify("error", "Please fix the highlighted fields before saving.");
      return;
    }
    if (history.some((h) => h.id !== invoice.id && h.number.trim().toLowerCase() === invoice.number.trim().toLowerCase())) {
      notify("error", `Invoice number ${invoice.number} is already used by another saved invoice.`);
      return;
    }
    const now = new Date().toISOString();
    const saved = { ...invoice, updatedAt: now };
    setHistory((h) => (h.some((x) => x.id === saved.id) ? h.map((x) => (x.id === saved.id ? saved : x)) : [saved, ...h]));
    setInvoice(saved);
    setBaseline(stableKey(saved));
    notify("success", `Saved ${saved.number}.`);
  };

  const startNew = () => {
    const inv = blankInvoice(profile, history, [invoice.number]);
    setInvoice(inv);
    setBaseline(stableKey(inv));
    setShowErrors(false);
    setTab("create");
    setPane("editor");
    notify("success", `New invoice ${inv.number} started.`);
  };
  const handleNew = () => {
    if (dirty) {
      setConfirm({
        title: "Start a new invoice?",
        message: "You have unsaved changes on this invoice. Starting a new one will discard them.",
        confirmLabel: "Discard and start new",
        danger: true,
        onConfirm: startNew,
      });
    } else startNew();
  };

  const loadAsDraft = (copy) => {
    setInvoice(copy);
    setBaseline("");
    setShowErrors(false);
    setTab("create");
    setPane("editor");
    notify("success", `Duplicated as ${copy.number}. Save it to keep it.`);
  };
  const duplicateCurrent = () => loadAsDraft(duplicateInvoice(invoice, profile, history));

  const handleClear = () =>
    setConfirm({
      title: "Clear this form?",
      message: "This empties the client details, line items, discounts, and notes of the current invoice. Saved invoices and your business details are not affected.",
      confirmLabel: "Clear form",
      danger: true,
      onConfirm: () => {
        const fresh = blankInvoice(profile, history, [invoice.number]);
        setInvoice({ ...fresh, number: invoice.number, id: invoice.id, issueDate: invoice.issueDate, dueDate: invoice.dueDate, currency: invoice.currency, status: "Draft" });
        setShowErrors(false);
        notify("success", "Form cleared.");
      },
    });

  const handleReset = () =>
    setConfirm({
      title: "Reset to sample data?",
      message: "This replaces your business details (including logo and payment details) and the current invoice with sample data. Your saved invoices are kept.",
      confirmLabel: "Reset",
      danger: true,
      onConfirm: () => {
        const p = defaultProfile();
        const inv = sampleInvoice(p, history);
        setProfile(p);
        setInvoice(inv);
        setBaseline("");
        setShowErrors(false);
        notify("success", "Sample data loaded.");
      },
    });

  const handleMarkPaid = () => {
    if (!totals || totals.total <= 0) {
      notify("error", "Add line items first so there is an amount to mark as paid.");
      return;
    }
    onInvoice({ status: "Paid", amountPaid: fromMinor(totals.total) });
    notify("success", "Marked as paid. Save to keep the change.");
  };

  const handleCopy = async () => {
    const ok = await copyText(invoiceSummary(invoice, profile));
    notify(ok ? "success" : "error", ok ? "Invoice summary copied." : "Could not copy. Please copy manually.");
  };

  const handleEmail = () => {
    if (!guard()) return;
    window.location.href = emailLink(invoice, profile);
    notify("success", "Opening your email app. Attach the downloaded PDF yourself.");
  };

  const handleWhatsApp = () => {
    if (!guard()) return;
    window.open(whatsappLink(invoice, profile), "_blank", "noopener,noreferrer");
    notify("success", "Opening WhatsApp with a summary. The PDF is not attached automatically.");
  };

  const makePdf = async (inv) => {
    const v = buildView(inv, profile, today);
    return buildInvoicePdf({ view: v, template: profile.template, accent: profile.accent });
  };

  const handleDownload = async () => {
    if (!guard()) return;
    setBusy("pdf");
    try {
      const doc = await makePdf(invoice);
      doc.save(pdfFileName(invoice.number));
      notify("success", "PDF downloaded.");
    } catch (err) {
      console.error(err);
      notify("error", "Could not create the PDF. Please try again.");
    } finally {
      setBusy("");
    }
  };

  const handlePrint = async () => {
    if (!guard()) return;
    // Open the tab inside the click so pop-up blockers allow it.
    const win = window.open("", "_blank");
    setBusy("print");
    try {
      const doc = await makePdf(invoice);
      doc.autoPrint();
      const url = doc.output("bloburl");
      if (win) {
        win.location.href = url;
      } else {
        doc.save(pdfFileName(invoice.number));
        notify("error", "Pop-ups are blocked, so the PDF was downloaded instead. Open it to print.");
      }
    } catch (err) {
      console.error(err);
      if (win) win.close();
      notify("error", "Could not prepare the invoice for printing.");
    } finally {
      setBusy("");
    }
  };

  // ---------- History actions ----------
  const openFromHistory = (inv) => {
    const load = () => {
      setInvoice(sanitizeInvoice(inv, profile));
      setBaseline(stableKey(inv));
      setShowErrors(false);
      setTab("create");
      setPane("editor");
    };
    if (dirty && inv.id !== invoice.id) {
      setConfirm({
        title: "Open this invoice?",
        message: "You have unsaved changes on the current invoice. Opening another invoice will discard them.",
        confirmLabel: "Discard and open",
        danger: true,
        onConfirm: load,
      });
    } else load();
  };

  const deleteFromHistory = (inv) =>
    setConfirm({
      title: `Delete ${inv.number}?`,
      message: "This permanently removes the saved invoice from this browser. It cannot be undone.",
      confirmLabel: "Delete invoice",
      danger: true,
      onConfirm: () => {
        setHistory((h) => h.filter((x) => x.id !== inv.id));
        if (invoice.id === inv.id) setBaseline("");
        notify("success", `Deleted ${inv.number}.`);
      },
    });

  if (!ready || !invoice || !profile || !view) {
    return <div className="inv-loading" role="status">Loading invoice tool...</div>;
  }

  const menuItems = [
    { label: "New invoice", icon: "file", onClick: handleNew },
    { label: "Duplicate invoice", icon: "copy", onClick: duplicateCurrent },
    { label: "Mark as paid", icon: "check", onClick: handleMarkPaid },
    { divider: true },
    { label: "Copy invoice summary", icon: "copy", onClick: handleCopy },
    { label: "Share by email", icon: "mail", onClick: handleEmail },
    { label: "Share on WhatsApp", icon: "message", onClick: handleWhatsApp },
    { divider: true },
    { label: "Clear form", icon: "eraser", onClick: handleClear, danger: true },
    { label: "Reset to sample data", icon: "refresh", onClick: handleReset, danger: true },
  ];

  const errorMessages = Object.values(shownErrors);

  return (
    <div className="inv-tool">
      {storageError && <div className="inv-banner inv-banner--warn" role="alert">{storageError}</div>}

      <div className="inv-tabs" role="tablist" aria-label="Invoice tool sections">
        <button type="button" role="tab" aria-selected={tab === "create"} className={`inv-tab ${tab === "create" ? "is-active" : ""}`} onClick={() => setTab("create")}>Create invoice</button>
        <button type="button" role="tab" aria-selected={tab === "history"} className={`inv-tab ${tab === "history" ? "is-active" : ""}`} onClick={() => setTab("history")}>
          Dashboard and history <span className="inv-tab__count">{history.length}</span>
        </button>
      </div>

      {tab === "history" ? (
        <HistoryPanel
          history={history}
          currentId={invoice.id}
          onNew={handleNew}
          onView={setPreviewInvoice}
          onEdit={openFromHistory}
          onDuplicate={(inv) => loadAsDraft(duplicateInvoice(inv, profile, history))}
          onDelete={deleteFromHistory}
        />
      ) : (
        <>
          <div className="inv-toolbar">
            <div className="inv-toolbar__info">
              <strong>{invoice.number || "No number"}</strong>
              <StatusBadge status={status} />
              {dirty && <span className="inv-dirty">Unsaved changes</span>}
            </div>
            <div className="inv-toolbar__actions">
              <button type="button" className="inv-btn inv-btn--primary" onClick={handleDownload} disabled={busy !== ""}>
                <Icon name="download" /> {busy === "pdf" ? "Creating PDF..." : "Download PDF"}
              </button>
              <button type="button" className="inv-btn" onClick={doSave}><Icon name="save" /> Save</button>
              <button type="button" className="inv-btn" onClick={handlePrint} disabled={busy !== ""}><Icon name="printer" /> {busy === "print" ? "Preparing..." : "Print"}</button>
              <button type="button" className="inv-btn" onClick={() => setPreviewInvoice(invoice)}><Icon name="eye" /> Preview</button>
              <MoreMenu items={menuItems} />
            </div>
          </div>

          <div className="inv-mobile-switch" role="tablist" aria-label="Editor or preview">
            <button type="button" role="tab" aria-selected={pane === "editor"} className={pane === "editor" ? "is-active" : ""} onClick={() => setPane("editor")}>Editor</button>
            <button type="button" role="tab" aria-selected={pane === "preview"} className={pane === "preview" ? "is-active" : ""} onClick={() => setPane("preview")}>Preview</button>
          </div>

          <div className="inv-layout" data-pane={pane}>
            <div className="inv-editor-col">
              {showErrors && errorMessages.length > 0 && (
                <div className="inv-banner inv-banner--error" role="alert">
                  <strong>Please fix {errorMessages.length} {errorMessages.length === 1 ? "issue" : "issues"}:</strong>
                  <ul>{errorMessages.slice(0, 5).map((m, i) => <li key={i}>{m}</li>)}</ul>
                </div>
              )}
              {strictResult.warnings.map((w) => <div className="inv-banner inv-banner--warn" key={w}>{w}</div>)}
              <EditorForm
                profile={profile}
                invoice={invoice}
                view={view}
                errors={shownErrors}
                status={status}
                onProfile={onProfile}
                onPayment={onPayment}
                onInvoice={onInvoice}
                onClient={onClient}
                onItem={onItem}
                onAddItem={onAddItem}
                onRemoveItem={onRemoveItem}
                onCurrency={onCurrency}
                onLogoFile={onLogoFile}
                onLogoRemove={() => setProfile((p) => ({ ...p, logo: null }))}
                logoError={logoError}
              />
            </div>

            <div className="inv-preview-col">
              <div className="inv-preview-card">
                <div className="inv-style">
                  <div className="inv-style__group" role="radiogroup" aria-label="Invoice template">
                    {TEMPLATES.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        role="radio"
                        aria-checked={profile.template === t.id}
                        className={`inv-chip ${profile.template === t.id ? "is-active" : ""}`}
                        onClick={() => onProfile({ template: t.id })}
                        title={t.blurb}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                  <div className={`inv-style__group inv-swatches ${profile.template === "minimal" ? "is-disabled" : ""}`} role="radiogroup" aria-label="Accent colour">
                    {ACCENT_PRESETS.map((a) => (
                      <button
                        key={a.value}
                        type="button"
                        role="radio"
                        aria-checked={profile.accent.toLowerCase() === a.value}
                        aria-label={a.name}
                        title={a.name}
                        disabled={profile.template === "minimal"}
                        className={`inv-swatch ${profile.accent.toLowerCase() === a.value ? "is-active" : ""}`}
                        style={{ background: a.value }}
                        onClick={() => onProfile({ accent: a.value })}
                      />
                    ))}
                    <label className="inv-swatch inv-swatch--custom" title="Custom colour">
                      <span className="sr-only">Custom accent colour</span>
                      <input type="color" value={profile.accent} disabled={profile.template === "minimal"} onChange={(e) => onProfile({ accent: e.target.value })} />
                    </label>
                  </div>
                </div>
                <InvoicePreview view={view} template={profile.template} accent={profile.accent} />
                <p className="tool-hint">Live preview. Long invoices are split across A4 pages automatically in the PDF.</p>
              </div>
            </div>
          </div>
        </>
      )}

      <p className="inv-storage-note">
        Your business profile, drafts and saved invoices are stored only in this browser (localStorage) on this device.
        They are not synced across devices or browsers, and clearing your browser data will remove them.
      </p>

      {previewInvoice && (
        <Modal title={`Invoice ${previewInvoice.number}`} wide onClose={() => setPreviewInvoice(null)}
          footer={
            <>
              <button type="button" className="inv-btn" onClick={() => setPreviewInvoice(null)} data-autofocus>Close</button>
              <button type="button" className="inv-btn inv-btn--primary" disabled={busy !== ""} onClick={async () => {
                const errs = validate(previewInvoice, profile, { strict: true }).errors;
                if (Object.keys(errs).length) { notify("error", "This invoice is missing required details. Open it in the editor to fix them."); return; }
                setBusy("pdf");
                try { const doc = await makePdf(previewInvoice); doc.save(pdfFileName(previewInvoice.number)); notify("success", "PDF downloaded."); }
                catch (err) { console.error(err); notify("error", "Could not create the PDF."); }
                finally { setBusy(""); }
              }}>
                <Icon name="download" /> Download PDF
              </button>
            </>
          }>
          <InvoicePreview view={buildView(previewInvoice, profile, today)} template={profile.template} accent={profile.accent} />
        </Modal>
      )}

      {confirm && (
        <ConfirmDialog
          title={confirm.title}
          message={confirm.message}
          confirmLabel={confirm.confirmLabel}
          danger={confirm.danger}
          onCancel={() => setConfirm(null)}
          onConfirm={() => { const fn = confirm.onConfirm; setConfirm(null); fn(); }}
        />
      )}

      <Toast toast={toast} onDone={clearToast} />
    </div>
  );
}

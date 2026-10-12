import { sanitizePdfText } from "./format";

// A4 in millimetres.
const PAGE_W = 210;
const PAGE_H = 297;
const M = 15; // side margin
const BOTTOM = 275; // content must stop above the footer
const CONT_TOP = 22; // where content starts on continuation pages

const INK = [31, 41, 55];
const GRAY = [107, 114, 128];
const LIGHT = [229, 231, 235];

function hexToRgb(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || "");
  const n = m ? parseInt(m[1], 16) : 0x2563eb;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const tint = (rgb, t) => rgb.map((c) => Math.round(c + (255 - c) * t));
const S = (v) => sanitizePdfText(v);

function fitImage(logo, maxW, maxH) {
  const ratio = logo.w / logo.h;
  let w = maxW;
  let h = w / ratio;
  if (h > maxH) {
    h = maxH;
    w = h * ratio;
  }
  return { w, h };
}

export function pdfFileName(number) {
  const safe = String(number || "invoice").replace(/[^A-Za-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  return `Invoice-${safe || "invoice"}.pdf`;
}

// Draws real text (selectable, searchable) with jsPDF + autotable —
// not a screenshot of the page — and paginates long invoices.
export async function buildInvoicePdf({ view, template, accent }) {
  const [{ jsPDF }, atModule] = await Promise.all([import("jspdf"), import("jspdf-autotable")]);
  const autoTable = atModule.default || atModule.autoTable;

  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
  doc.setProperties({ title: `Invoice ${view.number}`, author: view.business.name, subject: "Invoice" });

  const acc = template === "minimal" ? [17, 17, 17] : hexToRgb(accent);
  const font = template === "elegant" ? "times" : "helvetica";

  const setText = (size, style = "normal", color = INK) => {
    doc.setFont(font, style);
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);
  };

  // ---------- Header ----------
  const logo = view.business.logo;
  const logoFmt = logo && logo.dataUrl.startsWith("data:image/jpeg") ? "JPEG" : "PNG";
  let infoY;

  const brandBlock = (x, yTop, color, subColor, maxTextW) => {
    const nameLines = doc.splitTextToSize(S(view.business.name), maxTextW).slice(0, 2);
    setText(15, "bold", color);
    const startY = yTop - (nameLines.length - 1) * 3;
    doc.text(nameLines, x, startY);
    if (view.business.profession) {
      setText(9, template === "elegant" ? "italic" : "normal", subColor);
      const prof = doc.splitTextToSize(S(view.business.profession), maxTextW).slice(0, 2);
      doc.text(prof, x, startY + nameLines.length * 6 + 0.5);
    }
  };

  if (template === "modern") {
    const BAND = 38;
    doc.setFillColor(acc[0], acc[1], acc[2]);
    doc.rect(0, 0, PAGE_W, BAND, "F");
    let tx = M;
    if (logo) {
      const { w, h } = fitImage(logo, 34, 16);
      const top = (BAND - h - 4) / 2;
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(M, top, w + 4, h + 4, 1.5, 1.5, "F");
      doc.addImage(logo.dataUrl, logoFmt, M + 2, top + 2, w, h);
      tx = M + w + 10;
    }
    brandBlock(tx, 17, [255, 255, 255], [225, 232, 255], PAGE_W - M - 62 - tx);
    setText(26, "bold", [255, 255, 255]);
    doc.text("INVOICE", PAGE_W - M, 19, { align: "right" });
    setText(10, "normal", [225, 232, 255]);
    doc.text(S(`# ${view.number}`), PAGE_W - M, 27, { align: "right" });
    infoY = 48;
  } else if (template === "minimal") {
    let tx = M;
    if (logo) {
      const { w, h } = fitImage(logo, 34, 16);
      doc.addImage(logo.dataUrl, logoFmt, M, 11, w, h);
      tx = M + w + 8;
    }
    brandBlock(tx, 17, [17, 17, 17], GRAY, PAGE_W - M - 62 - tx);
    setText(22, "bold", [17, 17, 17]);
    doc.text("INVOICE", PAGE_W - M, 19, { align: "right" });
    setText(10, "normal", GRAY);
    doc.text(S(`# ${view.number}`), PAGE_W - M, 26, { align: "right" });
    doc.setDrawColor(17, 17, 17);
    doc.setLineWidth(0.8);
    doc.line(M, 34, PAGE_W - M, 34);
    infoY = 43;
  } else {
    let tx = M;
    if (logo) {
      const { w, h } = fitImage(logo, 34, 16);
      doc.addImage(logo.dataUrl, logoFmt, M, 11, w, h);
      tx = M + w + 8;
    }
    brandBlock(tx, 17, INK, GRAY, PAGE_W - M - 62 - tx);
    setText(26, "bold", acc);
    doc.text("INVOICE", PAGE_W - M, 19, { align: "right" });
    setText(10, "italic", GRAY);
    doc.text(S(`# ${view.number}`), PAGE_W - M, 26, { align: "right" });
    doc.setDrawColor(acc[0], acc[1], acc[2]);
    doc.setLineWidth(0.7);
    doc.line(M, 33, PAGE_W - M, 33);
    doc.setLineWidth(0.2);
    doc.line(M, 34.6, PAGE_W - M, 34.6);
    infoY = 44;
  }

  // ---------- From / Bill to / Details ----------
  const colX = [M, M + 62, M + 124];
  const colW = 56;
  const labelColor = template === "minimal" ? GRAY : acc;
  const LH = 4.4;

  const heading = (x, y, text) => {
    setText(8, "bold", labelColor);
    doc.text(text, x, y);
  };

  const textBlock = (x, y, rows, firstBold) => {
    rows.forEach((row, idx) => {
      const wrapped = doc.splitTextToSize(S(row), colW);
      if (idx === 0 && firstBold) setText(10, "bold", INK);
      else setText(9, "normal", idx === 0 && firstBold ? INK : [55, 65, 81]);
      doc.text(wrapped, x, y);
      y += wrapped.length * LH;
    });
    return y;
  };

  heading(colX[0], infoY, "FROM");
  const fromEnd = textBlock(colX[0], infoY + 5.5, view.business.lines.length ? view.business.lines : [view.business.name], false);

  heading(colX[1], infoY, "BILL TO");
  const billEnd = textBlock(colX[1], infoY + 5.5, [view.billTo.name, ...view.billTo.lines], true);

  heading(colX[2], infoY, "DETAILS");
  let dy = infoY + 5.5;
  view.details.forEach((row) => {
    setText(9, "normal", GRAY);
    doc.text(S(row.label), colX[2], dy);
    let color = INK;
    let style = "normal";
    if (row.tone === "Paid") { color = [21, 128, 61]; style = "bold"; }
    else if (row.tone === "Overdue") { color = [185, 28, 28]; style = "bold"; }
    else if (row.tone === "Unpaid") { color = [180, 83, 9]; style = "bold"; }
    setText(9, style, color);
    const wrapped = doc.splitTextToSize(S(row.value), colW - 24);
    doc.text(wrapped, colX[2] + 24, dy);
    dy += Math.max(1, wrapped.length) * LH + 0.4;
  });

  const tableStart = Math.max(fromEnd, billEnd, dy) + 6;

  // ---------- Items table ----------
  const hasDisc = view.hasDiscountColumn;
  const head = ["Description", "Qty", "Unit price", ...(hasDisc ? ["Disc."] : []), "Amount"];
  const body = view.items.map((item) => [
    S(item.description),
    S(item.qty),
    S(item.unit),
    ...(hasDisc ? [S(item.discount || "-")] : []),
    S(item.amount),
  ]);

  const numCols = hasDisc ? [1, 2, 3, 4] : [1, 2, 3];
  const columnStyles = { 0: { cellWidth: "auto" } };
  numCols.forEach((i) => (columnStyles[i] = { halign: "right" }));
  columnStyles[1].cellWidth = 16;
  columnStyles[2].cellWidth = 34;
  if (hasDisc) columnStyles[3].cellWidth = 16;
  columnStyles[hasDisc ? 4 : 3].cellWidth = 36;

  const headStyles =
    template === "modern"
      ? { fillColor: acc, textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8.5 }
      : template === "minimal"
        ? { textColor: [17, 17, 17], fontStyle: "bold", fontSize: 8 }
        : { fillColor: tint(acc, 0.9), textColor: acc, fontStyle: "bold", fontSize: 9 };

  autoTable(doc, {
    startY: tableStart,
    margin: { left: M, right: M, top: CONT_TOP, bottom: 22 },
    head: [head],
    body,
    theme: "plain",
    rowPageBreak: "avoid",
    styles: {
      font,
      fontSize: 9,
      textColor: INK,
      cellPadding: { top: 3.2, bottom: 3.2, left: 3, right: 3 },
      overflow: "linebreak",
      valign: "top",
    },
    headStyles,
    columnStyles,
    didParseCell: (data) => {
      if (template === "modern" && data.section === "body" && data.row.index % 2 === 1) {
        data.cell.styles.fillColor = [246, 248, 252];
      }
    },
    didDrawCell: (data) => {
      const { cell, section } = data;
      if (template === "modern") return;
      const y = cell.y + cell.height;
      if (section === "head") {
        doc.setDrawColor(template === "minimal" ? 17 : acc[0], template === "minimal" ? 17 : acc[1], template === "minimal" ? 17 : acc[2]);
        doc.setLineWidth(template === "minimal" ? 0.5 : 0.4);
        doc.line(cell.x, y, cell.x + cell.width, y);
      } else if (section === "body") {
        doc.setDrawColor(LIGHT[0], LIGHT[1], LIGHT[2]);
        doc.setLineWidth(0.15);
        doc.line(cell.x, y, cell.x + cell.width, y);
      }
    },
  });

  let y = (doc.lastAutoTable ? doc.lastAutoTable.finalY : tableStart) + 8;
  const ensure = (h) => {
    if (y + h > BOTTOM) {
      doc.addPage();
      y = CONT_TOP;
    }
  };

  // ---------- Payment details (left) + totals (right) ----------
  const TOT_W = 80;
  const totX = PAGE_W - M - TOT_W;
  const PAY_W = totX - M - 8;
  const ROW_H = 6.4;

  const payRows = view.payment.rows;
  const payCustom = view.payment.custom ? doc.splitTextToSize(S(view.payment.custom), PAY_W) : [];
  const hasPay = payRows.length > 0 || payCustom.length > 0;

  setText(9, "normal", INK);
  const payWrapped = payRows.map((r) => doc.splitTextToSize(S(r.value), PAY_W - 38));
  const payH = hasPay
    ? 6 + payWrapped.reduce((sum, w) => sum + Math.max(1, w.length) * LH + 0.6, 0) + (payCustom.length ? payCustom.length * LH + 2 : 0)
    : 0;
  const totH = view.totals.length * ROW_H + 15;

  ensure(Math.max(payH, totH));
  const blockTop = y;

  if (hasPay) {
    heading(M, blockTop, "PAYMENT DETAILS");
    let py = blockTop + 5.5;
    payRows.forEach((row, i) => {
      setText(9, "normal", GRAY);
      doc.text(S(row.label), M, py);
      setText(9, "bold", INK);
      doc.text(payWrapped[i], M + 38, py);
      py += Math.max(1, payWrapped[i].length) * LH + 0.6;
    });
    if (payCustom.length) {
      setText(9, "normal", [55, 65, 81]);
      doc.text(payCustom, M, py + (payRows.length ? 1.5 : 0));
    }
  }

  let ty = blockTop + 3;
  view.totals.forEach((row) => {
    if (row.strong) {
      doc.setDrawColor(LIGHT[0], LIGHT[1], LIGHT[2]);
      doc.setLineWidth(0.3);
      doc.line(totX, ty - 4.4, PAGE_W - M, ty - 4.4);
      setText(10.5, "bold", INK);
    } else {
      setText(9.5, "normal", GRAY);
    }
    doc.text(S(row.label), totX, ty);
    if (row.strong) setText(10.5, "bold", INK);
    else setText(9.5, "normal", INK);
    doc.text(S(row.value), PAGE_W - M, ty, { align: "right" });
    ty += ROW_H;
  });

  // Balance due bar
  const barY = ty - 2;
  const barH = 10;
  if (template === "modern") {
    doc.setFillColor(acc[0], acc[1], acc[2]);
    doc.roundedRect(totX - 3, barY, TOT_W + 3, barH, 1.5, 1.5, "F");
    setText(11, "bold", [255, 255, 255]);
  } else if (template === "minimal") {
    doc.setDrawColor(17, 17, 17);
    doc.setLineWidth(0.7);
    doc.line(totX - 3, barY, PAGE_W - M, barY);
    doc.line(totX - 3, barY + barH, PAGE_W - M, barY + barH);
    setText(11, "bold", [17, 17, 17]);
  } else {
    const t = tint(acc, 0.9);
    doc.setFillColor(t[0], t[1], t[2]);
    doc.rect(totX - 3, barY, TOT_W + 3, barH, "F");
    doc.setDrawColor(acc[0], acc[1], acc[2]);
    doc.setLineWidth(0.5);
    doc.line(totX - 3, barY, PAGE_W - M, barY);
    doc.line(totX - 3, barY + barH, PAGE_W - M, barY + barH);
    setText(11, "bold", acc);
  }
  doc.text(S(view.balance.label), totX, barY + 6.6);
  doc.text(S(view.balance.value), PAGE_W - M - (template === "minimal" ? 0 : 2), barY + 6.6, { align: "right" });

  y = Math.max(blockTop + payH, barY + barH) + 10;

  // ---------- Notes, terms, thank-you ----------
  const paragraph = (title, text) => {
    if (!text) return;
    const wrapped = doc.splitTextToSize(S(text), PAGE_W - 2 * M);
    ensure(5.5 + Math.min(wrapped.length, 2) * LH);
    heading(M, y, title);
    y += 5.2;
    setText(9, "normal", [55, 65, 81]);
    wrapped.forEach((line) => {
      ensure(LH);
      doc.text(line, M, y);
      y += LH;
    });
    y += 4;
  };

  paragraph("NOTES", view.notes);
  paragraph("TERMS AND CONDITIONS", view.terms);

  if (view.thankYou) {
    ensure(14);
    setText(11, template === "elegant" ? "italic" : "bold", template === "minimal" ? [17, 17, 17] : acc);
    doc.text(S(view.thankYou), PAGE_W / 2, y + 4, { align: "center", maxWidth: PAGE_W - 2 * M });
  }

  // ---------- Footer + continuation headers on every page ----------
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i += 1) {
    doc.setPage(i);
    if (i > 1) {
      if (template === "modern") {
        doc.setFillColor(acc[0], acc[1], acc[2]);
        doc.rect(0, 0, PAGE_W, 3, "F");
      }
      setText(8.5, "normal", GRAY);
      doc.text(S(`Invoice ${view.number} (continued)`), M, 13);
    }
    doc.setDrawColor(LIGHT[0], LIGHT[1], LIGHT[2]);
    doc.setLineWidth(0.2);
    doc.line(M, 282, PAGE_W - M, 282);
    setText(8, "normal", GRAY);
    const footerText = doc.splitTextToSize(S(view.footer || view.business.name), 140)[0];
    doc.text(footerText, M, 287);
    doc.text(`Page ${i} of ${pages}`, PAGE_W - M, 287, { align: "right" });
  }

  return doc;
}

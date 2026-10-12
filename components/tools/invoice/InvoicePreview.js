"use client";

import { useEffect, useRef, useState } from "react";

const PAPER_W = 794; // A4 width in CSS px at 96dpi

// The paper always stays white (like a real printed invoice) in both
// the dark and light site themes.
export default function InvoicePreview({ view, template, accent }) {
  const wrapRef = useRef(null);
  const paperRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState(1123);

  useEffect(() => {
    const wrap = wrapRef.current;
    const paper = paperRef.current;
    if (!wrap || !paper) return undefined;
    const update = () => {
      setScale(Math.min(1, wrap.clientWidth / PAPER_W));
      setHeight(paper.offsetHeight);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(wrap);
    ro.observe(paper);
    return () => ro.disconnect();
  }, []);

  const logo = view.business.logo;
  const style = { "--inv-accent": template === "minimal" ? "#111111" : accent, transform: `scale(${scale})` };

  return (
    <div className="inv-fit" ref={wrapRef} style={{ height: height * scale }}>
      <div className={`inv-paper inv-paper--${template}`} ref={paperRef} style={style}>
        <header className="inv-paper__head">
          <div className="inv-paper__brand">
            {logo && (
              <span className="inv-paper__logo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo.dataUrl} alt="" />
              </span>
            )}
            <div>
              <div className="inv-paper__bizname">{view.business.name}</div>
              {view.business.profession && <div className="inv-paper__prof">{view.business.profession}</div>}
            </div>
          </div>
          <div className="inv-paper__title">
            <div className="inv-paper__invoice">INVOICE</div>
            <div className="inv-paper__number"># {view.number}</div>
          </div>
        </header>

        <div className="inv-paper__body">
          <section className="inv-paper__parties">
            <div>
              <h4>From</h4>
              {view.business.lines.length ? view.business.lines.map((l, i) => <p key={i}>{l}</p>) : <p>{view.business.name}</p>}
            </div>
            <div>
              <h4>Bill to</h4>
              <p className="inv-paper__strong">{view.billTo.name}</p>
              {view.billTo.lines.map((l, i) => <p key={i}>{l}</p>)}
            </div>
            <div>
              <h4>Details</h4>
              {view.details.map((d) => (
                <p className="inv-paper__kv" key={d.label}>
                  <span>{d.label}</span>
                  <b className={d.tone ? `tone-${d.tone.toLowerCase()}` : ""}>{d.value}</b>
                </p>
              ))}
            </div>
          </section>

          {view.items.length === 0 ? (
            <p className="inv-paper__empty">Add line items to see them here.</p>
          ) : (
            <table className="inv-paper__table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th className="r">Qty</th>
                  <th className="r">Unit price</th>
                  {view.hasDiscountColumn && <th className="r">Disc.</th>}
                  <th className="r">Amount</th>
                </tr>
              </thead>
              <tbody>
                {view.items.map((item, i) => (
                  <tr key={i}>
                    <td className="desc">{item.description}</td>
                    <td className="r">{item.qty}</td>
                    <td className="r">{item.unit}</td>
                    {view.hasDiscountColumn && <td className="r">{item.discount || "-"}</td>}
                    <td className="r">{item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <section className="inv-paper__money">
            <div className="inv-paper__pay">
              {(view.payment.rows.length > 0 || view.payment.custom) && (
                <>
                  <h4>Payment details</h4>
                  {view.payment.rows.map((r) => (
                    <p className="inv-paper__payrow" key={r.label}><span>{r.label}</span><b>{r.value}</b></p>
                  ))}
                  {view.payment.custom && <p className="inv-paper__custom">{view.payment.custom}</p>}
                </>
              )}
            </div>
            <div className="inv-paper__totals">
              {view.totals.map((row) => (
                <p className={`inv-paper__trow ${row.strong ? "is-strong" : ""}`} key={row.key}>
                  <span>{row.label}</span>
                  <b>{row.value}</b>
                </p>
              ))}
              <p className="inv-paper__balance">
                <span>{view.balance.label}</span>
                <b>{view.balance.value}</b>
              </p>
            </div>
          </section>

          {view.notes && (
            <section className="inv-paper__text">
              <h4>Notes</h4>
              <p>{view.notes}</p>
            </section>
          )}
          {view.terms && (
            <section className="inv-paper__text">
              <h4>Terms and conditions</h4>
              <p>{view.terms}</p>
            </section>
          )}
          {view.thankYou && <p className="inv-paper__thanks">{view.thankYou}</p>}
        </div>

        <footer className="inv-paper__foot">
          <span>{view.footer || view.business.name}</span>
          <span>{view.number}</span>
        </footer>
      </div>
    </div>
  );
}

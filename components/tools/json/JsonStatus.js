"use client";

import { formatBytes } from "@/lib/json/jsonTools";

const nf = new Intl.NumberFormat("en-US");

function Stat({ label, value }) {
  return (
    <div className="json-stat">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

// Live result of validation. `variant="card"` is the larger version used by the validator.
export default function JsonStatus({ analysis, busy = false, onGoToError, variant = "inline", id }) {
  const card = variant === "card";

  if (busy) {
    return (
      <div id={id} className="json-status json-status--neutral" role="status" aria-live="polite">
        <strong>Working...</strong>
        <span>Large input, this can take a moment.</span>
      </div>
    );
  }

  if (analysis.state === "empty") {
    return (
      <div id={id} className="json-status json-status--neutral" role="status" aria-live="polite">
        <strong>No JSON yet</strong>
        <span>Paste JSON in the box, or load the sample to try the tool.</span>
      </div>
    );
  }

  if (analysis.state === "unchecked") {
    return (
      <div id={id} className="json-status json-status--neutral" role="status" aria-live="polite">
        <strong>Large input</strong>
        <span>Live checking is paused for big files. Use the button to check it.</span>
      </div>
    );
  }

  if (analysis.state === "valid") {
    const { stats } = analysis;
    const noun = stats.rootType === "object" ? "properties" : stats.rootType === "array" ? "items" : "";
    return (
      <div id={id} className="json-status json-status--valid" role="status" aria-live="polite">
        <strong><span aria-hidden="true">✓ </span>Valid JSON</strong>
        {card ? (
          <dl className="json-stats">
            <Stat label="Root" value={noun ? `${stats.rootType} · ${nf.format(stats.rootCount)} ${noun}` : stats.rootType} />
            <Stat label="Size" value={formatBytes(stats.bytes)} />
            <Stat label="Lines" value={nf.format(stats.lines)} />
            <Stat label="Nesting depth" value={stats.depth} />
            <Stat label="Keys" value={nf.format(stats.keys)} />
          </dl>
        ) : (
          <span>
            {formatBytes(stats.bytes)} · {nf.format(stats.lines)} {stats.lines === 1 ? "line" : "lines"} · depth {stats.depth}
            {noun ? ` · ${stats.rootType} with ${nf.format(stats.rootCount)} ${noun}` : ""}
          </span>
        )}
      </div>
    );
  }

  const { error } = analysis;
  const caretPad = " ".repeat(error.context.caret);
  return (
    <div id={id} className="json-status json-status--invalid" role="alert">
      <strong><span aria-hidden="true">✗ </span>Invalid JSON</strong>
      <span className="json-status__message">{error.message}</span>
      <span className="json-status__where">Line {nf.format(error.line)}, column {nf.format(error.column)}</span>
      <pre className="json-status__context"><code>{error.context.text.replace(/\t/g, " ")}{"\n"}{caretPad}^</code></pre>
      {onGoToError && (
        <button type="button" className="inv-btn" onClick={onGoToError}>Go to error</button>
      )}
    </div>
  );
}

"use client";

import { useMemo } from "react";
import { formatBytes } from "@/lib/json/jsonTools";
import JsonEditor from "./JsonEditor";
import CopyButton from "./CopyButton";
import DownloadButton from "./DownloadButton";

// Browsers get very slow when a textarea holds many megabytes of text, so
// huge results are previewed. Copy and Download always use the full result.
const PREVIEW_CHARS = 1000000;
const PREVIEW_NO_BREAKS = 200000;

function makePreview(value) {
  if (value.length <= PREVIEW_CHARS) return null;
  const cut = value.lastIndexOf("\n", PREVIEW_CHARS);
  const text = value.slice(0, cut > 0 ? cut : PREVIEW_NO_BREAKS);
  let total = 1;
  for (let i = 0; i < value.length; i += 1) if (value.charCodeAt(i) === 10) total += 1;
  let shown = 1;
  for (let i = 0; i < text.length; i += 1) if (text.charCodeAt(i) === 10) shown += 1;
  return { text, shown, total };
}

// Read-only result panel with Copy and Download in its header.
export default function JsonOutput({ id, label, value, filename, empty }) {
  const preview = useMemo(() => makePreview(value), [value]);
  const nf = new Intl.NumberFormat("en-US");

  return (
    <div className="json-panel">
      <JsonEditor
        id={id}
        label={label}
        value={preview ? preview.text : value}
        readOnly
        empty={empty}
        actions={
          <div className="json-panel__actions">
            <CopyButton text={value} label="Copy" />
            <DownloadButton text={value} filename={filename} label="Download .json" />
          </div>
        }
      />
      {preview && (
        <p className="json-preview-note" role="status">
          This result is large ({formatBytes(value.length)}), so only a preview is shown: the first{" "}
          {nf.format(preview.shown)} of {nf.format(preview.total)} lines. Copy and Download give you the complete result.
        </p>
      )}
    </div>
  );
}

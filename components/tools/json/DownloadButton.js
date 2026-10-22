"use client";

import { Icon } from "../invoice/ui";

export default function DownloadButton({ text, filename = "data.json", label = "Download", disabled = false, className = "" }) {
  const onClick = () => {
    const blob = new Blob([text], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <button type="button" className={`inv-btn ${className}`} onClick={onClick} disabled={disabled || !text} title={`Download as ${filename}`}>
      <Icon name="download" /> {label}
    </button>
  );
}

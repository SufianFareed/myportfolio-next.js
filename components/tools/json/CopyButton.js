"use client";

import { useEffect, useRef, useState } from "react";
import { copyText } from "@/lib/invoice/share";
import { Icon } from "../invoice/ui";

export default function CopyButton({ text, label = "Copy", disabled = false, className = "" }) {
  const [state, setState] = useState("idle"); // idle | copied | error
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  const onClick = async () => {
    const ok = await copyText(text);
    setState(ok ? "copied" : "error");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 2000);
  };

  return (
    <button type="button" className={`inv-btn ${className}`} onClick={onClick} disabled={disabled || !text}>
      <Icon name={state === "copied" ? "check" : "copy"} />
      {state === "copied" ? "Copied" : state === "error" ? "Copy failed" : label}
      <span className="sr-only" role="status">
        {state === "copied" ? "Copied to clipboard" : state === "error" ? "Could not copy to clipboard" : ""}
      </span>
    </button>
  );
}

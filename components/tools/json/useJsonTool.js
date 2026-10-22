"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { analyzeJson, EMPTY_ANALYSIS, UNCHECKED_ANALYSIS } from "@/lib/json/jsonTools";

// Above this size we stop validating on every pause and wait for a click.
export const LIVE_LIMIT = 300000;
// Above this size we show a "working" state so the UI never looks frozen.
const BUSY_LIMIT = 1000000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// State shared by the Formatter and the Validator: the text, its live
// validation result, and a helper to run a job on the current text.
export function useJsonTool() {
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState(EMPTY_ANALYSIS);
  const [busy, setBusy] = useState(false);
  const editorRef = useRef(null);
  const latest = useRef("");
  latest.current = text;

  useEffect(() => {
    if (!text.trim()) {
      setAnalysis(EMPTY_ANALYSIS);
      return undefined;
    }
    if (text.length > LIVE_LIMIT) {
      setAnalysis(UNCHECKED_ANALYSIS);
      return undefined;
    }
    const timer = setTimeout(() => setAnalysis(analyzeJson(text)), 250);
    return () => clearTimeout(timer);
  }, [text]);

  // Validates the current text right now, then hands the result to `job`.
  const run = useCallback(async (job) => {
    const value = latest.current;
    if (value.length > BUSY_LIMIT) {
      setBusy(true);
      await sleep(40); // let the "working" state paint first
    }
    try {
      const result = analyzeJson(value);
      setAnalysis(result);
      return job ? job(result, value) : result;
    } finally {
      setBusy(false);
    }
  }, []);

  const goToError = useCallback(() => {
    if (analysis.state === "invalid") editorRef.current?.goTo(analysis.error);
  }, [analysis]);

  const focusEditor = useCallback(() => editorRef.current?.focus(), []);

  return {
    text,
    setText,
    analysis,
    busy,
    run,
    editorRef,
    goToError,
    focusEditor,
    errorLine: analysis.state === "invalid" ? analysis.error.line : 0,
  };
}

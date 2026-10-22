"use client";

import "./json-tools.css";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from "react";

// Must match --json-lh and --json-pad in json-tools.css.
const LINE_HEIGHT = 21;
const PAD = 12;
const MAX_GUTTER_LINES = 50000;

// A plain <textarea> with a line-number gutter and an error-line highlight.
// Native textarea = fast with large input, accessible, and works on mobile.
const JsonEditor = forwardRef(function JsonEditor(
  { id, label, value, onChange, readOnly = false, placeholder, errorLine = 0, onSubmit, describedBy, empty, actions },
  ref
) {
  const textRef = useRef(null);
  const gutterRef = useRef(null);
  const markRef = useRef(null);

  const lineCount = useMemo(() => {
    let count = 1;
    for (let i = 0; i < value.length; i += 1) if (value.charCodeAt(i) === 10) count += 1;
    return count;
  }, [value]);

  const gutterText = useMemo(
    () => (lineCount > MAX_GUTTER_LINES ? null : Array.from({ length: lineCount }, (_, i) => i + 1).join("\n")),
    [lineCount]
  );

  const positionMark = useCallback(() => {
    const mark = markRef.current;
    const area = textRef.current;
    if (!mark || !area) return;
    if (!errorLine || gutterText === null) {
      mark.style.display = "none";
      return;
    }
    mark.style.display = "block";
    mark.style.transform = `translateY(${PAD + (errorLine - 1) * LINE_HEIGHT - area.scrollTop}px)`;
  }, [errorLine, gutterText]);

  useEffect(positionMark, [positionMark, lineCount]);

  const onScroll = () => {
    if (gutterRef.current && textRef.current) gutterRef.current.scrollTop = textRef.current.scrollTop;
    positionMark();
  };

  useImperativeHandle(ref, () => ({
    focus: () => textRef.current?.focus(),
    goTo: ({ position, line }) => {
      const area = textRef.current;
      if (!area) return;
      area.focus();
      area.setSelectionRange(position, Math.min(position + 1, value.length));
      const column = position - (value.lastIndexOf("\n", position - 1) + 1);
      area.scrollTop = Math.max(0, (line - 1) * LINE_HEIGHT - area.clientHeight / 2 + PAD);
      area.scrollLeft = Math.max(0, column * 8.1 - area.clientWidth / 2);
    },
  }));

  const onKeyDown = (e) => {
    if (onSubmit && (e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="json-field">
      <div className="json-field__head">
        <label className="json-label" htmlFor={id}>{label}</label>
        {actions}
      </div>
      <div className={`json-editor ${errorLine ? "is-invalid" : ""} ${readOnly ? "is-readonly" : ""}`}>
        {gutterText !== null && (
          <pre className="json-editor__gutter" ref={gutterRef} aria-hidden="true">{gutterText}</pre>
        )}
        <textarea
          id={id}
          ref={textRef}
          className="json-editor__text"
          value={value}
          readOnly={readOnly}
          placeholder={placeholder}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          onScroll={onScroll}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          wrap="off"
          aria-describedby={describedBy}
          aria-invalid={errorLine ? "true" : undefined}
        />
        <div className="json-editor__mark" ref={markRef} aria-hidden="true" />
        {empty && value === "" && <div className="json-editor__empty">{empty}</div>}
      </div>
    </div>
  );
});

export default JsonEditor;

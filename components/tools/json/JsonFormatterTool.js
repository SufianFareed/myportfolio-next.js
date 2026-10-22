"use client";

import { useState } from "react";
import { formatJson, INDENT_OPTIONS, minifyJson, SAMPLE_JSON } from "@/lib/json/jsonTools";
import { Icon } from "../invoice/ui";
import JsonEditor from "./JsonEditor";
import JsonOutput from "./JsonOutput";
import JsonStatus from "./JsonStatus";
import JsonToolbar from "./JsonToolbar";
import { useJsonTool } from "./useJsonTool";

export default function JsonFormatterTool() {
  const tool = useJsonTool();
  const [indent, setIndent] = useState("2");
  const [output, setOutput] = useState(null); // { text, kind: "formatted" | "minified" }
  const [notice, setNotice] = useState("");

  const onChange = (value) => {
    tool.setText(value);
    setOutput(null); // the result belongs to the previous input
    setNotice("");
  };

  const process = async (kind) => {
    if (!tool.text.trim()) {
      setNotice("Paste some JSON first, or load the sample.");
      tool.focusEditor();
      return;
    }
    await tool.run((result, value) => {
      if (result.state !== "valid") {
        setOutput(null);
        setNotice("This JSON is invalid, so nothing was formatted. The error is shown below the input.");
        return;
      }
      setOutput({ kind, text: kind === "minified" ? minifyJson(value) : formatJson(value, indent) });
      setNotice(kind === "minified" ? "Minified." : "Formatted.");
    });
  };

  const loadSample = () => {
    onChange(SAMPLE_JSON);
    setNotice("Sample loaded. Click Format JSON.");
    tool.focusEditor();
  };

  const clear = () => {
    onChange("");
    setNotice("Cleared.");
    tool.focusEditor();
  };

  const invalid = tool.analysis.state === "invalid";
  const emptyOutput = (
    <p>
      {invalid
        ? "Fix the error in the input to see the formatted result."
        : "Formatted JSON appears here. Paste JSON on the left and click Format JSON."}
    </p>
  );

  return (
    <div className="json-tool">
      <JsonToolbar label="JSON formatter actions">
        <label className="json-toolbar__select">
          <span>Indent</span>
          <select className="inv-select inv-select--inline" value={indent} onChange={(e) => setIndent(e.target.value)}>
            {INDENT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>
        <button type="button" className="inv-btn inv-btn--primary" onClick={() => process("formatted")} disabled={tool.busy}>
          {tool.busy ? "Working..." : "Format JSON"}
        </button>
        <button type="button" className="inv-btn" onClick={() => process("minified")} disabled={tool.busy}>Minify</button>
        <span className="json-toolbar__spacer" />
        <button type="button" className="inv-btn" onClick={loadSample}><Icon name="file" /> Sample</button>
        <button type="button" className="inv-btn" onClick={clear} disabled={!tool.text && !output}><Icon name="eraser" /> Clear</button>
      </JsonToolbar>

      <div className="json-panels">
        <div className="json-panel">
          <JsonEditor
            ref={tool.editorRef}
            id="json-input"
            label="Input JSON"
            value={tool.text}
            onChange={onChange}
            placeholder={'Paste your JSON here, for example {"name": "Ayesha", "active": true}'}
            errorLine={tool.errorLine}
            onSubmit={() => process("formatted")}
            describedBy="json-input-status"
          />
          <JsonStatus id="json-input-status" analysis={tool.analysis} busy={tool.busy} onGoToError={tool.goToError} />
          <p className="json-tip">Tip: press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> (<kbd>⌘</kbd> + <kbd>Enter</kbd> on Mac) to format.</p>
        </div>

        <JsonOutput
          id="json-output"
          label={output?.kind === "minified" ? "Minified JSON" : "Formatted JSON"}
          value={output ? output.text : ""}
          filename={output?.kind === "minified" ? "minified.json" : "formatted.json"}
          empty={emptyOutput}
        />
      </div>

      <p className="json-notice" role="status" aria-live="polite">{notice}</p>
    </div>
  );
}

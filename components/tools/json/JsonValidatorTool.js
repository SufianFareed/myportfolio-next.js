"use client";

import { useState } from "react";
import { formatJson, SAMPLE_INVALID_JSON, SAMPLE_JSON } from "@/lib/json/jsonTools";
import { Icon } from "../invoice/ui";
import CopyButton from "./CopyButton";
import JsonEditor from "./JsonEditor";
import JsonStatus from "./JsonStatus";
import JsonToolbar from "./JsonToolbar";
import { useJsonTool } from "./useJsonTool";

export default function JsonValidatorTool() {
  const tool = useJsonTool();
  const [notice, setNotice] = useState("");

  const onChange = (value) => {
    tool.setText(value);
    setNotice("");
  };

  const validate = async () => {
    if (!tool.text.trim()) {
      setNotice("Paste some JSON first, or load an example.");
      tool.focusEditor();
      return;
    }
    await tool.run((result) => {
      setNotice(result.state === "valid" ? "Valid JSON." : "Invalid JSON. See the details on the right.");
    });
  };

  const format = () => {
    onChange(formatJson(tool.text, "2"));
    setNotice("Formatted with 2 spaces. Use the JSON Formatter for more options.");
  };

  const load = (value, message) => {
    onChange(value);
    setNotice(message);
    tool.focusEditor();
  };

  const clear = () => {
    onChange("");
    setNotice("Cleared.");
    tool.focusEditor();
  };

  const isEmpty = tool.analysis.state === "empty";

  return (
    <div className="json-tool">
      <JsonToolbar label="JSON validator actions">
        <button type="button" className="inv-btn inv-btn--primary" onClick={validate} disabled={tool.busy}>
          {tool.busy ? "Working..." : "Validate JSON"}
        </button>
        <button type="button" className="inv-btn" onClick={format} disabled={tool.analysis.state !== "valid"} title="Available once the JSON is valid">
          Format JSON
        </button>
        <CopyButton text={tool.text} label="Copy" />
        <span className="json-toolbar__spacer" />
        <button type="button" className="inv-btn" onClick={() => load(SAMPLE_JSON, "Valid example loaded.")}><Icon name="check" /> Valid example</button>
        <button type="button" className="inv-btn" onClick={() => load(SAMPLE_INVALID_JSON, "Invalid example loaded.")}><Icon name="x" /> Invalid example</button>
        <button type="button" className="inv-btn" onClick={clear} disabled={!tool.text}><Icon name="eraser" /> Clear</button>
      </JsonToolbar>

      <div className="json-panels">
        <div className="json-panel">
          <JsonEditor
            ref={tool.editorRef}
            id="json-input"
            label="JSON to validate"
            value={tool.text}
            onChange={onChange}
            placeholder={'Paste your JSON here, for example {"name": "Ayesha", "active": true}'}
            errorLine={tool.errorLine}
            onSubmit={validate}
            describedBy="json-result"
          />
          <p className="json-tip">Tip: press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> (<kbd>⌘</kbd> + <kbd>Enter</kbd> on Mac) to validate.</p>
        </div>

        <div className="json-result-card">
          <h2>Result</h2>
          <JsonStatus id="json-result" variant="card" analysis={tool.analysis} busy={tool.busy} onGoToError={tool.goToError} />
          {isEmpty && (
            <ol className="json-steps">
              <li>Paste or type JSON on the left.</li>
              <li>The result updates as you type, or click Validate JSON.</li>
              <li>If it is invalid, you will see the line and column of the problem.</li>
            </ol>
          )}
        </div>
      </div>

      <p className="json-notice" role="status" aria-live="polite">{notice}</p>
    </div>
  );
}

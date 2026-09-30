"use client";

import { useMemo, useState } from "react";
import { computeGigScore } from "@/lib/gigSeoScore";

export default function GigSeoScoreTool() {
  const [keyword, setKeyword] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const result = useMemo(
    () => computeGigScore({ keyword, title, desc }),
    [keyword, title, desc]
  );

  return (
    <div className="tool-grid">
      <div className="tool-panel">
        <div className="terminal__bar terminal__bar--mini">
          <span className="terminal__dot terminal__dot--red"></span>
          <span className="terminal__dot terminal__dot--yellow"></span>
          <span className="terminal__dot terminal__dot--green"></span>
          <span className="terminal__title">gig_details.tsx</span>
        </div>
        <div className="tool-panel__body">
          <label className="field">
            <span className="field__label">Focus keyword</span>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. logo design"
            />
            <span className="tool-hint">The main phrase you want your gig to rank for.</span>
          </label>

          <label className="field">
            <span className="field__label">
              Gig title <span className="tool-charcount">{title.length} / 70</span>
            </span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="I will design a modern minimalist logo"
            />
          </label>

          <label className="field">
            <span className="field__label">
              Gig description <span className="tool-charcount">{desc.length} chars</span>
            </span>
            <textarea
              rows={7}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Paste your full gig description here..."
            ></textarea>
          </label>
        </div>
      </div>

      <div className="tool-results">
        <div className="tool-panel tool-score-panel">
          <div className="tool-scorebar">
            <div className={`tool-scorenum tool-scorenum--${result.hasInput ? result.band : "empty"}`}>
              {result.hasInput ? result.score : "–"}
            </div>
            <div className="tool-scorelabel">
              {result.hasInput ? result.bandLabel : "Fill in the fields to see your score"}
            </div>
          </div>
          <div className="tool-track">
            <div
              className={`tool-fill tool-fill--${result.hasInput ? result.band : "empty"}`}
              style={{ width: result.hasInput ? `${result.score}%` : "0%" }}
            ></div>
          </div>
        </div>

        <div className="tool-panel">
          <p className="tool-section-title">Breakdown</p>
          {result.checks.length === 0 ? (
            <p className="tool-hint">Start typing to see feedback here.</p>
          ) : (
            <div className="tool-checks">
              {result.checks.map((c, i) => (
                <div className="tool-check" key={i}>
                  <div className={`tool-dot tool-dot--${c.level}`}>
                    {c.level === "good" ? "✓" : c.level === "warn" ? "!" : "×"}
                  </div>
                  <div className="tool-checktext">
                    <strong>{c.title}</strong>
                    <span>{c.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

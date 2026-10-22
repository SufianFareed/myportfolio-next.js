import Link from "next/link";

const VALID = `{
  "id": 1024,
  "name": "Ayesha Khan",
  "roles": ["editor", "author"],
  "active": true,
  "lastLogin": null
}`;

const TRAILING = `{
  "name": "Ayesha Khan",
  "roles": ["editor", "author"],
  "active": true,
}`;

const MISSING_COMMA = `{
  "name": "Ayesha"
  "active": true
}`;

const ERRORS = [
  ["Trailing comma: remove the comma before '}'", "There is a comma after the last property or item.", "Delete that comma."],
  ["Expected ',' or '}' after the property value", "A comma is missing between two properties, or a quote inside a string is not escaped.", "Add the comma, or escape inner quotes as \\\"."],
  ["Property names must be wrapped in double quotes", "A key is written like a JavaScript identifier.", "Change {name: 1} to {\"name\": 1}."],
  ["Strings must use double quotes", "A string or key uses single quotes.", "Replace the single quotes with double quotes."],
  ["Unterminated string", "A closing quote is missing, or a raw line break sits inside a string.", "Add the quote, or write the line break as \\n."],
  ["Unexpected end of JSON input", "A closing } or ] is missing, or the text was cut off.", "Close the open brackets and check that you copied everything."],
  ["Comments are not allowed in JSON", "The text contains // or /* */ comments.", "Remove the comments."],
  ["Unexpected content after the end of the JSON value", "There are two JSON values, or extra characters such as a semicolon, after the first one.", "Keep a single value. To send several, put them in an array."],
  ["'undefined' is not valid in JSON", "undefined and NaN exist in JavaScript but not in JSON.", "Use null, a number or a string."],
];

export const validatorFaq = [
  {
    q: "Is my JSON checked on a server?",
    a: "No. Validation runs in your browser. Your JSON is not uploaded, stored or logged.",
  },
  {
    q: "Does valid JSON mean my API will accept it?",
    a: "Not necessarily. This tool checks syntax only: whether the text is well-formed JSON. It does not check that the right fields exist or have the right types. That is the job of JSON Schema or your API's own validation.",
  },
  {
    q: "Why does the error point to a different place than my real mistake?",
    a: "The parser reports the spot where it noticed that something was wrong. A missing comma is reported at the start of the next property, and a missing closing bracket is reported at the end of the text. Look at the line before the one reported.",
  },
  {
    q: "Does it accept comments, single quotes or trailing commas?",
    a: "No. The validator follows the JSON standard strictly. Relaxed formats such as JSON5 and JSONC allow those things, but ordinary JSON parsers, and most APIs, do not.",
  },
  {
    q: "Can I validate a large file?",
    a: "Yes. Files of several megabytes work on a typical computer. For very large input the live check is paused, so use the Validate JSON button.",
  },
  {
    q: "What is the difference between the validator and the formatter?",
    a: "The validator is for checking syntax and locating errors. The JSON Formatter beautifies or minifies valid JSON, lets you choose the indentation and download the result.",
  },
];

export default function ValidatorContent() {
  return (
    <section className="json-content" aria-label="About the JSON Validator">
      <div className="section-inner">
        <article className="prose json-prose">
          <h2 id="what-is-json-validation">What is JSON Validation?</h2>
          <p>
            JSON validation checks that a piece of text follows the rules of the JSON format: braces and brackets
            are balanced, keys and strings use double quotes, commas are in the right places and every value is
            valid. A parser reads the text from top to bottom and stops at the first character that breaks a rule,
            which is why one misplaced comma can make a whole document invalid.
          </p>
          <p>
            This is syntax validation. It tells you whether the JSON is well-formed, not whether it contains the
            fields your application expects. Checking fields and types is called schema validation, and it is a
            separate step.
          </p>

          <h2 id="how-to-validate-json">How to Validate JSON</h2>
          <ol>
            <li>Paste or type your JSON into the input box.</li>
            <li>
              Click <strong>Validate JSON</strong>, or press Ctrl + Enter (Cmd + Enter on a Mac). For smaller input
              the result also updates as you type.
            </li>
            <li>
              If the JSON is valid, you see a short summary: size, lines, nesting depth and number of keys. If it is
              invalid, you see the error, its line and column, and an excerpt of the line. Click <strong>Go to error</strong>
              to jump to it.
            </li>
            <li>Fix the problem and validate again.</li>
          </ol>
          <p>
            Once the JSON is valid you can click <strong>Format JSON</strong> to beautify it with two spaces, or open
            the <Link href="/tools/json-formatter">JSON Formatter</Link> for tab and four-space indentation, minifying
            and file download.
          </p>

          <h2 id="common-json-errors">Common JSON Errors</h2>
          <p>These are the messages you are most likely to see, what they usually mean and how to fix them.</p>
          <div className="json-table-wrap">
            <table className="json-table">
              <thead>
                <tr>
                  <th scope="col">Message</th>
                  <th scope="col">What it means</th>
                  <th scope="col">How to fix it</th>
                </tr>
              </thead>
              <tbody>
                {ERRORS.map(([message, meaning, fix]) => (
                  <tr key={message}>
                    <td>{message}</td>
                    <td>{meaning}</td>
                    <td>{fix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 id="json-validation-examples">JSON Validation Examples</h2>
          <h3>Valid JSON</h3>
          <pre><code>{VALID}</code></pre>
          <p>The validator reports <strong>Valid JSON</strong> and shows a summary of the document.</p>

          <h3>Invalid JSON: trailing comma</h3>
          <pre><code>{TRAILING}</code></pre>
          <p>
            The validator reports <strong>Invalid JSON</strong>: trailing comma, remove the comma before the closing
            brace, at line 4, column 17.
          </p>

          <h3>Invalid JSON: missing comma</h3>
          <pre><code>{MISSING_COMMA}</code></pre>
          <p>
            The error is reported at line 3, column 3, where the next property starts. The actual mistake is the
            missing comma at the end of line 2.
          </p>

          <h2 id="faq">Frequently Asked Questions</h2>
          <div className="json-faq">
            {validatorFaq.map((item) => (
              <div key={item.q}>
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </div>
            ))}
          </div>
          <p>
            Related: beautify or minify valid JSON with the <Link href="/tools/json-formatter">JSON Formatter</Link>.
          </p>
        </article>
      </div>
    </section>
  );
}

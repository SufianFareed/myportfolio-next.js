import Link from "next/link";

const BEFORE = `{"order":{"id":1042,"paid":true,"items":[{"sku":"TSHIRT-M","qty":2,"price":19.99},{"sku":"MUG-01","qty":1,"price":8.5}],"coupon":null}}`;

const AFTER = `{
  "order": {
    "id": 1042,
    "paid": true,
    "items": [
      {
        "sku": "TSHIRT-M",
        "qty": 2,
        "price": 19.99
      },
      {
        "sku": "MUG-01",
        "qty": 1,
        "price": 8.5
      }
    ],
    "coupon": null
  }
}`;

const SINGLE_QUOTES = `{'name': 'Ayesha', active: true,}`;
const FIXED = `{"name": "Ayesha", "active": true}`;
const WIN_PATH = `{"path": "C:\\\\Users\\\\ayesha\\\\notes.txt"}`;

// Shared with the page so the visible FAQ and the FAQ structured data always match.
export const formatterFaq = [
  {
    q: "Is my JSON uploaded anywhere?",
    a: "No. Formatting happens in your browser with JavaScript. Nothing is sent to a server, saved or logged. Close the tab and the data is gone.",
  },
  {
    q: "Does formatting change my data?",
    a: "No. Only the whitespace between values changes. Keys, values, their order and the text of your numbers stay exactly as you wrote them.",
  },
  {
    q: "What is the difference between formatting and minifying?",
    a: "Formatting adds line breaks and indentation so people can read the JSON. Minifying removes all unnecessary whitespace to make the text smaller. Both versions contain exactly the same data.",
  },
  {
    q: "Why does it say my JSON is invalid when it works in my code?",
    a: "Usually the text is a JavaScript object literal, not JSON. Object literals allow single quotes, unquoted keys, trailing commas and comments. JSON allows none of them. The error message shows the exact line and column.",
  },
  {
    q: "Can I format JSON that contains comments?",
    a: "Not directly, because standard JSON has no comments. Remove them first. Formats such as JSONC and JSON5 allow comments, but they need their own parsers.",
  },
  {
    q: "How large a file can I format?",
    a: "There is no fixed limit; it depends on your device's memory. Files of several megabytes are fine on a typical computer. Tens of megabytes can be slow, especially on a phone.",
  },
];

export default function FormatterContent() {
  return (
    <section className="json-content" aria-label="About the JSON Formatter">
      <div className="section-inner">
        <article className="prose json-prose">
          <h2 id="what-is-json">What is JSON?</h2>
          <p>
            JSON (JavaScript Object Notation) is a plain-text format for storing and exchanging structured data.
            It is the default format of most web APIs, and you will meet it in config files such as package.json,
            in the WordPress REST API, in Shopify&apos;s APIs and in almost every JavaScript project.
          </p>
          <p>
            A JSON document is built from two structures: <strong>objects</strong>, which are collections of
            key and value pairs inside curly braces, and <strong>arrays</strong>, which are ordered lists inside
            square brackets. Values can be strings, numbers, <code>true</code>, <code>false</code>, <code>null</code>,
            or more objects and arrays. Keys and strings always use double quotes.
          </p>
          <p>
            Machines read JSON easily. People do not, especially when an API returns it as one long line.
            Formatting fixes that.
          </p>

          <h2 id="how-to-format-json">How to Format JSON</h2>
          <ol>
            <li>Paste your JSON into the input box.</li>
            <li>Choose 2 spaces, 4 spaces or tabs for the indentation.</li>
            <li>Click <strong>Format JSON</strong>, or press Ctrl + Enter (Cmd + Enter on a Mac).</li>
            <li>Copy the result, or download it as <code>formatted.json</code>.</li>
          </ol>
          <p>
            To go the other way, click <strong>Minify</strong>. It removes every space and line break that is not
            part of a string, which is handy before you send JSON in a request or store it compactly.
          </p>
          <p>
            If the JSON is invalid, the tool shows the problem with its line and column instead of producing output.
            If you only want to check syntax, the <Link href="/tools/json-validator">JSON Validator</Link> is built for that.
          </p>

          <h2 id="json-formatting-examples">JSON Formatting Examples</h2>
          <h3>Before: JSON on a single line</h3>
          <pre><code>{BEFORE}</code></pre>
          <h3>After: formatted with 2 spaces</h3>
          <pre><code>{AFTER}</code></pre>
          <p>
            The data is identical. Only the whitespace changed, so the structure is now easy to scan, compare
            and review in a diff.
          </p>

          <h2 id="json-formatter-features">JSON Formatter Features</h2>
          <ul>
            <li>Strict checking with the browser&apos;s own JSON parser, so what passes here also passes in <code>JSON.parse</code>.</li>
            <li>Indent with 2 spaces, 4 spaces or tabs, or minify in one click.</li>
            <li>Clear errors with line and column, an excerpt of the bad line, and a Go to error button.</li>
            <li>
              Formats the text as written. Key order, duplicate keys and long numbers such as 9007199254740993 are
              not changed or rounded.
            </li>
            <li>Copy to clipboard or download as a .json file.</li>
            <li>Handles large input. Files of several megabytes format in about a second on a typical modern computer.</li>
            <li>Private by design: it runs entirely in your browser and nothing is uploaded.</li>
            <li>Works on phones and tablets, in dark or light mode.</li>
          </ul>

          <h2 id="common-json-formatting-problems">Common JSON Formatting Problems</h2>
          <h3>Trailing commas</h3>
          <p>
            A comma after the last item in an object or array is allowed in JavaScript, but not in JSON.
            Delete the comma before the closing <code>{"}"}</code> or <code>]</code>.
          </p>
          <h3>Single quotes and unquoted keys</h3>
          <p>
            JSON needs double quotes around every key and every string. A JavaScript-style object often needs fixing:
          </p>
          <pre><code>{SINGLE_QUOTES}</code></pre>
          <p>becomes</p>
          <pre><code>{FIXED}</code></pre>
          <h3>Comments</h3>
          <p>
            JSON has no comment syntax. Remove <code>{"// line"}</code> and <code>{"/* block */"}</code> comments before
            formatting.
          </p>
          <h3>Missing commas or brackets</h3>
          <p>
            Every property and array item except the last needs a comma after it, and every <code>{"{"}</code> and
            <code>[</code> needs a matching closer. The parser reports where it noticed the problem, so the real
            mistake is often on the line just before the reported one.
          </p>
          <h3>Unescaped characters inside strings</h3>
          <p>
            Double quotes, backslashes and line breaks inside a string must be escaped as <code>{'\\"'}</code>,
            <code>{"\\\\"}</code> and <code>{"\\n"}</code>. Windows file paths are a common trap:
          </p>
          <pre><code>{WIN_PATH}</code></pre>
          <h3>undefined, NaN and Infinity</h3>
          <p>
            These exist in JavaScript but not in JSON. Use <code>null</code>, a number, or a string instead.
          </p>
          <h3>Very large numbers</h3>
          <p>
            JavaScript stores numbers as 64-bit floats, so integers above 9007199254740991 lose precision once your
            code reads them with <code>JSON.parse</code>. This formatter keeps the digits as typed, but if you control the
            API, send large IDs as strings.
          </p>

          <h2 id="faq">Frequently Asked Questions</h2>
          <div className="json-faq">
            {formatterFaq.map((item) => (
              <div key={item.q}>
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </div>
            ))}
          </div>
          <p>
            Related: check syntax and find errors with the <Link href="/tools/json-validator">JSON Validator</Link>.
          </p>
        </article>
      </div>
    </section>
  );
}

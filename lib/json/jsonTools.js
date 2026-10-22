// Pure JSON helpers. Everything runs in the browser; nothing is sent anywhere.
//
// Validity is decided by the browser's native JSON.parse. When it fails we run a
// small diagnostic scanner purely to produce a clear message and an exact
// line/column (native messages differ a lot between Chrome, Firefox and Safari).
// Formatting works on the text itself instead of parse + stringify, so number
// literals (e.g. 9007199254740993), key order and string escapes stay exactly
// as typed.

export const INDENT_OPTIONS = [
  { value: "2", label: "2 spaces" },
  { value: "4", label: "4 spaces" },
  { value: "tab", label: "Tabs" },
];

const BOM = /^\uFEFF/;

const isWs = (c) => c === 32 || c === 9 || c === 10 || c === 13;

export function stripBom(text) {
  return text.replace(BOM, "");
}

// ---------------------------------------------------------------- positions

export function positionToLineColumn(text, position) {
  const upto = text.slice(0, Math.max(0, Math.min(position, text.length)));
  let line = 1;
  let lastBreak = -1;
  for (let i = 0; i < upto.length; i += 1) {
    if (upto.charCodeAt(i) === 10) {
      line += 1;
      lastBreak = i;
    }
  }
  return { line, column: upto.length - lastBreak };
}

// A short, readable excerpt of the offending line with a caret offset.
export function errorContext(text, position) {
  const pos = Math.max(0, Math.min(position, text.length));
  let start = text.lastIndexOf("\n", pos - 1) + 1;
  let end = text.indexOf("\n", pos);
  if (end === -1) end = text.length;
  let caret = pos - start;
  const MAX = 90;
  let prefix = "";
  let suffix = "";
  if (end - start > MAX) {
    const from = Math.max(start, pos - 40);
    const to = Math.min(end, pos + 40);
    if (from > start) prefix = "...";
    if (to < end) suffix = "...";
    caret = pos - from + prefix.length;
    start = from;
    end = to;
  }
  return { text: `${prefix}${text.slice(start, end).replace(/\r$/, "")}${suffix}`, caret };
}

// -------------------------------------------------------------- diagnostics

class JsonSyntaxError extends Error {
  constructor(message, position) {
    super(message);
    this.position = position;
  }
}

function describeChar(ch) {
  if (ch === "\n") return "a line break";
  if (ch === "\t") return "a tab";
  return `'${ch}'`;
}

// Walks the text and throws JsonSyntaxError at the first problem.
function scan(text) {
  const n = text.length;
  let i = 0;

  const fail = (message, position = i) => {
    throw new JsonSyntaxError(message, position);
  };

  const skipWs = () => {
    while (i < n && isWs(text.charCodeAt(i))) i += 1;
    if (text[i] === "/" && (text[i + 1] === "/" || text[i + 1] === "*")) {
      fail("Comments are not allowed in JSON. Remove the comment.");
    }
  };

  const parseString = (isKey) => {
    const start = i;
    i += 1;
    while (i < n) {
      const c = text.charCodeAt(i);
      if (c === 34) {
        i += 1;
        return;
      }
      if (c === 92) {
        const e = text[i + 1];
        if (e === undefined) fail("Unterminated string: missing closing double quote.", start);
        if ('"\\/bfnrt'.includes(e)) {
          i += 2;
        } else if (e === "u") {
          if (!/^[0-9a-fA-F]{4}$/.test(text.slice(i + 2, i + 6))) {
            fail("Invalid unicode escape: \\u must be followed by 4 hex digits.", i);
          }
          i += 6;
        } else {
          fail(`Invalid escape sequence '\\${e}'. Use \\\\ for a literal backslash.`, i);
        }
      } else if (c < 32) {
        fail(
          c === 10 || c === 13
            ? `Unterminated ${isKey ? "property name" : "string"}: a string cannot contain a raw line break. Use \\n instead, or check for a missing closing quote.`
            : "Control characters (such as a tab) must be escaped inside strings.",
          i
        );
      } else {
        i += 1;
      }
    }
    fail("Unterminated string: missing closing double quote.", start);
  };

  const parseNumber = () => {
    const start = i;
    if (text[i] === "-") i += 1;
    if (text[i] === "0") {
      i += 1;
      if (/[0-9]/.test(text[i] || "")) fail("Numbers cannot have leading zeros.", start);
    } else if (/[1-9]/.test(text[i] || "")) {
      while (/[0-9]/.test(text[i] || "")) i += 1;
    } else {
      fail("Invalid number: a digit is required here.", i);
    }
    if (text[i] === ".") {
      i += 1;
      if (!/[0-9]/.test(text[i] || "")) fail("Invalid number: digits are required after the decimal point.", i);
      while (/[0-9]/.test(text[i] || "")) i += 1;
    }
    if (text[i] === "e" || text[i] === "E") {
      i += 1;
      if (text[i] === "+" || text[i] === "-") i += 1;
      if (!/[0-9]/.test(text[i] || "")) fail("Invalid number: digits are required in the exponent.", i);
      while (/[0-9]/.test(text[i] || "")) i += 1;
    }
  };

  const parseWord = () => {
    const start = i;
    while (i < n && /[A-Za-z_$]/.test(text[i])) i += 1;
    const word = text.slice(start, i);
    if (word === "true" || word === "false" || word === "null") return;
    if (["undefined", "NaN", "Infinity"].includes(word)) fail(`'${word}' is not valid in JSON. Use null or a number instead.`, start);
    if (["true", "false", "null"].includes(word.toLowerCase())) fail(`'${word}' must be lowercase: true, false or null.`, start);
    if (["none", "nil"].includes(word.toLowerCase())) fail(`'${word}' is not valid in JSON. Use null.`, start);
    fail(`Unexpected value '${word}'. Text values must be wrapped in double quotes.`, start);
  };

  const parseValue = () => {
    skipWs();
    if (i >= n) fail("Unexpected end of JSON input: a value is missing.", n);
    const ch = text[i];
    if (ch === "{") return parseObject();
    if (ch === "[") return parseArray();
    if (ch === '"') return parseString(false);
    if (ch === "-" || (ch >= "0" && ch <= "9")) return parseNumber();
    if (ch === "'") fail("Strings must use double quotes (\"), not single quotes (').");
    if (ch === "+") fail("Numbers cannot start with '+'.");
    if (ch === ".") fail("Numbers must start with a digit, for example 0.5 instead of .5.");
    if (/[A-Za-z_$]/.test(ch)) return parseWord();
    if (ch === "," || ch === "]" || ch === "}" || ch === ":") fail(`Unexpected ${describeChar(ch)}: a value is expected here.`);
    return fail(`Unexpected character ${describeChar(ch)}.`);
  };

  function parseObject() {
    i += 1;
    skipWs();
    if (text[i] === "}") {
      i += 1;
      return;
    }
    for (;;) {
      skipWs();
      if (i >= n) fail("Unexpected end of JSON input: the object is not closed. A '}' is missing.", n);
      const ch = text[i];
      if (ch === '"') {
        parseString(true);
      } else if (ch === "'") {
        fail("Property names must use double quotes (\"), not single quotes (').");
      } else if (ch === "}") {
        fail("Trailing comma: remove the comma before '}'.", lastComma);
      } else if (/[A-Za-z0-9_$]/.test(ch)) {
        fail("Property names must be wrapped in double quotes.");
      } else {
        fail(`Expected a property name in double quotes but found ${describeChar(ch)}.`);
      }
      skipWs();
      if (text[i] !== ":") {
        fail(i >= n ? "Unexpected end of JSON input: ':' is missing after the property name." : "Expected ':' after the property name.");
      }
      i += 1;
      parseValue();
      skipWs();
      if (i >= n) fail("Unexpected end of JSON input: the object is not closed. A '}' is missing.", n);
      if (text[i] === ",") {
        lastComma = i;
        i += 1;
        continue;
      }
      if (text[i] === "}") {
        i += 1;
        return;
      }
      fail("Expected ',' or '}' after the property value. A comma may be missing, or a quote inside a string may need escaping.");
    }
  }

  function parseArray() {
    i += 1;
    skipWs();
    if (text[i] === "]") {
      i += 1;
      return;
    }
    for (;;) {
      skipWs();
      if (text[i] === "]") fail("Trailing comma: remove the comma before ']'.", lastComma);
      parseValue();
      skipWs();
      if (i >= n) fail("Unexpected end of JSON input: the array is not closed. A ']' is missing.", n);
      if (text[i] === ",") {
        lastComma = i;
        i += 1;
        continue;
      }
      if (text[i] === "]") {
        i += 1;
        return;
      }
      fail("Expected ',' or ']' after the array item. A comma may be missing.");
    }
  }

  let lastComma = 0;
  parseValue();
  skipWs();
  if (i < n) fail("Unexpected content after the end of the JSON value. JSON must contain a single value.");
}

// Returns { message, position } for the first syntax problem.
export function diagnoseJson(text, nativeMessage = "") {
  try {
    scan(text);
  } catch (err) {
    if (err instanceof JsonSyntaxError) return { message: err.message, position: err.position };
    if (err instanceof RangeError) return { message: "This JSON is nested too deeply to analyse.", position: 0 };
    throw err;
  }
  // The scanner found nothing but native parsing failed: fall back to its message.
  const m = /position (\d+)/i.exec(nativeMessage);
  return { message: nativeMessage || "Invalid JSON.", position: m ? Number(m[1]) : 0 };
}

// ----------------------------------------------------------------- analysis

export function utf8Length(text) {
  let bytes = 0;
  for (let i = 0; i < text.length; i += 1) {
    const c = text.charCodeAt(i);
    if (c < 0x80) bytes += 1;
    else if (c < 0x800) bytes += 2;
    else if (c >= 0xd800 && c <= 0xdbff) {
      bytes += 4;
      i += 1;
    } else bytes += 3;
  }
  return bytes;
}

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes < 10240 ? 1 : 0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// One pass over already-valid JSON for the summary line.
export function computeStats(text) {
  const n = text.length;
  let depth = 0;
  let maxDepth = 0;
  let keys = 0;
  let rootCount = 0;
  let rootHasItems = false;
  let lines = 1;
  let rootType = "value";
  let seenRoot = false;

  for (let i = 0; i < n; i += 1) {
    const c = text.charCodeAt(i);
    if (c === 10) {
      lines += 1;
      continue;
    }
    if (isWs(c)) continue;
    if (!seenRoot) {
      seenRoot = true;
      if (c === 123) rootType = "object";
      else if (c === 91) rootType = "array";
      else if (c === 34) rootType = "string";
      else if (c === 116 || c === 102) rootType = "boolean";
      else if (c === 110) rootType = "null";
      else rootType = "number";
    }
    if (c === 34) {
      // skip the string
      i += 1;
      while (i < n) {
        const d = text.charCodeAt(i);
        if (d === 92) i += 2;
        else if (d === 34) break;
        else i += 1;
      }
      if (depth === 1) rootHasItems = true;
      continue;
    }
    if (c === 123 || c === 91) {
      if (depth === 1) rootHasItems = true;
      depth += 1;
      if (depth > maxDepth) maxDepth = depth;
    } else if (c === 125 || c === 93) {
      depth -= 1;
    } else if (c === 58) {
      keys += 1;
    } else if (c === 44) {
      if (depth === 1) rootCount += 1;
    } else if (depth === 1) {
      rootHasItems = true;
    }
  }
  if (rootHasItems) rootCount += 1;
  return { bytes: utf8Length(text), lines, depth: maxDepth, keys, rootType, rootCount };
}

export const EMPTY_ANALYSIS = { state: "empty" };
export const UNCHECKED_ANALYSIS = { state: "unchecked" };

export function analyzeJson(rawText) {
  const text = stripBom(rawText);
  if (!text.trim()) return EMPTY_ANALYSIS;
  try {
    JSON.parse(text);
  } catch (err) {
    const { message, position } = diagnoseJson(text, err && err.message);
    const { line, column } = positionToLineColumn(text, position);
    return { state: "invalid", error: { message, position, line, column, context: errorContext(text, position) } };
  }
  return { state: "valid", stats: computeStats(text) };
}

// ------------------------------------------------------- format and minify

function indentUnit(indent) {
  if (indent === "tab") return "\t";
  const size = Number(indent);
  return " ".repeat(Number.isFinite(size) && size > 0 ? size : 2);
}

// Both functions expect valid JSON (call analyzeJson first).
function rewrite(rawText, unit) {
  const text = stripBom(rawText);
  const n = text.length;
  const pretty = unit !== null;
  const pad = [""];
  const indentFor = (level) => {
    while (pad.length <= level) pad.push(pad[pad.length - 1] + unit);
    return pad[level];
  };
  const out = [];
  let level = 0;
  let i = 0;

  while (i < n) {
    const c = text.charCodeAt(i);
    if (isWs(c)) {
      i += 1;
    } else if (c === 34) {
      let j = i + 1;
      while (j < n) {
        const d = text.charCodeAt(j);
        if (d === 92) j += 2;
        else if (d === 34) break;
        else j += 1;
      }
      out.push(text.slice(i, j + 1));
      i = j + 1;
    } else if (c === 123 || c === 91) {
      let k = i + 1;
      while (k < n && isWs(text.charCodeAt(k))) k += 1;
      const close = c === 123 ? 125 : 93;
      if (text.charCodeAt(k) === close) {
        out.push(text[i] + text[k]);
        i = k + 1;
      } else {
        level += 1;
        out.push(text[i]);
        if (pretty) out.push("\n" + indentFor(level));
        i += 1;
      }
    } else if (c === 125 || c === 93) {
      level -= 1;
      if (pretty) out.push("\n" + indentFor(level));
      out.push(text[i]);
      i += 1;
    } else if (c === 44) {
      out.push(pretty ? ",\n" + indentFor(level) : ",");
      i += 1;
    } else if (c === 58) {
      out.push(pretty ? ": " : ":");
      i += 1;
    } else {
      let j = i;
      while (j < n) {
        const d = text.charCodeAt(j);
        if (isWs(d) || d === 44 || d === 125 || d === 93 || d === 58) break;
        j += 1;
      }
      out.push(text.slice(i, j));
      i = j;
    }
  }
  return out.join("");
}

export function formatJson(text, indent = "2") {
  return rewrite(text, indentUnit(indent));
}

export function minifyJson(text) {
  return rewrite(text, null);
}

export const SAMPLE_JSON =
  '{"id":1024,"name":"Ayesha Khan","email":"ayesha@example.com","active":true,"roles":["editor","author"],"address":{"city":"Karachi","country":"PK"},"balance":1520.75,"lastLogin":null}';

export const SAMPLE_INVALID_JSON = `{
  "name": "Ayesha Khan",
  "roles": ["editor", "author"],
  "active": true,
}`;

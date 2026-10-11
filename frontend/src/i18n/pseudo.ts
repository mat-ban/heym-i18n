/**
 * Pseudo-locale transformation for testing (e.g. en-XA).
 *
 * - Wraps visible text in brackets: [ ... ]
 * - Expands string length by ~40% to detect layout overflows
 * - Converts latin characters to accented lookalikes
 * - Strictly preserves {placeholder}, HTML tags, and @:links untouched
 */

const CHAR_MAP: Record<string, string> = {
  a: "å",
  b: "ƀ",
  c: "ç",
  d: "ð",
  e: "é",
  f: "ƒ",
  g: "ĝ",
  h: "ĥ",
  i: "î",
  j: "ĵ",
  k: "ķ",
  l: "ļ",
  m: "m",
  n: "ñ",
  o: "ö",
  p: "þ",
  q: "q",
  r: "ř",
  s: "š",
  t: "ţ",
  u: "û",
  v: "v",
  w: "ŵ",
  x: "x",
  y: "ý",
  z: "ž",
  A: "Å",
  B: "Ɓ",
  C: "Ç",
  D: "Ð",
  E: "É",
  F: "Ƒ",
  G: "Ĝ",
  H: "Ĥ",
  I: "Î",
  J: "Ĵ",
  K: "Ķ",
  L: "Ļ",
  M: "M",
  N: "Ñ",
  O: "Ö",
  P: "Þ",
  Q: "Q",
  R: "Ř",
  S: "Š",
  T: "Ţ",
  U: "Û",
  V: "V",
  W: "Ŵ",
  X: "X",
  Y: "Ý",
  Z: "Ž",
};

export function pseudolocalizeString(input: string): string {
  if (!input || typeof input !== "string") return input;

  // Split into tokens: keep placeholders like {count}, HTML tags <...>, and @:links intact
  const tokenRegex = /(?:\{[^{}]+\}|<[^>]+>|@:[\w.-]+)/g;
  const parts: string[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(input)) !== null) {
    if (match.index > lastIndex) {
      parts.push(transformPlainText(input.slice(lastIndex, match.index)));
    }
    parts.push(match[0]); // Preserve token verbatim
    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < input.length) {
    parts.push(transformPlainText(input.slice(lastIndex)));
  }

  return `[${parts.join("")}]`;
}

function transformPlainText(text: string): string {
  let transformed = "";
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    transformed += CHAR_MAP[ch] ?? ch;
  }

  // 40% elongation padding for layout overflow testing
  const padLength = Math.max(1, Math.round(text.length * 0.4));
  const pad = "~".repeat(Math.min(padLength, 12));
  return transformed + (pad ? ` ${pad}` : "");
}

/**
 * Transforms an entire translation catalog object into a pseudo-locale catalog.
 */
export function pseudolocalizeCatalog(
  catalog: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(catalog)) {
    if (typeof value === "string") {
      result[key] = pseudolocalizeString(value);
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      result[key] = pseudolocalizeCatalog(value as Record<string, unknown>);
    } else {
      result[key] = value;
    }
  }

  return result;
}

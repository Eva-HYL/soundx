/** @type {import('prettier').Config} */
export default {
  // ── Core formatting ──────────────────────────────────────────────────────────
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',

  // ── JSX ──────────────────────────────────────────────────────────────────────
  jsxSingleQuote: false,
  bracketSameLine: false,

  // ── Trailing punctuation ─────────────────────────────────────────────────────
  trailingComma: 'all',
  bracketSpacing: true,
  arrowParens: 'avoid',

  // ── End of line ──────────────────────────────────────────────────────────────
  endOfLine: 'lf',
};

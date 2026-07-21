'use client'

import React from 'react'

// ---- Display mappings ----

const OP_SYMBOLS: Record<string, string> = {
  '+': '+',
  '-': '\u2212',
  '*': '\u00D7',
  '/': '\u00F7',
  '%': '%',
}

const CONST_SYMBOLS: Record<string, string> = {
  pi: '\u03C0',
  e: 'e',
}

const FUNC_DISPLAY: Record<string, string> = {
  sin: 'sin',
  cos: 'cos',
  tan: 'tan',
  asin: 'sin\u207B\u00B9',
  acos: 'cos\u207B\u00B9',
  atan: 'tan\u207B\u00B9',
  log: 'log',
  ln: 'ln',
  sqrt: '\u221A',
  cbrt: '\u221B',
  abs: '', // handled specially: |x| notation
}

const FUNC_SET = new Set(Object.keys(FUNC_DISPLAY))
const CONST_SET = new Set(Object.keys(CONST_SYMBOLS))

// ---- Token types ----

type Token =
  | { kind: 'num'; raw: string }
  | { kind: 'op'; raw: string }
  | { kind: 'func'; raw: string }
  | { kind: 'const'; raw: string }
  | { kind: 'lparen' }
  | { kind: 'rparen' }
  | { kind: 'fact' }
  | { kind: 'deg' }
  | { kind: 'pow' }
  | { kind: 'space'; raw: string }

// ---- Lexer ----

function tokenize(expr: string): Token[] {
  const tokens: Token[] = []
  let i = 0

  while (i < expr.length) {
    const ch = expr[i]

    // Whitespace → normalize later in renderer
    if (ch === ' ') {
      let s = ''
      while (i < expr.length && expr[i] === ' ') {
        s += expr[i]
        i++
      }
      tokens.push({ kind: 'space', raw: s })
      continue
    }

    // Number: starts with digit, or a dot followed by a digit
    if (
      /[0-9]/.test(ch) ||
      (ch === '.' && i + 1 < expr.length && /[0-9]/.test(expr[i + 1]))
    ) {
      let num = ''
      while (i < expr.length && /[0-9.]/.test(expr[i])) {
        num += expr[i]
        i++
      }
      tokens.push({ kind: 'num', raw: num })
      continue
    }

    // Identifier: function names and constants
    if (/[a-zA-Z]/.test(ch)) {
      let name = ''
      while (i < expr.length && /[a-zA-Z]/.test(expr[i])) {
        name += expr[i]
        i++
      }
      if (FUNC_SET.has(name)) {
        tokens.push({ kind: 'func', raw: name })
      } else if (CONST_SET.has(name)) {
        tokens.push({ kind: 'const', raw: name })
      } else {
        // Unknown identifier — treat as plain number-like text
        tokens.push({ kind: 'num', raw: name })
      }
      continue
    }

    // Single-character tokens
    switch (ch) {
      case '+':
      case '-':
      case '*':
      case '/':
      case '%':
        tokens.push({ kind: 'op', raw: ch })
        break
      case '^':
        tokens.push({ kind: 'pow' })
        break
      case '(':
        tokens.push({ kind: 'lparen' })
        break
      case ')':
        tokens.push({ kind: 'rparen' })
        break
      case '!':
        tokens.push({ kind: 'fact' })
        break
      case '\u00B0':
        tokens.push({ kind: 'deg' })
        break
      default:
        // Unknown character — skip silently
        break
    }
    i++
  }

  return tokens
}

// ---- Helpers ----

/** Find the index of the matching `)` for the `(` at `openIdx` (inclusive).
 *  Returns `tokens.length` when no matching paren exists. */
function findMatchingParen(tokens: Token[], openIdx: number): number {
  let depth = 0
  for (let i = openIdx; i < tokens.length; i++) {
    if (tokens[i].kind === 'lparen') depth++
    if (tokens[i].kind === 'rparen') depth--
    if (depth === 0) return i
  }
  return tokens.length
}

// ---- Renderer ----

function renderTokens(tokens: Token[], keyPrefix = ''): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  let i = 0

  while (i < tokens.length) {
    const t = tokens[i]
    const k = keyPrefix ? `${keyPrefix}.${i}` : `${i}`

    switch (t.kind) {
      case 'num':
        nodes.push(<span key={k}>{t.raw}</span>)
        i++
        break

      case 'op':
        nodes.push(
          <span key={k} className='math-op'>
            {OP_SYMBOLS[t.raw] ?? t.raw}
          </span>
        )
        i++
        break

      case 'const':
        nodes.push(
          <span key={k} className='math-const'>
            {CONST_SYMBOLS[t.raw] ?? t.raw}
          </span>
        )
        i++
        break

      case 'func': {
        if (t.raw === 'abs') {
          // abs(...) → |...|
          if (i + 1 < tokens.length && tokens[i + 1].kind === 'lparen') {
            const closeIdx = findMatchingParen(tokens, i + 1)
            const inner =
              closeIdx < tokens.length
                ? tokens.slice(i + 2, closeIdx)
                : tokens.slice(i + 2)
            nodes.push(
              <span key={k} className='math-abs'>
                |
              </span>
            )
            if (inner.length > 0) {
              nodes.push(...renderTokens(inner, `${k}.inner`))
            }
            nodes.push(
              <span key={`${k}.close`} className='math-abs'>
                |
              </span>
            )
            i = closeIdx < tokens.length ? closeIdx + 1 : tokens.length
          } else {
            nodes.push(<span key={k}>{t.raw}</span>)
            i++
          }
        } else {
          // Regular function: sin, cos, log, sqrt, etc.
          const display = FUNC_DISPLAY[t.raw] ?? t.raw
          nodes.push(
            <span key={k} className='math-func'>
              {display}
            </span>
          )
          i++
        }
        break
      }

      case 'lparen':
        nodes.push(<span key={k}>(</span>)
        i++
        break

      case 'rparen':
        nodes.push(<span key={k}>)</span>)
        i++
        break

      case 'fact':
        nodes.push(<span key={k}>!</span>)
        i++
        break

      case 'deg':
        nodes.push(
          <span key={k} className='math-deg'>
            {'\u00B0'}
          </span>,
        )
        i++
        break

      case 'pow': {
        i++ // skip the ^ token itself
        if (i >= tokens.length) {
          // Trailing ^ with no exponent — show ^ literally
          nodes.push(<span key={k}>^</span>)
        } else if (tokens[i].kind === 'lparen') {
          // ^(expr) — render content as superscript
          const closeIdx = findMatchingParen(tokens, i)
          const inner =
            closeIdx < tokens.length
              ? tokens.slice(i + 1, closeIdx)
              : tokens.slice(i + 1)
          nodes.push(
            <sup key={k}>
              <span>(</span>
              {inner.length > 0 ? renderTokens(inner, `${k}.exp`) : null}
              {closeIdx < tokens.length ? <span>)</span> : null}
            </sup>
          )
          i = closeIdx < tokens.length ? closeIdx + 1 : tokens.length
        } else {
          // ^number or single token → superscript it
          nodes.push(<sup key={k}>{renderTokens([tokens[i]], `${k}.exp`)}</sup>)
          i++
        }
        break
      }

      case 'space':
        // Collapse runs of whitespace into a single space
        nodes.push(<span key={k}> </span>)
        i++
        break

      default:
        i++
    }
  }

  return nodes
}

// ---- Public component ----

const DEG_TRIG = new Set(['sin', 'cos', 'tan'])

/** In degree mode, insert a `°` token before the closing `)` of every sin/cos/tan call. */
function insertDegreeSymbols(
  tokens: Token[],
  angle: 'deg' | 'rad',
): Token[] {
  if (angle !== 'deg') return tokens

  const result: Token[] = []
  let i = 0

  while (i < tokens.length) {
    const t = tokens[i]
    if (
      t.kind === 'func' &&
      DEG_TRIG.has(t.raw) &&
      i + 1 < tokens.length &&
      tokens[i + 1].kind === 'lparen'
    ) {
      const closeIdx = findMatchingParen(tokens, i + 1)
      const end = closeIdx < tokens.length ? closeIdx : tokens.length
      for (let j = i; j < end; j++) {
        result.push(tokens[j])
      }
      result.push({ kind: 'deg' })
      if (closeIdx < tokens.length) {
        result.push(tokens[closeIdx])
      }
      i = closeIdx < tokens.length ? closeIdx + 1 : tokens.length
    } else {
      result.push(t)
      i++
    }
  }

  return result
}

export function MathDisplay({
  expression,
  angle = 'rad',
  className = '',
}: {
  expression: string
  angle?: 'deg' | 'rad'
  className?: string
}) {
  const tokens = tokenize(expression)
  const transformed = insertDegreeSymbols(tokens, angle)
  return (
    <span className={`math-display ${className}`}>
      {renderTokens(transformed)}
    </span>
  )
}

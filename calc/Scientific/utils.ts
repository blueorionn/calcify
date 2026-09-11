/** Returns true when every `(` has a matching `)` and no `)` appears before its `(`. */
export function areParensBalanced(expr: string): boolean {
  let depth = 0
  for (const ch of expr) {
    if (ch === '(') depth++
    if (ch === ')') depth--
    if (depth < 0) return false
  }
  return depth === 0
}

/** Find the index of the `)` that closes the `(` at `openIdx`. Returns -1 if no match. */
export function findParenClose(expr: string, openIdx: number): number {
  if (expr[openIdx] !== '(') return -1

  let depth = 0
  for (let j = openIdx; j < expr.length; j++) {
    if (expr[j] === '(') depth++
    if (expr[j] === ')') depth--
    if (depth === 0) return j
  }
  return -1
}

/** In degree mode, convert sin(x) → sin((x) * pi / 180) and asin(x) → asin(x) * 180 / pi. */
export function convertDegreeTrig(expr: string): string {
  const TRIG = ['sin', 'cos', 'tan']
  const INV_TRIG = ['asin', 'acos', 'atan']
  const all = [...TRIG, ...INV_TRIG]

  let result = ''
  let i = 0

  while (i < expr.length) {
    let matched = false

    for (const fn of all) {
      if (expr.startsWith(`${fn}(`, i)) {
        const openIdx = i + fn.length
        const closeIdx = findParenClose(expr, openIdx)
        if (closeIdx === -1) break
        const inner = convertDegreeTrig(expr.slice(openIdx + 1, closeIdx))

        if (TRIG.includes(fn)) {
          result += `${fn}((${inner}) * pi / 180)`
        } else {
          result += `${fn}(${inner}) * 180 / pi`
        }
        i = closeIdx + 1
        matched = true
        break
      }
    }

    if (!matched) {
      result += expr[i]
      i++
    }
  }

  return result
}

/** Smart backspace — removes the last logical component instead of one character.
 *  Stops when expression is '0'. */
export function smartBackspace(expr: string): string {
  if (expr === '0' || expr.length <= 1) return '0'

  // Binary operator with spaces: " + ", " - ", " * ", " / ", " % "
  if (/ [+\-*/%] $/.test(expr)) return expr.slice(0, -3) || '0'

  // Function prefix ending with '(' : "sin(", "cos(", "log(", etc.
  const FUNCTIONS = [
    'sin(',
    'cos(',
    'tan(',
    'asin(',
    'acos(',
    'atan(',
    'log(',
    'ln(',
    'sqrt(',
    'cbrt(',
    'abs(',
  ]
  for (const fn of FUNCTIONS) {
    if (expr.endsWith(fn)) return expr.slice(0, -fn.length) || '0'
  }

  // Exponent suffix: "^2", "^3"
  if (expr.endsWith('^2') || expr.endsWith('^3'))
    return expr.slice(0, -2) || '0'

  // "^(" — remove both chars
  if (expr.endsWith('^(')) return expr.slice(0, -2) || '0'

  // Constant "pi" (only when preceded by non-alpha or start-of-string)
  if (
    expr.endsWith('pi') &&
    (expr.length === 2 || !/[a-zA-Z]/.test(expr[expr.length - 3]))
  ) {
    return expr.slice(0, -2) || '0'
  }

  return expr.slice(0, -1) || '0'
}

/** Find the last number in the expression and toggle its sign.
 *  Returns the updated expression string, or null if no togglable number exists. */
export function toggleLastNumber(expr: string): string | null {
  let i = expr.length - 1

  // Skip trailing whitespace
  while (i >= 0 && expr[i] === ' ') i--
  if (i < 0) return null

  // Skip trailing )
  while (i >= 0 && expr[i] === ')') i--
  if (i < 0 || !/[0-9]/.test(expr[i])) return null

  // Collect digits and decimal points going backwards
  const numEnd = i + 1
  while (i >= 0 && /[0-9.]/.test(expr[i])) i--
  const digitStart = i + 1

  // Check for a unary minus immediately before the digits
  let minusPos = -1
  if (i >= 0 && expr[i] === '-') {
    // Unary minus if at start-of-string, or preceded by ( or space
    if (i === 0 || expr[i - 1] === '(' || expr[i - 1] === ' ') {
      minusPos = i
      i--
    }
  }

  const digits = expr.slice(digitStart, numEnd)

  // Don't toggle plain zero
  if (parseFloat(digits) === 0) return null

  const numStart = minusPos >= 0 ? minusPos : digitStart
  const prefix = expr.slice(0, numStart)
  const suffix = expr.slice(numEnd)

  if (minusPos >= 0) {
    // Remove the unary minus: -45 → 45
    return prefix + digits + suffix
  }
  // Insert a unary minus: 45 → -45
  return prefix + '-' + digits + suffix
}

/** Returns true when the last number in `expr` already contains a decimal point. */
export function lastNumberHasDecimal(expr: string): boolean {
  let i = expr.length - 1
  while (i >= 0 && /[0-9]/.test(expr[i])) i--
  return i >= 0 && expr[i] === '.'
}

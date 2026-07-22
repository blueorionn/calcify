import { evaluate, round } from 'mathjs'

interface STATE_TYPE {
  error: string | null
  angle: 'deg' | 'rad'
  expression: string
  previousAnswer: string
  memory: string
  inverse: boolean
  overwrite: boolean
}

export const INITIAL_STATE: STATE_TYPE = {
  error: null,
  angle: 'deg',
  expression: '0',
  previousAnswer: '0',
  memory: '0',
  inverse: false,
  overwrite: false,
}

export const ACTIONS = {
  CHANGE_ANGLE: 'ChangeAngle',
  ADD_DIGIT: 'addDigit',
  CHOOSE_OPERATION: 'chooseOperation',
  ADD_CONSTANT: 'addConstant',
  CLEAR: 'clear',
  DELETE: 'delete',
  EVALUATE: 'evaluate',
  INVERSE: 'inverse',
  MEMORY_OPERATION: 'memoryOperation',
  EXPONENTIAL: 'exponential',
  LOG_OPERATION: 'logOperation',
  TRIG_OPERATION: 'trigOperation',
  PARENTHESES: 'parentheses',
  FACTORIAL: 'factorial',
  PLUSMINUS: 'plusminus',
  ABSOLUTE: 'absolute',
}

export type ACTION_TYPE = {
  type: string
  payload?: string
}

/** Returns true when every `(` has a matching `)` and no `)` appears before its `(`. */
function areParensBalanced(expr: string): boolean {
  let depth = 0
  for (const ch of expr) {
    if (ch === '(') depth++
    if (ch === ')') depth--
    if (depth < 0) return false
  }
  return depth === 0
}

/** Find the index of the `)` that closes the `(` at `openIdx`. Returns -1 if no match. */
function findParenClose(expr: string, openIdx: number): number {
  let depth = 0
  for (let j = openIdx; j < expr.length; j++) {
    if (expr[j] === '(') depth++
    if (expr[j] === ')') depth--
    if (depth === 0) return j
  }
  return -1
}

/** In degree mode, convert sin(x) → sin((x) * pi / 180) and asin(x) → asin(x) * 180 / pi. */
function convertDegreeTrig(expr: string): string {
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
        const inner = expr.slice(openIdx + 1, closeIdx)

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

/** Find the last number in the expression and toggle its sign.
 *  Returns the updated expression string, or null if no togglable number exists. */
function toggleLastNumber(expr: string): string | null {
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

/** Smart backspace — removes the last logical component instead of one character.
 *  Stops when expression is '0'. */
function smartBackspace(expr: string): string {
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

/** Returns true when the last number in `expr` already contains a decimal point. */
function lastNumberHasDecimal(expr: string): boolean {
  let i = expr.length - 1
  // Walk backwards past trailing digits
  while (i >= 0 && /[0-9]/.test(expr[i])) i--
  // If the character before the digits is '.', the number already has a decimal
  return i >= 0 && expr[i] === '.'
}

type Handler = (state: STATE_TYPE, action: ACTION_TYPE) => STATE_TYPE

const handlers: Record<string, Handler> = {
  [ACTIONS.ADD_DIGIT](state, action) {
    const payload = action.payload ?? '0'

    if (state.overwrite) {
      // After evaluation, start fresh; '.' alone becomes '0.'
      return {
        ...state,
        expression: payload === '.' ? '0.' : payload,
        overwrite: false,
      }
    }

    // Prevent multiple decimal points in the same number
    if (payload === '.' && lastNumberHasDecimal(state.expression)) {
      return state
    }

    const expr =
      state.expression === '0' && payload !== '.'
        ? payload
        : state.expression + payload
    return { ...state, expression: expr }
  },

  [ACTIONS.CHOOSE_OPERATION](state, action) {
    const expr = `${state.expression} ${action.payload} `
    return { ...state, expression: expr }
  },

  [ACTIONS.CHANGE_ANGLE](state) {
    return { ...state, angle: state.angle === 'deg' ? 'rad' : 'deg' }
  },

  [ACTIONS.CLEAR]() {
    return INITIAL_STATE
  },

  [ACTIONS.EVALUATE](state) {
    if (!areParensBalanced(state.expression)) {
      return {
        ...state,
        error: 'Mismatched parentheses — check your ( and ) count.',
      }
    }

    try {
      const expr =
        state.angle === 'deg'
          ? convertDegreeTrig(state.expression)
          : state.expression
      const result = evaluate(expr)
      const str = String(round(result, 10))
      return {
        ...state,
        expression: str,
        previousAnswer: str,
        overwrite: true,
        error: null,
      }
    } catch {
      return { ...state, error: 'Could not evaluate the expression.' }
    }
  },

  [ACTIONS.INVERSE](state) {
    return { ...state, inverse: !state.inverse }
  },

  [ACTIONS.MEMORY_OPERATION](state, action) {
    if (action.payload === 'MC') return { ...state, memory: '0' }
    if (action.payload === 'MR')
      return {
        ...state,
        expression: state.memory,
        overwrite: true,
      }

    const current = parseFloat(state.expression)
    if (!current || current === 0) return state

    if (action.payload === 'M+') {
      const newMem =
        state.memory === '0'
          ? String(current)
          : String(round(evaluate(`${state.memory} + ${current}`), 10))
      return { ...state, memory: newMem }
    }

    if (action.payload === 'M-') {
      const newMem =
        state.memory === '0'
          ? String(current)
          : String(round(evaluate(`${state.memory} - ${current}`), 10))
      return { ...state, memory: newMem }
    }

    return state
  },

  [ACTIONS.FACTORIAL](state) {
    const expr = `${state.expression}!`
    return { ...state, expression: expr }
  },

  [ACTIONS.PLUSMINUS](state) {
    const expr = toggleLastNumber(state.expression)
    if (!expr) return state
    return { ...state, expression: expr }
  },

  [ACTIONS.ABSOLUTE](state) {
    const expr = `abs(${state.expression})`
    return { ...state, expression: expr }
  },

  [ACTIONS.ADD_CONSTANT](state, action) {
    const constant =
      action.payload === 'pi' ? 'pi' : action.payload === 'e' ? 'e' : null
    if (!constant) return state

    if (state.overwrite || state.expression === '0')
      return { ...state, expression: constant, overwrite: false }
    if (state.expression.endsWith(' '))
      return { ...state, expression: state.expression + constant }

    return { ...state, expression: `${state.expression} * ${constant}` }
  },

  [ACTIONS.EXPONENTIAL](state, action) {
    if (action.payload === 'square') {
      const expr = state.inverse
        ? `sqrt(${state.expression})`
        : `${state.expression}^2`
      return { ...state, expression: expr }
    }
    if (action.payload === 'cube') {
      const expr = state.inverse
        ? `cbrt(${state.expression})`
        : `${state.expression}^3`
      return { ...state, expression: expr }
    }
    if (action.payload === 'XY') {
      const expr = state.inverse
        ? `${state.expression}^(1/`
        : `${state.expression}^`
      return { ...state, expression: expr }
    }
    return state
  },

  [ACTIONS.LOG_OPERATION](state, action) {
    if (action.payload === 'log') {
      const expr = state.inverse
        ? `10^(${state.expression})`
        : `log(${state.expression})`
      return { ...state, expression: expr }
    }
    if (action.payload === 'ln') {
      const expr = state.inverse
        ? `e^(${state.expression})`
        : `ln(${state.expression})`
      return { ...state, expression: expr }
    }
    return state
  },

  [ACTIONS.PARENTHESES](state, action) {
    const expr = `${state.expression}${action.payload}`
    return { ...state, expression: expr }
  },

  [ACTIONS.TRIG_OPERATION](state, action) {
    const trigMap: Record<string, string> = {
      sin: 'sin',
      cos: 'cos',
      tan: 'tan',
    }

    const name = trigMap[action.payload ?? '']
    if (!name) return state

    const func = state.inverse ? `a${name}` : name

    const expr =
      state.expression === '0' || state.overwrite
        ? `${func}(`
        : `${state.expression}${func}(`

    return { ...state, expression: expr, overwrite: false }
  },
}

export function reducer(state: STATE_TYPE, action: ACTION_TYPE): STATE_TYPE {
  // DELETE removes the last component; stops at '0'
  if (action.type === ACTIONS.DELETE) {
    return {
      ...state,
      expression: smartBackspace(state.expression),
      overwrite: false,
      error: null,
    }
  }

  const handler = handlers[action.type]
  if (!handler) return state

  let next = handler(state, action)

  // Only EVALUATE preserves error; every other action clears it
  if (action.type !== ACTIONS.EVALUATE && next.error) {
    next = { ...next, error: null }
  }

  return next
}

import { evaluate, round } from 'mathjs'

interface STATE_TYPE {
  error: string | null
  angle: 'deg' | 'rad'
  expression: string
  previousAnswer: string
  memory: string
  inverse: boolean
  overwrite: boolean
  history: string[]
}

export const INITIAL_STATE: STATE_TYPE = {
  error: null,
  angle: 'deg',
  expression: '0',
  previousAnswer: '0',
  memory: '0',
  inverse: false,
  overwrite: false,
  history: []
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
  ANSWER: 'answer',
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

type Handler = (state: STATE_TYPE, action: ACTION_TYPE) => STATE_TYPE

const handlers: Record<string, Handler> = {
  [ACTIONS.ADD_DIGIT](state, action) {
    if (state.overwrite) {
      const expr = action.payload ?? '0'
      return {
        ...state,
        expression: expr,
        overwrite: false,
      }
    }
    const expr =
      state.expression === '0' && action.payload !== '.'
        ? (action.payload ?? '0')
        : state.expression + (action.payload ?? '')
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
      const result = evaluate(state.expression)
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
    if (state.expression === '0') return state

    const value = evaluate(state.expression)
    const str = String(round(-value, 10))
    return { ...state, expression: str }
  },

  [ACTIONS.ABSOLUTE](state) {
    const expr = `abs(${state.expression})`
    return { ...state, expression: expr }
  },

  [ACTIONS.ANSWER](state) {
    const expr = state.overwrite
      ? state.previousAnswer
      : state.expression + state.previousAnswer
    return {
      ...state,
      expression: expr,
      overwrite: false,
    }
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
    const trigMap: Record<string, { normal: string; inverse: string }> = {
      sin: { normal: 'sin', inverse: 'asin' },
      cos: { normal: 'cos', inverse: 'acos' },
      tan: { normal: 'tan', inverse: 'atan' },
    }

    const fn = trigMap[action.payload ?? '']
    if (!fn) return state

    const func = state.inverse ? fn.inverse : fn.normal
    const deg = state.angle === 'deg'
    const x = state.expression

    if (deg && !state.inverse) {
      const expr = `${func}(${x} * pi / 180)`
      return { ...state, expression: expr }
    }
    if (deg && state.inverse) {
      const expr = `${func}(${x}) * 180 / pi`
      return { ...state, expression: expr }
    }
    const expr = `${func}(${x})`
    return { ...state, expression: expr }
  },
}

export function reducer(state: STATE_TYPE, action: ACTION_TYPE): STATE_TYPE {
  // DELETE is full undo — pop the previous expression from history
  if (action.type === ACTIONS.DELETE) {
    if (state.history.length === 0) {
      return { ...state, expression: '0', overwrite: false, error: null }
    }
    const prev = state.history[state.history.length - 1]
    return {
      ...state,
      expression: prev,
      history: state.history.slice(0, -1),
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

  // Auto-push previous expression to history whenever expression changes
  if (next.expression !== state.expression) {
    next = { ...next, history: [...state.history, state.expression] }
  }

  return next
}

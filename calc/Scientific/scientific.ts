import { evaluate, round } from 'mathjs'
import {
  areParensBalanced,
  convertDegreeTrig,
  convertLogFunctions,
  smartBackspace,
  toggleLastNumber,
  lastNumberHasDecimal,
} from './utils'

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
    return { ...state, expression: expr, overwrite: false }
  },

  [ACTIONS.CHOOSE_OPERATION](state, action) {
    const expr = `${state.expression} ${action.payload} `
    return { ...state, expression: expr, overwrite: false }
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
      const result = evaluate(convertLogFunctions(expr))
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
    return { ...state, expression: expr, overwrite: false }
  },

  [ACTIONS.PLUSMINUS](state) {
    const expr = toggleLastNumber(state.expression)
    if (!expr) return state
    return { ...state, expression: expr, overwrite: false }
  },

  [ACTIONS.ABSOLUTE](state) {
    const expr = `abs(${state.expression})`
    return { ...state, expression: expr, overwrite: false }
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
      return { ...state, expression: expr, overwrite: false }
    }
    if (action.payload === 'cube') {
      const expr = state.inverse
        ? `cbrt(${state.expression})`
        : `${state.expression}^3`
      return { ...state, expression: expr, overwrite: false }
    }
    if (action.payload === 'XY') {
      const expr = state.inverse
        ? `${state.expression}^(1/`
        : `${state.expression}^`
      return { ...state, expression: expr, overwrite: false }
    }
    return state
  },

  [ACTIONS.LOG_OPERATION](state, action) {
    if (action.payload === 'log') {
      const expr = state.inverse
        ? `10^(${state.expression})`
        : `log(${state.expression})`
      return { ...state, expression: expr, overwrite: false }
    }
    if (action.payload === 'ln') {
      const expr = state.inverse
        ? `e^(${state.expression})`
        : `ln(${state.expression})`
      return { ...state, expression: expr, overwrite: false }
    }
    return state
  },

  [ACTIONS.PARENTHESES](state, action) {
    const expr = `${state.expression}${action.payload}`
    return { ...state, expression: expr, overwrite: false }
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

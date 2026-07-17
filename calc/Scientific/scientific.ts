import { evaluate, round, pi, e } from 'mathjs'

interface STATE_TYPE {
  angle: 'deg' | 'rad'
  expression: string
  display: string
  previousAnswer: string
  memory: string
  inverse: boolean
  overwrite: boolean
}

export const INITIAL_STATE: STATE_TYPE = {
  angle: 'deg',
  expression: '0',
  display: '0',
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
  FACTORIAL: 'factorial',
  PLUSMINUS: 'plusminus',
  ABSOLUTE: 'absolute',
  ANSWER: 'answer',
}

export type ACTION_TYPE = {
  type: string
  payload?: string
}

type Handler = (state: STATE_TYPE, action: ACTION_TYPE) => STATE_TYPE

function toDisplay(expr: string): string {
  const result = expr
    .replace(/\^(\d+)/g, '^{$1}')
    .replace(/\*/g, '\\times ')
    .replace(/\//g, '\\div ')
    .replace(/pi/g, '\\pi')
    .replace(/abs\(([^)]*)\)/g, '\\lvert$1\\rvert')
    .replace(/sqrt\(([^)]*)\)/g, '\\sqrt{$1}')
    .replace(/cbrt\(([^)]*)\)/g, '\\sqrt[3]{$1}')
  return result
}

const handlers: Record<string, Handler> = {
  [ACTIONS.ADD_DIGIT](state, action) {
    if (state.overwrite) {
      const expr = action.payload ?? '0'
      return {
        ...state,
        expression: expr,
        display: toDisplay(expr),
        overwrite: false,
      }
    }
    const expr =
      state.expression === '0' && action.payload !== '.'
        ? (action.payload ?? '0')
        : state.expression + (action.payload ?? '')
    return { ...state, expression: expr, display: toDisplay(expr) }
  },

  [ACTIONS.CHOOSE_OPERATION](state, action) {
    const expr = `${state.expression} ${action.payload} `
    return { ...state, expression: expr, display: toDisplay(expr) }
  },

  [ACTIONS.CHANGE_ANGLE](state) {
    return { ...state, angle: state.angle === 'deg' ? 'rad' : 'deg' }
  },

  [ACTIONS.CLEAR]() {
    return INITIAL_STATE
  },

  [ACTIONS.DELETE](state) {
    const expr =
      state.expression.length <= 1 ? '0' : state.expression.slice(0, -1)
    return { ...state, expression: expr, display: toDisplay(expr) }
  },

  [ACTIONS.EVALUATE](state) {
    try {
      const result = evaluate(state.expression)
      const str = String(round(result, 10))
      return {
        ...state,
        expression: str,
        display: toDisplay(str),
        previousAnswer: str,
        overwrite: true,
      }
    } catch {
      console.error('Evaluate Error')
      return state
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
        display: toDisplay(state.memory),
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
    return { ...state, expression: expr, display: toDisplay(expr) }
  },

  [ACTIONS.PLUSMINUS](state) {
    if (state.expression === '0') return state

    const value = evaluate(state.expression)
    const str = String(round(-value, 10))
    return { ...state, expression: str, display: toDisplay(str) }
  },

  [ACTIONS.ABSOLUTE](state) {
    const expr = `abs(${state.expression})`
    return { ...state, expression: expr, display: toDisplay(expr) }
  },

  [ACTIONS.ANSWER](state) {
    const expr = state.overwrite
      ? state.previousAnswer
      : state.expression + state.previousAnswer
    return {
      ...state,
      expression: expr,
      display: toDisplay(expr),
      overwrite: false,
    }
  },

  [ACTIONS.ADD_CONSTANT](state, action) {
    if (action.payload === 'pi') {
      if (state.expression === '0')
        return { ...state, expression: `${pi}`, display: `${pi}` }
    }
    if (action.payload === 'e') {
      if (state.expression === '0')
        return { ...state, expression: `${e}`, display: `${e}` }
    }
    return state
  },

  [ACTIONS.EXPONENTIAL](state, action) {
    if (action.payload === 'square') {
      const expr = state.inverse
        ? `sqrt(${state.expression})`
        : `${state.expression}^2`
      return { ...state, expression: expr, display: toDisplay(expr) }
    }
    if (action.payload === 'cube') {
      const expr = state.inverse
        ? `cbrt(${state.expression})`
        : `${state.expression}^3`
      return { ...state, expression: expr, display: toDisplay(expr) }
    }
    if (action.payload === 'XY') {
      const expr = state.inverse
        ? `${state.expression}^(1/`
        : `${state.expression}^`
      return { ...state, expression: expr, display: toDisplay(expr) }
    }
    return state
  },
}

export function reducer(state: STATE_TYPE, action: ACTION_TYPE): STATE_TYPE {
  const handler = handlers[action.type]
  return handler ? handler(state, action) : state
}

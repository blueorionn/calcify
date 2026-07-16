import { evaluate, round } from 'mathjs'

export const ACTIONS = {
  CHANGE_ANGLE: 'ChangeAngle',
  ADD_DIGIT: 'addDigit',
  CHOOSE_OPERATION: 'chooseOperation',
  CLEAR: 'clear',
  DELETE: 'delete',
  EVALUATE: 'evaluate',
  INVERSE: 'inverse',
  MEMORY_ADD: 'MAdd',
  MEMORY_SUB: 'MSub',
  MEMORY_RECALL: 'MRecall',
  MEMORY_CLEAR: 'MClear',
}

interface STATE_TYPE {
  angle: 'deg' | 'rad'
  previousOperand: string
  currentOperand: string
  operation: string | null
  memory: string
  inverse: boolean
  overwrite: boolean
}

export const INITIAL_STATE: STATE_TYPE = {
  angle: 'deg',
  previousOperand: '0',
  currentOperand: '0',
  operation: null,
  memory: '0',
  inverse: false,
  overwrite: false,
}

export type ACTION_TYPE = {
  type: string
  payload?: string
}

type Handler = (state: STATE_TYPE, action: ACTION_TYPE) => STATE_TYPE

const handlers: Record<string, Handler> = {
  [ACTIONS.ADD_DIGIT](state, action) {
    if (state.overwrite)
      return { ...state, currentOperand: `${action.payload}`, overwrite: false }
    if (action.payload === '0' && state.currentOperand === '0') return state
    if (action.payload === '.' && state.currentOperand.includes('.'))
      return state
    if (action.payload === '.' && state.currentOperand === '0')
      return {
        ...state,
        currentOperand: `${state.currentOperand}${action.payload}`,
      }
    if (action.payload)
      return {
        ...state,
        currentOperand: `${state.currentOperand === '0' ? '' : state.currentOperand}${action.payload}`,
      }
    return state
  },

  [ACTIONS.CHOOSE_OPERATION](state, action) {
    if (state.currentOperand === '0' && state.previousOperand === '0')
      return state
    if (state.currentOperand === '0')
      return { ...state, operation: action.payload || null }
    if (state.previousOperand === '0')
      return {
        ...state,
        previousOperand: state.currentOperand,
        currentOperand: '0',
        operation: action.payload || null,
      }
    return {
      ...state,
      previousOperand: String(
        round(
          evaluate(
            `${state.previousOperand} ${state.operation} ${state.currentOperand}`
          ),
          10
        )
      ),
      operation: action.payload || null,
      currentOperand: '0',
    }
  },

  [ACTIONS.CHANGE_ANGLE](state) {
    return { ...state, angle: state.angle === 'deg' ? 'rad' : 'deg' }
  },

  [ACTIONS.CLEAR]() {
    return INITIAL_STATE
  },

  [ACTIONS.DELETE](state) {
    if (state.currentOperand === '0' || state.currentOperand.length === 1)
      return { ...state, currentOperand: '0' }
    return { ...state, currentOperand: state.currentOperand.slice(0, -1) }
  },

  [ACTIONS.EVALUATE](state) {
    try {
      const result = evaluate(
        `${state.previousOperand} ${state.operation} ${state.currentOperand}`
      )
      return {
        ...state,
        currentOperand: String(round(result, 10)),
        previousOperand: '0',
        operation: null,
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

  [ACTIONS.MEMORY_ADD](state) {
    if (state.currentOperand === '0') return state
    return {
      ...state,
      memory: String(
        round(
          evaluate(
            state.memory === '0'
              ? state.currentOperand
              : `${state.memory} + ${state.currentOperand}`
          ),
          10
        )
      ),
    }
  },

  [ACTIONS.MEMORY_SUB](state) {
    if (state.currentOperand === '0') return state
    return {
      ...state,
      memory: String(
        round(
          evaluate(
            state.memory === '0'
              ? state.currentOperand
              : `${state.memory} - ${state.currentOperand}`
          ),
          10
        )
      ),
    }
  },

  [ACTIONS.MEMORY_RECALL](state) {
    return { ...state, currentOperand: `${state.memory}`, overwrite: true }
  },

  [ACTIONS.MEMORY_CLEAR](state) {
    return { ...state, memory: '0' }
  },
}

export function reducer(state: STATE_TYPE, action: ACTION_TYPE): STATE_TYPE {
  const handler = handlers[action.type]
  return handler ? handler(state, action) : state
}

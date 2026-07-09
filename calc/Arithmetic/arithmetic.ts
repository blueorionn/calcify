import { evaluate, round } from 'mathjs'

export const ACTIONS = {
  ADD_DIGIT: 'addDigit',
  CHOOSE_OPERATION: 'chooseOperation',
  CLEAR: 'clear',
  ALL_CLEAR: 'reset',
  DELETE: 'delete',
  EVALUATE: 'evaluate',
  MEMORY_ADD: 'MAdd',
  MEMORY_SUB: 'MSub',
  MEMORY_RECALL: 'MRecall',
  MEMORY_CLEAR: 'MClear',
}

interface STATE_TYPE {
  previousOperand: string
  currentOperand: string
  operation: string | null
  memory: string
  overwrite: boolean
}

export const INITIAL_STATE: STATE_TYPE = {
  previousOperand: '0',
  currentOperand: '0',
  operation: null,
  memory: '0',
  overwrite: false,
}

export type ACTION_TYPE = {
  type: string
  payload?: string
}

export function reducer(state: STATE_TYPE, action: ACTION_TYPE): STATE_TYPE {
  switch (action.type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite)
        return {
          ...state,
          currentOperand: `${action.payload}`,
          overwrite: false,
        }
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
    case ACTIONS.CHOOSE_OPERATION:
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
    case ACTIONS.CLEAR:
      return { ...state, currentOperand: '0' }
    case ACTIONS.ALL_CLEAR:
      return INITIAL_STATE
    case ACTIONS.DELETE:
      if (state.currentOperand === '0' || state.currentOperand.length === 1)
        return {
          ...state,
          currentOperand: `0`,
        }
      return {
        ...state,
        currentOperand: `${state.currentOperand.slice(0, -1)}`,
      }
    case ACTIONS.EVALUATE:
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
    case ACTIONS.MEMORY_ADD:
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
    case ACTIONS.MEMORY_SUB:
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
    case ACTIONS.MEMORY_RECALL:
      return { ...state, currentOperand: `${state.memory}`, overwrite: true }
    case ACTIONS.MEMORY_CLEAR:
      return { ...state, memory: '0' }
    default:
      return state
  }
}

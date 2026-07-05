import { describe, it, expect } from 'vitest'
import { reducer, INITIAL_STATE, ACTIONS } from '../arithmetic'

// DIGIT TESTS
describe('ADD_DIGIT', () => {
  it('appends a digit to currentOperand', () => {
    const state = reducer(INITIAL_STATE, {
      type: ACTIONS.ADD_DIGIT,
      payload: '5',
    })
    expect(state.currentOperand).toBe('5')
  })

  it('concatenates multiple digits', () => {
    const s1 = reducer(INITIAL_STATE, { type: ACTIONS.ADD_DIGIT, payload: '3' })
    const s2 = reducer(s1, { type: ACTIONS.ADD_DIGIT, payload: '7' })
    expect(s2.currentOperand).toBe('37')
  })

  it('prevents leading zeros ("0" then "0")', () => {
    const s1 = reducer(INITIAL_STATE, { type: ACTIONS.ADD_DIGIT, payload: '0' })
    const s2 = reducer(s1, { type: ACTIONS.ADD_DIGIT, payload: '0' })
    expect(s2.currentOperand).toBe('0')
  })

  it('replaces leading zero with a non-zero digit', () => {
    const s1 = reducer(INITIAL_STATE, { type: ACTIONS.ADD_DIGIT, payload: '0' })
    const s2 = reducer(s1, { type: ACTIONS.ADD_DIGIT, payload: '8' })
    expect(s2.currentOperand).toBe('8')
  })

  it('prevents multiple decimals', () => {
    const s1 = reducer(INITIAL_STATE, { type: ACTIONS.ADD_DIGIT, payload: '5' })
    const s2 = reducer(s1, { type: ACTIONS.ADD_DIGIT, payload: '.' })
    const s3 = reducer(s2, { type: ACTIONS.ADD_DIGIT, payload: '.' })
    expect(s3.currentOperand).toBe('5.')
  })

  it('replaces currentOperand after evaluate (overwrite)', () => {
    // Simulate: 2+3=5, then press 7
    const s1 = reducer(INITIAL_STATE, { type: ACTIONS.ADD_DIGIT, payload: '2' })
    const s2 = reducer(s1, { type: ACTIONS.CHOOSE_OPERATION, payload: '+' })
    const s3 = reducer(s2, { type: ACTIONS.ADD_DIGIT, payload: '3' })
    const s4 = reducer(s3, { type: ACTIONS.EVALUATE })
    expect(s4.currentOperand).toBe('5')
    expect(s4.overwrite).toBe(true)

    const s5 = reducer(s4, { type: ACTIONS.ADD_DIGIT, payload: '7' })
    expect(s5.currentOperand).toBe('7') // replaced, not '57'
    expect(s5.overwrite).toBe(false)
  })
})

// ARITHMETIC OPERATIONS
describe('CHOOSE_OPERATION', () => {
  it('stores currentOperand as previousOperand on first operation', () => {
    const s1 = reducer(INITIAL_STATE, { type: ACTIONS.ADD_DIGIT, payload: '9' })
    const s2 = reducer(s1, { type: ACTIONS.CHOOSE_OPERATION, payload: '+' })
    expect(s2.previousOperand).toBe('9')
    expect(s2.currentOperand).toBe('0')
    expect(s2.operation).toBe('+')
  })

  it('chains calculations when pressed twice', () => {
    const s1 = reducer(INITIAL_STATE, { type: ACTIONS.ADD_DIGIT, payload: '5' })
    const s2 = reducer(s1, { type: ACTIONS.CHOOSE_OPERATION, payload: '+' })
    const s3 = reducer(s2, { type: ACTIONS.ADD_DIGIT, payload: '3' })
    const s4 = reducer(s3, { type: ACTIONS.CHOOSE_OPERATION, payload: '-' })
    // Before applying '-', it should evaluate 5+3=8, store as previous
    expect(s4.previousOperand).toBe('8')
    expect(s4.currentOperand).toBe('0')
    expect(s4.operation).toBe('-')
  })

  it('ignores operation when both operands are 0', () => {
    const state = reducer(INITIAL_STATE, {
      type: ACTIONS.CHOOSE_OPERATION,
      payload: '+',
    })
    expect(state).toEqual(INITIAL_STATE)
  })
})

// EVALUATE RESULT
describe('EVALUATE', () => {
  it('adds two numbers', () => {
    const s1 = reducer(INITIAL_STATE, { type: ACTIONS.ADD_DIGIT, payload: '2' })
    const s2 = reducer(s1, { type: ACTIONS.CHOOSE_OPERATION, payload: '+' })
    const s3 = reducer(s2, { type: ACTIONS.ADD_DIGIT, payload: '3' })
    const s4 = reducer(s3, { type: ACTIONS.EVALUATE })
    expect(s4.currentOperand).toBe('5')
    expect(s4.operation).toBeNull()
  })

  it('subtracts two numbers', () => {
    const s1 = reducer(INITIAL_STATE, { type: ACTIONS.ADD_DIGIT, payload: '1' })
    const s2 = reducer(s1, { type: ACTIONS.ADD_DIGIT, payload: '0' })
    const s3 = reducer(s2, { type: ACTIONS.CHOOSE_OPERATION, payload: '-' })
    const s4 = reducer(s3, { type: ACTIONS.ADD_DIGIT, payload: '3' })
    const s5 = reducer(s4, { type: ACTIONS.EVALUATE })
    expect(s5.currentOperand).toBe('7')
  })

  it('multiplies two numbers', () => {
    const s1 = reducer(INITIAL_STATE, { type: ACTIONS.ADD_DIGIT, payload: '6' })
    const s2 = reducer(s1, { type: ACTIONS.CHOOSE_OPERATION, payload: '*' })
    const s3 = reducer(s2, { type: ACTIONS.ADD_DIGIT, payload: '7' })
    const s4 = reducer(s3, { type: ACTIONS.EVALUATE })
    expect(s4.currentOperand).toBe('42')
  })

  it('divides two numbers', () => {
    const s1 = reducer(INITIAL_STATE, { type: ACTIONS.ADD_DIGIT, payload: '1' })
    const s2 = reducer(s1, { type: ACTIONS.ADD_DIGIT, payload: '0' })
    const s3 = reducer(s2, { type: ACTIONS.CHOOSE_OPERATION, payload: '/' })
    const s4 = reducer(s3, { type: ACTIONS.ADD_DIGIT, payload: '2' })
    const s5 = reducer(s4, { type: ACTIONS.EVALUATE })
    expect(s5.currentOperand).toBe('5')
  })

  it('handles division by zero gracefully', () => {
    const s1 = reducer(INITIAL_STATE, { type: ACTIONS.ADD_DIGIT, payload: '5' })
    const s2 = reducer(s1, { type: ACTIONS.CHOOSE_OPERATION, payload: '/' })
    const s3 = reducer(s2, { type: ACTIONS.ADD_DIGIT, payload: '0' })
    const s4 = reducer(s3, { type: ACTIONS.EVALUATE })
    // mathjs returns Infinity for 5/0
    expect(s4.currentOperand).toBe('Infinity')
  })

  it('sets overwrite to true after evaluate', () => {
    const s1 = reducer(INITIAL_STATE, { type: ACTIONS.ADD_DIGIT, payload: '1' })
    const s2 = reducer(s1, { type: ACTIONS.CHOOSE_OPERATION, payload: '+' })
    const s3 = reducer(s2, { type: ACTIONS.ADD_DIGIT, payload: '1' })
    const s4 = reducer(s3, { type: ACTIONS.EVALUATE })
    expect(s4.overwrite).toBe(true)
  })
})

// SPECIAL FUNTIONS
describe('CLEAR / ALL_CLEAR / DELETE', () => {
  it('CLEAR resets only currentOperand to 0', () => {
    const s1 = reducer(INITIAL_STATE, { type: ACTIONS.ADD_DIGIT, payload: '5' })
    const s2 = reducer(s1, { type: ACTIONS.CLEAR })
    expect(s2.currentOperand).toBe('0')
  })

  it('ALL_CLEAR returns full initial state', () => {
    const s1 = reducer(INITIAL_STATE, { type: ACTIONS.ADD_DIGIT, payload: '5' })
    const s2 = reducer(s1, { type: ACTIONS.CHOOSE_OPERATION, payload: '+' })
    const s3 = reducer(s2, { type: ACTIONS.ADD_DIGIT, payload: '3' })
    const s4 = reducer(s3, { type: ACTIONS.ALL_CLEAR })
    expect(s4).toEqual(INITIAL_STATE)
  })

  it('DELETE removes the last digit', () => {
    const s1 = reducer(INITIAL_STATE, { type: ACTIONS.ADD_DIGIT, payload: '1' })
    const s2 = reducer(s1, { type: ACTIONS.ADD_DIGIT, payload: '2' })
    const s3 = reducer(s2, { type: ACTIONS.ADD_DIGIT, payload: '3' })
    const s4 = reducer(s3, { type: ACTIONS.DELETE })
    expect(s4.currentOperand).toBe('12')
  })

  it('DELETE resets to 0 when only one digit', () => {
    const s1 = reducer(INITIAL_STATE, { type: ACTIONS.ADD_DIGIT, payload: '7' })
    const s2 = reducer(s1, { type: ACTIONS.DELETE })
    expect(s2.currentOperand).toBe('0')
  })
})

describe('Memory functions', () => {
  describe('MEMORY_ADD (M+)', () => {
    it('stores currentOperand into memory when memory is 0', () => {
      const s1 = reducer(INITIAL_STATE, {
        type: ACTIONS.ADD_DIGIT,
        payload: '5',
      })
      const s2 = reducer(s1, { type: ACTIONS.MEMORY_ADD })
      expect(s2.memory).toBe('5')
    })

    it('adds currentOperand to existing memory', () => {
      const s1 = reducer(INITIAL_STATE, {
        type: ACTIONS.ADD_DIGIT,
        payload: '5',
      })
      const s2 = reducer(s1, { type: ACTIONS.MEMORY_ADD })
      const s3 = { ...s2, currentOperand: '3' }
      const s4 = reducer(s3, { type: ACTIONS.MEMORY_ADD })
      expect(s4.memory).toBe('8')
    })

    it('does nothing when currentOperand is 0', () => {
      const state = reducer(INITIAL_STATE, { type: ACTIONS.MEMORY_ADD })
      expect(state.memory).toBe('0')
    })

    it('accumulates across multiple additions', () => {
      const s1 = reducer(INITIAL_STATE, {
        type: ACTIONS.ADD_DIGIT,
        payload: '1',
      })
      const s2 = reducer(s1, { type: ACTIONS.MEMORY_ADD })
      const s3 = { ...s2, currentOperand: '2' }
      const s4 = reducer(s3, { type: ACTIONS.MEMORY_ADD })
      const s5 = { ...s4, currentOperand: '3' }
      const s6 = reducer(s5, { type: ACTIONS.MEMORY_ADD })
      expect(s6.memory).toBe('6')
    })

    it('stores evaluated result into memory', () => {
      const s1 = reducer(INITIAL_STATE, {
        type: ACTIONS.ADD_DIGIT,
        payload: '2',
      })
      const s2 = reducer(s1, { type: ACTIONS.CHOOSE_OPERATION, payload: '+' })
      const s3 = reducer(s2, { type: ACTIONS.ADD_DIGIT, payload: '3' })
      const s4 = reducer(s3, { type: ACTIONS.EVALUATE })
      expect(s4.currentOperand).toBe('5')
      const s5 = reducer(s4, { type: ACTIONS.MEMORY_ADD })
      expect(s5.memory).toBe('5')
    })
  })

  describe('MEMORY_SUB (M−)', () => {
    it('stores currentOperand when memory is 0', () => {
      const s1 = reducer(INITIAL_STATE, {
        type: ACTIONS.ADD_DIGIT,
        payload: '1',
      })
      const s2 = reducer(s1, { type: ACTIONS.ADD_DIGIT, payload: '0' })
      const s3 = reducer(s2, { type: ACTIONS.MEMORY_SUB })
      expect(s3.memory).toBe('10')
    })

    it('subtracts currentOperand from existing memory', () => {
      const s1 = reducer(INITIAL_STATE, {
        type: ACTIONS.ADD_DIGIT,
        payload: '1',
      })
      const s2 = reducer(s1, { type: ACTIONS.ADD_DIGIT, payload: '0' })
      const s3 = reducer(s2, { type: ACTIONS.MEMORY_ADD })
      expect(s3.memory).toBe('10')
      const s4 = { ...s3, currentOperand: '3' }
      const s5 = reducer(s4, { type: ACTIONS.MEMORY_SUB })
      expect(s5.memory).toBe('7')
    })

    it('does nothing when currentOperand is 0', () => {
      const s1 = reducer(INITIAL_STATE, {
        type: ACTIONS.ADD_DIGIT,
        payload: '5',
      })
      const s2 = reducer(s1, { type: ACTIONS.MEMORY_ADD })
      const s3 = reducer(s2, { type: ACTIONS.MEMORY_SUB })
      expect(s3.memory).toBe('0')
    })
  })

  describe('MEMORY_RECALL (MR)', () => {
    it('sets currentOperand to stored memory value', () => {
      const s1 = reducer(INITIAL_STATE, {
        type: ACTIONS.ADD_DIGIT,
        payload: '4',
      })
      const s2 = reducer(s1, { type: ACTIONS.MEMORY_ADD })
      const s3 = reducer(s2, { type: ACTIONS.MEMORY_RECALL })
      expect(s3.currentOperand).toBe('4')
    })

    it('sets overwrite to true after recall', () => {
      const s1 = reducer(INITIAL_STATE, {
        type: ACTIONS.ADD_DIGIT,
        payload: '9',
      })
      const s2 = reducer(s1, { type: ACTIONS.MEMORY_ADD })
      const s3 = reducer(s2, { type: ACTIONS.MEMORY_RECALL })
      expect(s3.overwrite).toBe(true)
    })

    it('recalling then typing a digit replaces (does not append)', () => {
      const s1 = reducer(INITIAL_STATE, {
        type: ACTIONS.ADD_DIGIT,
        payload: '2',
      })
      const s2 = reducer(s1, { type: ACTIONS.MEMORY_ADD })
      const s3 = reducer(s2, { type: ACTIONS.MEMORY_RECALL })
      expect(s3.currentOperand).toBe('2')
      const s4 = reducer(s3, { type: ACTIONS.ADD_DIGIT, payload: '5' })
      expect(s4.currentOperand).toBe('5')
    })
  })

  describe('MEMORY_CLEAR (MC)', () => {
    it('resets memory to 0', () => {
      const s1 = reducer(INITIAL_STATE, {
        type: ACTIONS.ADD_DIGIT,
        payload: '8',
      })
      const s2 = reducer(s1, { type: ACTIONS.MEMORY_ADD })
      expect(s2.memory).toBe('8')
      const s3 = reducer(s2, { type: ACTIONS.MEMORY_CLEAR })
      expect(s3.memory).toBe('0')
    })

    it('memory stays 0 after clearing an already empty memory', () => {
      const state = reducer(INITIAL_STATE, { type: ACTIONS.MEMORY_CLEAR })
      expect(state.memory).toBe('0')
    })
  })

  describe('Memory + overwrite interaction', () => {
    it('evaluate then M+ then type digit starts fresh', () => {
      const s1 = reducer(INITIAL_STATE, {
        type: ACTIONS.ADD_DIGIT,
        payload: '2',
      })
      const s2 = reducer(s1, { type: ACTIONS.CHOOSE_OPERATION, payload: '+' })
      const s3 = reducer(s2, { type: ACTIONS.ADD_DIGIT, payload: '3' })
      const s4 = reducer(s3, { type: ACTIONS.EVALUATE })
      expect(s4.currentOperand).toBe('5')
      expect(s4.overwrite).toBe(true)
      const s5 = reducer(s4, { type: ACTIONS.MEMORY_ADD })
      expect(s5.memory).toBe('5')
      const s6 = reducer(s5, { type: ACTIONS.ADD_DIGIT, payload: '7' })
      expect(s6.currentOperand).toBe('7')
    })
  })
})

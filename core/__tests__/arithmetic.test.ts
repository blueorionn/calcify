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
    const state = reducer(INITIAL_STATE, { type: ACTIONS.CHOOSE_OPERATION, payload: '+' })
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
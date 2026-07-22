import { describe, it, expect } from 'vitest'
import { reducer, INITIAL_STATE, ACTIONS } from '../scientific'

const D = (d: string) => ({ type: ACTIONS.ADD_DIGIT, payload: d } as const)
const OP = (op: string) =>
  ({ type: ACTIONS.CHOOSE_OPERATION, payload: op } as const)
const EV = () => ({ type: ACTIONS.EVALUATE } as const)
const CL = () => ({ type: ACTIONS.CLEAR } as const)
const DEL = () => ({ type: ACTIONS.DELETE } as const)
const TRIG = (t: 'sin' | 'cos' | 'tan') =>
  ({ type: ACTIONS.TRIG_OPERATION, payload: t } as const)
const EXP = (e: 'square' | 'cube' | 'XY') =>
  ({ type: ACTIONS.EXPONENTIAL, payload: e } as const)
const LOG = (l: 'log' | 'ln') =>
  ({ type: ACTIONS.LOG_OPERATION, payload: l } as const)
const PAREN = (p: '(' | ')') =>
  ({ type: ACTIONS.PARENTHESES, payload: p } as const)
const MEM = (m: string) =>
  ({ type: ACTIONS.MEMORY_OPERATION, payload: m } as const)
const CONST = (c: 'pi' | 'e') =>
  ({ type: ACTIONS.ADD_CONSTANT, payload: c } as const)
const INV = () => ({ type: ACTIONS.INVERSE } as const)
const ANG = () => ({ type: ACTIONS.CHANGE_ANGLE } as const)
const PM = () => ({ type: ACTIONS.PLUSMINUS } as const)
const ABS = () => ({ type: ACTIONS.ABSOLUTE } as const)
const FACT = () => ({ type: ACTIONS.FACTORIAL } as const)

/* ------------------------------------------------------------------ */
/*  ADD_DIGIT                                                         */
/* ------------------------------------------------------------------ */
describe('ADD_DIGIT', () => {
  it('replaces initial 0 with a digit', () => {
    const s = reducer(INITIAL_STATE, D('5'))
    expect(s.expression).toBe('5')
  })

  it('concatenates multiple digits', () => {
    const s1 = reducer(INITIAL_STATE, D('4'))
    const s2 = reducer(s1, D('2'))
    expect(s2.expression).toBe('42')
  })

  it('prevents leading zeros (0 then 0)', () => {
    const s = reducer(INITIAL_STATE, D('0'))
    expect(s.expression).toBe('0')
  })

  it('replaces leading zero with a non-zero digit', () => {
    let s = reducer(INITIAL_STATE, D('0'))
    s = reducer(s, D('7'))
    expect(s.expression).toBe('7')
  })

  it('appends decimal point to 0', () => {
    const s = reducer(INITIAL_STATE, D('.'))
    expect(s.expression).toBe('0.')
  })

  it('appends decimal point to a number', () => {
    const s1 = reducer(INITIAL_STATE, D('5'))
    const s2 = reducer(s1, D('.'))
    expect(s2.expression).toBe('5.')
  })

  it('prevents multiple decimal points in same number', () => {
    const s1 = reducer(INITIAL_STATE, D('5'))
    const s2 = reducer(s1, D('.'))
    const s3 = reducer(s2, D('.'))
    expect(s3.expression).toBe('5.')
  })

  it('prevents decimal after existing decimal in compound expression', () => {
    // "5 + 3.14" then "." → ignored
    let s = reducer(INITIAL_STATE, D('5'))
    s = reducer(s, OP('+'))
    s = reducer(s, D('3'))
    s = reducer(s, D('.'))
    s = reducer(s, D('1'))
    s = reducer(s, D('4'))
    s = reducer(s, D('.'))
    expect(s.expression).toBe('5 + 3.14')
  })

  it('allows decimal in a new number after an operator', () => {
    // "5 + " then ".5" → "5 + .5"
    let s = reducer(INITIAL_STATE, D('5'))
    s = reducer(s, OP('+'))
    s = reducer(s, D('.'))
    s = reducer(s, D('5'))
    expect(s.expression).toBe('5 + .5')
  })

  it('replaces expression after evaluate (overwrite)', () => {
    // 2 + 3 = 5, then press 7 → "7"
    let s = reducer(INITIAL_STATE, D('2'))
    s = reducer(s, OP('+'))
    s = reducer(s, D('3'))
    s = reducer(s, EV())
    expect(s.overwrite).toBe(true)
    s = reducer(s, D('7'))
    expect(s.expression).toBe('7')
    expect(s.overwrite).toBe(false)
  })

  it('starts with 0. after evaluate + decimal', () => {
    // 5+3=8, then "." → "0."
    let s = reducer(INITIAL_STATE, D('5'))
    s = reducer(s, OP('+'))
    s = reducer(s, D('3'))
    s = reducer(s, EV())
    s = reducer(s, D('.'))
    expect(s.expression).toBe('0.')
  })
})

/* ------------------------------------------------------------------ */
/*  CHOOSE_OPERATION                                                  */
/* ------------------------------------------------------------------ */
describe('CHOOSE_OPERATION', () => {
  it('appends operator with spaces', () => {
    const s1 = reducer(INITIAL_STATE, D('5'))
    const s2 = reducer(s1, OP('+'))
    expect(s2.expression).toBe('5 + ')
  })

  it('chains operators (mathjs handles evaluation order)', () => {
    let s = reducer(INITIAL_STATE, D('5'))
    s = reducer(s, OP('+'))
    s = reducer(s, D('3'))
    s = reducer(s, OP('*'))
    s = reducer(s, D('2'))
    expect(s.expression).toBe('5 + 3 * 2')
  })
})

/* ------------------------------------------------------------------ */
/*  TRIG_OPERATION                                                    */
/* ------------------------------------------------------------------ */
describe('TRIG_OPERATION', () => {
  it('inserts sin( as prefix when expression is 0', () => {
    const s = reducer(INITIAL_STATE, TRIG('sin'))
    expect(s.expression).toBe('sin(')
  })

  it('inserts cos( as prefix', () => {
    const s = reducer(INITIAL_STATE, TRIG('cos'))
    expect(s.expression).toBe('cos(')
  })

  it('inserts tan( as prefix', () => {
    const s = reducer(INITIAL_STATE, TRIG('tan'))
    expect(s.expression).toBe('tan(')
  })

  it('concatenates with existing expression', () => {
    let s = reducer(INITIAL_STATE, D('5'))
    s = reducer(s, TRIG('sin'))
    expect(s.expression).toBe('5sin(')
  })

  it('replaces when overwrite is true', () => {
    let s = reducer(INITIAL_STATE, D('5'))
    s = reducer(s, OP('+'))
    s = reducer(s, D('3'))
    s = reducer(s, EV()) // overwrite = true
    s = reducer(s, TRIG('sin'))
    expect(s.expression).toBe('sin(')
    expect(s.overwrite).toBe(false)
  })

  describe('inverse mode', () => {
    it('inserts asin( when inverse is on', () => {
      const s1 = reducer(INITIAL_STATE, INV())
      const s2 = reducer(s1, TRIG('sin'))
      expect(s2.expression).toBe('asin(')
    })

    it('inserts acos( when inverse is on', () => {
      const s1 = reducer(INITIAL_STATE, INV())
      const s2 = reducer(s1, TRIG('cos'))
      expect(s2.expression).toBe('acos(')
    })

    it('inserts atan( when inverse is on', () => {
      const s1 = reducer(INITIAL_STATE, INV())
      const s2 = reducer(s1, TRIG('tan'))
      expect(s2.expression).toBe('atan(')
    })
  })
})

/* ------------------------------------------------------------------ */
/*  EVALUATE                                                          */
/* ------------------------------------------------------------------ */
describe('EVALUATE', () => {
  it('evaluates a simple arithmetic expression', () => {
    let s = reducer(INITIAL_STATE, D('5'))
    s = reducer(s, OP('+'))
    s = reducer(s, D('3'))
    s = reducer(s, EV())
    expect(s.expression).toBe('5')
    expect(s.previousAnswer).toBe('5')
    expect(s.overwrite).toBe(true)
  })

  it('evaluates subtraction', () => {
    let s = reducer(INITIAL_STATE, D('1'))
    s = reducer(s, D('0'))
    s = reducer(s, OP('-'))
    s = reducer(s, D('3'))
    s = reducer(s, EV())
    expect(s.expression).toBe('7')
  })

  it('evaluates multiplication', () => {
    let s = reducer(INITIAL_STATE, D('6'))
    s = reducer(s, OP('*'))
    s = reducer(s, D('7'))
    s = reducer(s, EV())
    expect(s.expression).toBe('42')
  })

  it('evaluates division', () => {
    let s = reducer(INITIAL_STATE, D('1'))
    s = reducer(s, D('0'))
    s = reducer(s, OP('/'))
    s = reducer(s, D('2'))
    s = reducer(s, EV())
    expect(s.expression).toBe('5')
  })

  it('handles division by zero (returns Infinity)', () => {
    let s = reducer(INITIAL_STATE, D('5'))
    s = reducer(s, OP('/'))
    s = reducer(s, D('0'))
    s = reducer(s, EV())
    expect(s.expression).toBe('Infinity')
  })

  it('sets error on mismatched parentheses', () => {
    let s = reducer(INITIAL_STATE, D('('))
    s = reducer(s, D('5'))
    s = reducer(s, OP('+'))
    s = reducer(s, D('3'))
    s = reducer(s, EV())
    expect(s.error).toBe(
      'Mismatched parentheses — check your ( and ) count.',
    )
    expect(s.expression).toBe('(5 + 3') // unchanged
  })

  it('sets error on unbalanced closing paren', () => {
    let s = reducer(INITIAL_STATE, D('5'))
    s = reducer(s, PAREN(')'))
    s = reducer(s, EV())
    expect(s.error).toBe(
      'Mismatched parentheses — check your ( and ) count.',
    )
  })

  it('evaluates with balanced parentheses', () => {
    let s = reducer(INITIAL_STATE, PAREN('('))
    s = reducer(s, D('5'))
    s = reducer(s, OP('+'))
    s = reducer(s, D('3'))
    s = reducer(s, PAREN(')'))
    s = reducer(s, OP('*'))
    s = reducer(s, D('2'))
    s = reducer(s, EV())
    // (5+3)*2 = 16
    expect(s.expression).toBe('16')
  })

  it('clears error on successful evaluation', () => {
    // First cause an error
    let s = reducer(INITIAL_STATE, D('('))
    s = reducer(s, D('5'))
    s = reducer(s, EV())
    expect(s.error).toBeTruthy()
    // Fix and re-evaluate
    s = reducer(s, D(')'))
    s = reducer(s, EV())
    expect(s.error).toBeNull()
  })

  describe('trig in degree mode', () => {
    it('sin(45) ≈ 0.7071', () => {
      let s = reducer(INITIAL_STATE, TRIG('sin'))
      s = reducer(s, D('4'))
      s = reducer(s, D('5'))
      s = reducer(s, PAREN(')'))
      s = reducer(s, EV())
      const result = parseFloat(s.expression)
      expect(result).toBeCloseTo(0.7071, 3)
    })

    it('cos(60) = 0.5', () => {
      let s = reducer(INITIAL_STATE, TRIG('cos'))
      s = reducer(s, D('6'))
      s = reducer(s, D('0'))
      s = reducer(s, PAREN(')'))
      s = reducer(s, EV())
      const result = parseFloat(s.expression)
      expect(result).toBeCloseTo(0.5, 4)
    })

    it('tan(45) ≈ 1', () => {
      let s = reducer(INITIAL_STATE, TRIG('tan'))
      s = reducer(s, D('4'))
      s = reducer(s, D('5'))
      s = reducer(s, PAREN(')'))
      s = reducer(s, EV())
      const result = parseFloat(s.expression)
      expect(result).toBeCloseTo(1, 4)
    })

    it('sin(30) = 0.5', () => {
      let s = reducer(INITIAL_STATE, TRIG('sin'))
      s = reducer(s, D('3'))
      s = reducer(s, D('0'))
      s = reducer(s, PAREN(')'))
      s = reducer(s, EV())
      const result = parseFloat(s.expression)
      expect(result).toBeCloseTo(0.5, 4)
    })
  })

  describe('inverse trig in degree mode', () => {
    it('asin(0.5) = 30°', () => {
      let s = reducer(INITIAL_STATE, INV())
      s = reducer(s, TRIG('sin'))
      s = reducer(s, D('.'))
      s = reducer(s, D('5'))
      s = reducer(s, PAREN(')'))
      s = reducer(s, EV())
      const result = parseFloat(s.expression)
      expect(result).toBeCloseTo(30, 4)
    })

    it('acos(0.5) = 60°', () => {
      let s = reducer(INITIAL_STATE, INV())
      s = reducer(s, TRIG('cos'))
      s = reducer(s, D('.'))
      s = reducer(s, D('5'))
      s = reducer(s, PAREN(')'))
      s = reducer(s, EV())
      const result = parseFloat(s.expression)
      expect(result).toBeCloseTo(60, 4)
    })

    it('atan(1) = 45°', () => {
      let s = reducer(INITIAL_STATE, INV())
      s = reducer(s, TRIG('tan'))
      s = reducer(s, D('1'))
      s = reducer(s, PAREN(')'))
      s = reducer(s, EV())
      const result = parseFloat(s.expression)
      expect(result).toBeCloseTo(45, 4)
    })
  })

  describe('trig in radian mode', () => {
    it('sin(pi/2) = 1', () => {
      let s = reducer(INITIAL_STATE, ANG()) // switch to rad
      s = reducer(s, TRIG('sin'))
      s = reducer(s, CONST('pi'))
      s = reducer(s, OP('/'))
      s = reducer(s, D('2'))
      s = reducer(s, PAREN(')'))
      s = reducer(s, EV())
      const result = parseFloat(s.expression)
      expect(result).toBeCloseTo(1, 4)
    })

    it('cos(pi) = -1', () => {
      let s = reducer(INITIAL_STATE, ANG())
      s = reducer(s, TRIG('cos'))
      s = reducer(s, CONST('pi'))
      s = reducer(s, PAREN(')'))
      s = reducer(s, EV())
      const result = parseFloat(s.expression)
      expect(result).toBeCloseTo(-1, 4)
    })
  })

  it('sets error on invalid expression', () => {
    let s = reducer(INITIAL_STATE, D('5'))
    s = reducer(s, OP('+'))
    // trailing operator is invalid
    s = reducer(s, EV())
    expect(s.error).toBe('Could not evaluate the expression.')
  })
})

/* ------------------------------------------------------------------ */
/*  DELETE (smartBackspace)                                           */
/* ------------------------------------------------------------------ */
describe('DELETE', () => {
  it('removes last digit', () => {
    let s = reducer(INITIAL_STATE, D('1'))
    s = reducer(s, D('2'))
    s = reducer(s, D('3'))
    s = reducer(s, DEL())
    expect(s.expression).toBe('12')
  })

  it('resets to 0 when one char remains', () => {
    const s1 = reducer(INITIAL_STATE, D('7'))
    const s2 = reducer(s1, DEL())
    expect(s2.expression).toBe('0')
  })

  it('stays at 0 when expression is already 0', () => {
    const s = reducer(INITIAL_STATE, DEL())
    expect(s.expression).toBe('0')
  })

  it('removes full operator with spaces at once', () => {
    let s = reducer(INITIAL_STATE, D('5'))
    s = reducer(s, OP('+'))
    // expression: "5 + "
    expect(s.expression).toBe('5 + ')
    s = reducer(s, DEL())
    expect(s.expression).toBe('5')
  })

  it('removes function prefix "sin(" in one backspace', () => {
    const s1 = reducer(INITIAL_STATE, TRIG('sin'))
    expect(s1.expression).toBe('sin(')
    const s2 = reducer(s1, DEL())
    expect(s2.expression).toBe('0')
  })

  it('removes "cos(" in one backspace', () => {
    const s1 = reducer(INITIAL_STATE, TRIG('cos'))
    const s2 = reducer(s1, DEL())
    expect(s2.expression).toBe('0')
  })

  it('removes "log(" in one backspace', () => {
    let s = reducer(INITIAL_STATE, LOG('log'))
    s = reducer(s, DEL())
    expect(s.expression).toBe('0')
  })

  it('removes "ln(" in one backspace', () => {
    let s = reducer(INITIAL_STATE, LOG('ln'))
    s = reducer(s, DEL())
    expect(s.expression).toBe('0')
  })

  it('removes "sqrt(" in one backspace', () => {
    let s = reducer(INITIAL_STATE, EXP('square'))
    s = reducer(s, INV()) // inverse → sqrt
    s = reducer(s, EXP('square'))
    expect(s.expression).toBe('sqrt(0')
    s = reducer(s, DEL()) // remove the '0' first
    expect(s.expression).toBe('sqrt(')
    s = reducer(s, DEL()) // now remove "sqrt("
    expect(s.expression).toBe('0')
  })

  it('removes exponent "^2" in one backspace', () => {
    let s = reducer(INITIAL_STATE, D('5'))
    s = reducer(s, EXP('square'))
    expect(s.expression).toBe('5^2')
    s = reducer(s, DEL())
    expect(s.expression).toBe('5')
  })

  it('removes exponent "^3" in one backspace', () => {
    let s = reducer(INITIAL_STATE, D('5'))
    s = reducer(s, EXP('cube'))
    expect(s.expression).toBe('5^3')
    s = reducer(s, DEL())
    expect(s.expression).toBe('5')
  })

  it('removes "^(" in one backspace', () => {
    let s = reducer(INITIAL_STATE, D('5'))
    s = reducer(s, EXP('XY'))
    // expression: "5^"
    expect(s.expression).toBe('5^')
    // type "(1" so we get "5^(1"
    s = reducer(s, PAREN('('))
    s = reducer(s, D('1'))
    expect(s.expression).toBe('5^(1')
    // backspace removes '1'
    s = reducer(s, DEL())
    expect(s.expression).toBe('5^(')
    // backspace removes '^('
    s = reducer(s, DEL())
    expect(s.expression).toBe('5')
  })

  it('removes "pi" in one backspace', () => {
    let s = reducer(INITIAL_STATE, CONST('pi'))
    expect(s.expression).toBe('pi')
    s = reducer(s, DEL())
    expect(s.expression).toBe('0')
  })

  it('removes "pi" after an operator', () => {
    let s = reducer(INITIAL_STATE, D('5'))
    s = reducer(s, OP('*'))
    s = reducer(s, CONST('pi'))
    expect(s.expression).toBe('5 * pi')
    s = reducer(s, DEL())
    expect(s.expression).toBe('5 * ')
    s = reducer(s, DEL())
    expect(s.expression).toBe('5')
  })
})

/* ------------------------------------------------------------------ */
/*  CLEAR                                                             */
/* ------------------------------------------------------------------ */
describe('CLEAR', () => {
  it('resets to INITIAL_STATE', () => {
    let s = reducer(INITIAL_STATE, D('5'))
    s = reducer(s, OP('+'))
    s = reducer(s, D('3'))
    s = reducer(s, CL())
    expect(s).toEqual(INITIAL_STATE)
  })

  it('clears any error', () => {
    let s = reducer(INITIAL_STATE, D('('))
    s = reducer(s, D('5'))
    s = reducer(s, EV())
    expect(s.error).toBeTruthy()
    s = reducer(s, CL())
    expect(s.error).toBeNull()
  })
})

/* ------------------------------------------------------------------ */
/*  PLUSMINUS                                                         */
/* ------------------------------------------------------------------ */
describe('PLUSMINUS', () => {
  it('negates a positive number', () => {
    const s1 = reducer(INITIAL_STATE, D('4'))
    const s2 = reducer(s1, D('5'))
    const s3 = reducer(s2, PM())
    expect(s3.expression).toBe('-45')
  })

  it('removes unary minus from negative number', () => {
    // Start with -45
    let s = reducer(INITIAL_STATE, PM()) // does nothing on '0'
    // Build positive then negate
    s = reducer(INITIAL_STATE, D('4'))
    s = reducer(s, D('5'))
    s = reducer(s, PM())
    expect(s.expression).toBe('-45')
    s = reducer(s, PM())
    expect(s.expression).toBe('45')
  })

  it('negates last number in compound expression', () => {
    let s = reducer(INITIAL_STATE, D('5'))
    s = reducer(s, OP('+'))
    s = reducer(s, D('3'))
    s = reducer(s, PM())
    expect(s.expression).toBe('5 + -3')
  })

  it('removes minus from last negative number in expression', () => {
    let s = reducer(INITIAL_STATE, D('5'))
    s = reducer(s, OP('+'))
    s = reducer(s, D('3'))
    s = reducer(s, PM()) // → "5 + -3"
    s = reducer(s, PM()) // → "5 + 3"
    expect(s.expression).toBe('5 + 3')
  })

  it('does nothing on 0', () => {
    const s = reducer(INITIAL_STATE, PM())
    expect(s.expression).toBe('0')
  })

  it('negates inside parentheses', () => {
    let s = reducer(INITIAL_STATE, TRIG('sin'))
    s = reducer(s, D('4'))
    s = reducer(s, D('5'))
    s = reducer(s, PM())
    expect(s.expression).toBe('sin(-45')
  })

  it('removes minus inside parentheses', () => {
    let s = reducer(INITIAL_STATE, TRIG('sin'))
    s = reducer(s, D('4'))
    s = reducer(s, D('5'))
    s = reducer(s, PM()) // → "sin(-45"
    s = reducer(s, PM()) // → "sin(45"
    expect(s.expression).toBe('sin(45')
  })
})

/* ------------------------------------------------------------------ */
/*  ABSOLUTE                                                          */
/* ------------------------------------------------------------------ */
describe('ABSOLUTE', () => {
  it('wraps expression in abs()', () => {
    const s1 = reducer(INITIAL_STATE, D('5'))
    const s2 = reducer(s1, ABS())
    expect(s2.expression).toBe('abs(5)')
  })

  it('wraps negative expression', () => {
    let s = reducer(INITIAL_STATE, D('5'))
    s = reducer(s, PM())
    s = reducer(s, ABS())
    expect(s.expression).toBe('abs(-5)')
  })
})

/* ------------------------------------------------------------------ */
/*  FACTORIAL                                                         */
/* ------------------------------------------------------------------ */
describe('FACTORIAL', () => {
  it('appends factorial sign', () => {
    const s1 = reducer(INITIAL_STATE, D('5'))
    const s2 = reducer(s1, FACT())
    expect(s2.expression).toBe('5!')
  })

  it('evaluates 5! = 120', () => {
    let s = reducer(INITIAL_STATE, D('5'))
    s = reducer(s, FACT())
    s = reducer(s, EV())
    expect(s.expression).toBe('120')
  })
})

/* ------------------------------------------------------------------ */
/*  EXPONENTIAL                                                       */
/* ------------------------------------------------------------------ */
describe('EXPONENTIAL', () => {
  it('wraps in x^2', () => {
    const s1 = reducer(INITIAL_STATE, D('5'))
    const s2 = reducer(s1, EXP('square'))
    expect(s2.expression).toBe('5^2')
  })

  it('wraps in x^3', () => {
    const s1 = reducer(INITIAL_STATE, D('2'))
    const s2 = reducer(s1, EXP('cube'))
    expect(s2.expression).toBe('2^3')
  })

  it('appends ^ for XY', () => {
    const s1 = reducer(INITIAL_STATE, D('5'))
    const s2 = reducer(s1, EXP('XY'))
    expect(s2.expression).toBe('5^')
  })

  it('wraps in sqrt in inverse mode', () => {
    let s = reducer(INITIAL_STATE, D('1'))
    s = reducer(s, D('6'))
    s = reducer(s, INV())
    s = reducer(s, EXP('square'))
    expect(s.expression).toBe('sqrt(16)')
  })

  it('wraps in cbrt in inverse mode', () => {
    let s = reducer(INITIAL_STATE, D('2'))
    s = reducer(s, D('7'))
    s = reducer(s, INV())
    s = reducer(s, EXP('cube'))
    expect(s.expression).toBe('cbrt(27)')
  })

  it('appends ^(1/ for inverse XY', () => {
    let s = reducer(INITIAL_STATE, D('8'))
    s = reducer(s, INV())
    s = reducer(s, EXP('XY'))
    expect(s.expression).toBe('8^(1/')
  })

  it('evaluates 4^2 = 16', () => {
    let s = reducer(INITIAL_STATE, D('4'))
    s = reducer(s, EXP('square'))
    s = reducer(s, EV())
    expect(s.expression).toBe('16')
  })

  it('evaluates sqrt(16) = 4', () => {
    let s = reducer(INITIAL_STATE, D('1'))
    s = reducer(s, D('6'))
    s = reducer(s, INV())
    s = reducer(s, EXP('square'))
    s = reducer(s, EV())
    expect(s.expression).toBe('4')
  })
})

/* ------------------------------------------------------------------ */
/*  LOG_OPERATION                                                     */
/* ------------------------------------------------------------------ */
describe('LOG_OPERATION', () => {
  it('wraps in log()', () => {
    let s = reducer(INITIAL_STATE, D('1'))
    s = reducer(s, D('0'))
    s = reducer(s, D('0'))
    s = reducer(s, LOG('log'))
    expect(s.expression).toBe('log(100)')
  })

  it('wraps in ln()', () => {
    let s = reducer(INITIAL_STATE, D('1'))
    s = reducer(s, LOG('ln'))
    expect(s.expression).toBe('ln(1)')
  })

  it('wraps in 10^() in inverse mode', () => {
    let s = reducer(INITIAL_STATE, D('2'))
    s = reducer(s, INV())
    s = reducer(s, LOG('log'))
    expect(s.expression).toBe('10^(2)')
  })

  it('wraps in e^() in inverse mode', () => {
    let s = reducer(INITIAL_STATE, D('1'))
    s = reducer(s, INV())
    s = reducer(s, LOG('ln'))
    expect(s.expression).toBe('e^(1)')
  })

  it('evaluates log(100) = 2', () => {
    let s = reducer(INITIAL_STATE, D('1'))
    s = reducer(s, D('0'))
    s = reducer(s, D('0'))
    s = reducer(s, LOG('log'))
    s = reducer(s, EV())
    expect(s.expression).toBe('2')
  })

  it('evaluates ln(1) = 0', () => {
    let s = reducer(INITIAL_STATE, D('1'))
    s = reducer(s, LOG('ln'))
    s = reducer(s, EV())
    expect(s.expression).toBe('0')
  })
})

/* ------------------------------------------------------------------ */
/*  ADD_CONSTANT                                                      */
/* ------------------------------------------------------------------ */
describe('ADD_CONSTANT', () => {
  it('inserts pi when expression is 0', () => {
    const s = reducer(INITIAL_STATE, CONST('pi'))
    expect(s.expression).toBe('pi')
  })

  it('inserts e when expression is 0', () => {
    const s = reducer(INITIAL_STATE, CONST('e'))
    expect(s.expression).toBe('e')
  })

  it('inserts pi with implicit multiplication after a number', () => {
    const s1 = reducer(INITIAL_STATE, D('5'))
    const s2 = reducer(s1, CONST('pi'))
    expect(s2.expression).toBe('5 * pi')
  })

  it('inserts pi without multiplication after an operator', () => {
    let s = reducer(INITIAL_STATE, D('5'))
    s = reducer(s, OP('+'))
    s = reducer(s, CONST('pi'))
    expect(s.expression).toBe('5 + pi')
  })

  it('replaces when overwrite is true', () => {
    let s = reducer(INITIAL_STATE, D('5'))
    s = reducer(s, OP('+'))
    s = reducer(s, D('3'))
    s = reducer(s, EV())
    s = reducer(s, CONST('pi'))
    expect(s.expression).toBe('pi')
    expect(s.overwrite).toBe(false)
  })
})

/* ------------------------------------------------------------------ */
/*  PARENTHESES                                                       */
/* ------------------------------------------------------------------ */
describe('PARENTHESES', () => {
  it('appends opening paren', () => {
    const s = reducer(INITIAL_STATE, PAREN('('))
    expect(s.expression).toBe('0(')
  })

  it('appends closing paren', () => {
    let s = reducer(INITIAL_STATE, TRIG('sin'))
    s = reducer(s, D('4'))
    s = reducer(s, D('5'))
    s = reducer(s, PAREN(')'))
    expect(s.expression).toBe('sin(45)')
  })
})

/* ------------------------------------------------------------------ */
/*  CHANGE_ANGLE                                                      */
/* ------------------------------------------------------------------ */
describe('CHANGE_ANGLE', () => {
  it('toggles from deg to rad', () => {
    const s = reducer(INITIAL_STATE, ANG())
    expect(s.angle).toBe('rad')
  })

  it('toggles back to deg', () => {
    const s1 = reducer(INITIAL_STATE, ANG())
    const s2 = reducer(s1, ANG())
    expect(s2.angle).toBe('deg')
  })
})

/* ------------------------------------------------------------------ */
/*  INVERSE                                                           */
/* ------------------------------------------------------------------ */
describe('INVERSE', () => {
  it('toggles inverse flag', () => {
    const s = reducer(INITIAL_STATE, INV())
    expect(s.inverse).toBe(true)
  })

  it('toggles back', () => {
    const s1 = reducer(INITIAL_STATE, INV())
    const s2 = reducer(s1, INV())
    expect(s2.inverse).toBe(false)
  })
})

/* ------------------------------------------------------------------ */
/*  MEMORY_OPERATION                                                  */
/* ------------------------------------------------------------------ */
describe('MEMORY_OPERATION', () => {
  it('MC clears memory to 0', () => {
    // First add something to memory
    let s = reducer(INITIAL_STATE, D('5'))
    s = reducer(s, MEM('M+'))
    expect(s.memory).toBe('5')
    s = reducer(s, MEM('MC'))
    expect(s.memory).toBe('0')
  })

  it('MR recalls memory into expression', () => {
    // Store 5 in memory, clear expression, recall
    let s = reducer(INITIAL_STATE, D('5'))
    s = reducer(s, MEM('M+'))
    s = reducer(s, CL())
    s = reducer(s, MEM('MR'))
    expect(s.expression).toBe('5')
  })

  it('M+ adds current to memory', () => {
    let s = reducer(INITIAL_STATE, D('7'))
    s = reducer(s, MEM('M+'))
    expect(s.memory).toBe('7')
    // Simulate typing a new value
    s = { ...s, expression: '3' }
    s = reducer(s, MEM('M+'))
    expect(s.memory).toBe('10')
  })

  it('M- subtracts current from memory', () => {
    let s = reducer(INITIAL_STATE, D('1'))
    s = reducer(s, D('0'))
    s = reducer(s, MEM('M+'))
    expect(s.memory).toBe('10')
    s = { ...s, expression: '3' }
    s = reducer(s, MEM('M-'))
    expect(s.memory).toBe('7')
  })

  it('M+/M- do nothing when current is 0', () => {
    const s = reducer(INITIAL_STATE, MEM('M+'))
    expect(s.memory).toBe('0')
  })

  it('M+/M- do nothing on non-numeric expression', () => {
    let s = reducer(INITIAL_STATE, TRIG('sin'))
    s = reducer(s, MEM('M+'))
    expect(s.memory).toBe('0')
  })
})

/* ------------------------------------------------------------------ */
/*  ERROR clearing on follow-up actions                               */
/* ------------------------------------------------------------------ */
describe('Error clearing', () => {
  it('clears error on next digit', () => {
    let s = reducer(INITIAL_STATE, D('('))
    s = reducer(s, D('5'))
    s = reducer(s, EV())
    expect(s.error).toBeTruthy()
    s = reducer(s, D(')'))
    expect(s.error).toBeNull()
  })

  it('clears error on operator', () => {
    let s = reducer(INITIAL_STATE, D('('))
    s = reducer(s, EV())
    expect(s.error).toBeTruthy()
    s = reducer(s, OP('+'))
    expect(s.error).toBeNull()
  })

  it('clears error on DELETE', () => {
    let s = reducer(INITIAL_STATE, D('('))
    s = reducer(s, EV())
    expect(s.error).toBeTruthy()
    s = reducer(s, DEL())
    expect(s.error).toBeNull()
  })

  it('preserves error on second EVALUATE if still broken', () => {
    let s = reducer(INITIAL_STATE, D('('))
    s = reducer(s, EV())
    expect(s.error).toBeTruthy()
    // Still broken
    s = reducer(s, EV())
    expect(s.error).toBeTruthy()
  })

  it('clears error when EVALUATE succeeds after a fix', () => {
    let s = reducer(INITIAL_STATE, D('('))
    s = reducer(s, D('5'))
    s = reducer(s, EV())
    expect(s.error).toBeTruthy()
    // Add closing paren and re-evaluate
    s = reducer(s, PAREN(')'))
    s = reducer(s, EV())
    expect(s.error).toBeNull()
  })
})

/* ------------------------------------------------------------------ */
/*  End-to-end sequences                                              */
/* ------------------------------------------------------------------ */
describe('End-to-end', () => {
  it('computes sin(30) * 2 = 1 in degree mode', () => {
    let s = reducer(INITIAL_STATE, TRIG('sin'))
    s = reducer(s, D('3'))
    s = reducer(s, D('0'))
    s = reducer(s, PAREN(')'))
    s = reducer(s, OP('*'))
    s = reducer(s, D('2'))
    s = reducer(s, EV())
    expect(parseFloat(s.expression)).toBeCloseTo(1, 4)
  })

  it('computes 3^2 + 4^2 = 25', () => {
    let s = reducer(INITIAL_STATE, D('3'))
    s = reducer(s, EXP('square'))
    s = reducer(s, OP('+'))
    s = reducer(s, D('4'))
    s = reducer(s, EXP('square'))
    s = reducer(s, EV())
    expect(s.expression).toBe('25')
  })

  it('computes log(100) + ln(e) = 3', () => {
    // log(100) = 2, ln(e) = 1
    let s = reducer(INITIAL_STATE, D('1'))
    s = reducer(s, D('0'))
    s = reducer(s, D('0'))
    s = reducer(s, LOG('log'))
    s = reducer(s, OP('+'))
    s = reducer(s, CONST('e'))
    s = reducer(s, LOG('ln'))
    s = reducer(s, EV())
    expect(parseFloat(s.expression)).toBeCloseTo(3, 4)
  })

  it('handles overwrite flag correctly: op after eval then digit', () => {
    // 5+3=8, then + 2 = 10
    let s = reducer(INITIAL_STATE, D('5'))
    s = reducer(s, OP('+'))
    s = reducer(s, D('3'))
    s = reducer(s, EV()) // 8, overwrite=true
    s = reducer(s, OP('+')) // should append operator, not replace
    // FIXME: currently CHOOSE_OPERATION doesn't reset overwrite,
    // so the next digit will replace "8 + " with just the digit.
    // This test documents the known bug (#1).
    s = reducer(s, D('2'))
    // BUG: expression should be "8 + 2" but is "2" due to overwrite
    expect(s.expression).toBe('8 + 2')
  })
})

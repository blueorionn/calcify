'use client'
import type { Dispatch } from 'react'
import { ACTION_TYPE, ACTIONS } from '../scientific'
import { InlineMath } from 'react-katex'
import { Delete } from 'lucide-react'

// Digits (0-9)
export function DigitButton({
  digit,
  dispatch,
}: {
  digit: number
  dispatch: Dispatch<ACTION_TYPE>
}) {
  return (
    <button
      className='bg-secondary text-foreground py-4 text-xl font-medium transition-colors duration-200 hover:brightness-85 active:brightness-75'
      onClick={() =>
        dispatch({ type: ACTIONS.ADD_DIGIT, payload: String(digit) })
      }
    >
      {digit}
    </button>
  )
}

export function PeriodButton({
  dispatch,
}: {
  dispatch: Dispatch<ACTION_TYPE>
}) {
  return (
    <button
      className='bg-secondary text-foreground py-4 text-xl font-medium transition-colors duration-200 hover:brightness-85 active:brightness-75'
      onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: '.' })}
    >
      .
    </button>
  )
}

// Basic Operations (add, sub, mul, div, modulus)
export function OperationButton({
  operation,
  dispatch,
}: {
  operation: '+' | '-' | '*' | '/' | '%'
  dispatch: Dispatch<ACTION_TYPE>
}) {
  const operatorDisplay: Record<string, string> = {
    '+': '+',
    '-': '\u2212',
    '*': '\u00D7',
    '/': '\u00F7',
    '%': '\u0025',
    '+-': '\u00B1',
  }

  return (
    <button
      className='bg-accent text-accent-foreground py-4 text-xl font-medium transition-colors duration-200 hover:brightness-85 active:brightness-75'
      onClick={() =>
        dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: String(operation) })
      }
    >
      {operatorDisplay[operation]}
    </button>
  )
}

// Constants (e.g. pi, euler's constant)
export function ConstantButton({ constant }: { constant: 'pi' | 'e' }) {
  return (
    <button className='bg-secondary text-foreground py-4 text-xl font-medium transition-colors duration-200 hover:brightness-85 active:brightness-75'>
      <InlineMath
        math={`${constant === 'pi' ? '\\mathrm{\\pi}' : '\\mathrm{e}'}`}
      />
    </button>
  )
}

// Trig functions (sin, cos, tan) and their inverse
export function TrigButton({
  inverse,
  trig,
}: {
  inverse: boolean
  trig: 'sin' | 'cos' | 'tan'
}) {
  return (
    <button className='bg-secondary text-foreground py-4 text-xl font-medium transition-colors duration-200 hover:brightness-85 active:brightness-75'>
      {inverse ? (
        <>
          {trig}
          <sup>-1</sup>
        </>
      ) : (
        trig
      )}
    </button>
  )
}

// Angle Button (degree, radians)
export function AngleButton({
  active,
  dispatch,
}: {
  active: 'deg' | 'rad'
  dispatch: Dispatch<ACTION_TYPE>
}) {
  return (
    <button
      className='bg-secondary col-span-2 flex items-center py-4 text-xl font-medium'
      onClick={() => dispatch({ type: ACTIONS.CHANGE_ANGLE })}
    >
      <div className='flex flex-1 flex-col items-center gap-1'>
        <span
          className={`transition-colors duration-150 ${
            active === 'deg' ? 'text-foreground' : 'text-foreground/30'
          }`}
        >
          DEG
        </span>
        <div
          className={`bg-foreground/30 h-px w-5 rounded-full transition-all duration-200 ${
            active === 'deg' ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
          }`}
        />
      </div>
      <div className='flex flex-1 flex-col items-center gap-1'>
        <span
          className={`transition-colors duration-150 ${
            active === 'rad' ? 'text-foreground' : 'text-foreground/30'
          }`}
        >
          RAD
        </span>
        <div
          className={`bg-foreground/30 h-px w-5 rounded-full transition-all duration-200 ${
            active === 'rad' ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
          }`}
        />
      </div>
    </button>
  )
}

export function ParenthesesButton({ type }: { type: '(' | ')' }) {
  return (
    <button className='bg-secondary text-foreground py-4 text-xl font-medium transition-colors duration-200 hover:brightness-85 active:brightness-75'>
      {type}
    </button>
  )
}

// Logs (base10, natural) and their inverse (10^x, e^x)
export function LogButton({
  inverse,
  ltype,
}: {
  inverse: boolean
  ltype: 'log' | 'ln'
}) {
  return (
    <button className='bg-secondary text-foreground py-4 text-xl font-medium transition-colors duration-200 hover:brightness-85 active:brightness-75'>
      {inverse ? (
        ltype === 'log' ? (
          <InlineMath math='\mathsf{10^{x}}' />
        ) : (
          <InlineMath math='\mathsf{e^{x}}' />
        )
      ) : (
        ltype
      )}
    </button>
  )
}

export function InverseButton({
  value,
  dispatch,
}: {
  value: boolean
  dispatch: Dispatch<ACTION_TYPE>
}) {
  return (
    <>
      <button
        className={`bg-secondary py-4 text-xl font-medium transition-colors duration-200 hover:brightness-85 active:brightness-75 ${value ? 'text-foreground' : 'text-foreground/50'}`}
        onClick={() => dispatch({ type: ACTIONS.INVERSE })}
      >
        2nd
      </button>
    </>
  )
}

// exponential buttons (e.g. xʸ, x¹∕ʸ)
export function ExponentialButton({
  inverse,
  etype,
  dispatch,
}: {
  inverse: boolean
  etype: {
    name: 'square' | 'cube' | 'XY'
    normal: string
    inverse: string
  }
  dispatch: Dispatch<ACTION_TYPE>
}) {
  return (
    <button className='bg-secondary text-foreground py-4 text-xl font-medium transition-colors duration-200 hover:brightness-85 active:brightness-75'>
      {inverse ? (
        <InlineMath math={`${etype.inverse}`} />
      ) : (
        <InlineMath math={`${etype.normal}`} />
      )}
    </button>
  )
}

// Operation takes place on CurrentOperand
export function FunctionButton({ func }: { func: string }) {
  return (
    <button className='bg-accent text-accent-foreground py-4 text-xl font-medium transition-colors duration-200 hover:brightness-85 active:brightness-75'>
      {func}
    </button>
  )
}

// Evaluate (=)
export function EvaluateButton({
  dispatch,
}: {
  dispatch: Dispatch<ACTION_TYPE>
}) {
  return (
    <button
      className='bg-primary hover:bg-primary/80 text-primary-foreground active:bg-primary/60 col-span-2 py-4 text-xl font-medium transition-colors duration-200'
      onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
    >
      =
    </button>
  )
}

// Memory Function Button
export function MemoryButton({
  mtype,
  dispatch,
}: {
  mtype: 'add' | 'sub' | 'recall' | 'clear'
  dispatch: Dispatch<ACTION_TYPE>
}) {
  const TEXT_DISPLAY = {
    add: 'M+',
    sub: 'M-',
    recall: 'MR',
    clear: 'MC',
  }
  return (
    <button
      className='bg-muted text-muted-foreground hover:bg-muted/80 py-2 text-sm font-medium transition-colors duration-200 active:brightness-75'
      onClick={() => {
        if (mtype === 'add') dispatch({ type: ACTIONS.MEMORY_ADD })
        if (mtype === 'sub') dispatch({ type: ACTIONS.MEMORY_SUB })
        if (mtype === 'recall') dispatch({ type: ACTIONS.MEMORY_RECALL })
        if (mtype === 'clear') dispatch({ type: ACTIONS.MEMORY_CLEAR })
      }}
    >
      {TEXT_DISPLAY[mtype]}
    </button>
  )
}

// Clear and Delete Button
export function ClearButton({
  ctype,
  dispatch,
}: {
  ctype: 'AC' | 'DEL'
  dispatch: Dispatch<ACTION_TYPE>
}) {
  return (
    <button
      className='bg-secondary text-foreground flex items-center justify-center py-4 text-xl font-medium transition-colors duration-200 hover:brightness-85 active:brightness-75'
      onClick={() =>
        ctype === 'AC'
          ? dispatch({ type: ACTIONS.CLEAR })
          : dispatch({ type: ACTIONS.DELETE })
      }
    >
      {ctype === 'AC' ? 'AC' : <Delete className='h-6 w-6' />}
    </button>
  )
}

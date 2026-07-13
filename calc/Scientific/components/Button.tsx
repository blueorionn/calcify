'use client'
import type { Dispatch } from 'react'
import { ACTION_TYPE, ACTIONS } from '../scientific'
import { InlineMath } from 'react-katex'

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

export function OperationButton({
  operation,
  dispatch,
}: {
  operation: '+' | '-' | '*' | '/' | '%' | '+-'
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

export function ConstantButton({
  constant,
  fn,
}: {
  constant: 'pi' | 'e'
  fn?: string
}) {
  const constantDisplay: Record<string, string> = {
    pi: '\u03C0',
    e: 'e',
  }

  return (
    <button className='bg-secondary text-foreground py-4 text-xl font-medium transition-colors duration-200 hover:brightness-85 active:brightness-75'>
      {fn === undefined ? (
        constantDisplay[constant]
      ) : (
        <InlineMath math={`${fn}`} />
      )}
    </button>
  )
}

export function TrigButton({ trig }: { trig: 'sin' | 'cos' | 'tan' }) {
  return (
    <button className='bg-secondary text-foreground py-4 text-xl font-medium transition-colors duration-200 hover:brightness-85 active:brightness-75'>
      {trig}
    </button>
  )
}

export function AngleButton({ active }: { active: 'deg' | 'rad' }) {
  return (
    <div className='bg-secondary col-span-2 flex items-center py-4 text-xl font-medium'>
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
    </div>
  )
}

export function ParenthesesButton({ type }: { type: '(' | ')' }) {
  return (
    <button className='bg-secondary text-foreground py-4 text-xl font-medium transition-colors duration-200 hover:brightness-85 active:brightness-75'>
      {type}
    </button>
  )
}

export function LogButton({ type }: { type: 'log' | 'ln' }) {
  return (
    <button className='bg-secondary text-foreground py-4 text-xl font-medium transition-colors duration-200 hover:brightness-85 active:brightness-75'>
      {type}
    </button>
  )
}

export function FunctionButton({ func, fn }: { func: string; fn?: string }) {
  return (
    <button className='bg-secondary text-foreground py-4 text-xl font-medium transition-colors duration-200 hover:brightness-85 active:brightness-75'>
      {fn === undefined ? func : <InlineMath math={`${fn}`} />}
    </button>
  )
}

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

export function ClearButton({
  type,
  dispatch,
}: {
  type: 'AC' | 'DEL'
  dispatch: Dispatch<ACTION_TYPE>
}) {
  return (
    <button
      className='bg-secondary text-foreground py-4 text-xl font-medium transition-colors duration-200 hover:brightness-85 active:brightness-75'
      onClick={() =>
        type === 'AC'
          ? dispatch({ type: ACTIONS.CLEAR })
          : dispatch({ type: ACTIONS.DELETE })
      }
    >
      {type}
    </button>
  )
}

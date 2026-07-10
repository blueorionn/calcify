'use client'
import type { Dispatch } from 'react'
import { ACTIONS, type ACTION_TYPE } from '@/calc/Arithmetic/arithmetic'
import { Delete } from 'lucide-react'

export const operatorDisplay: Record<string, string> = {
  '+': '+',
  '-': '\u2212',
  '*': '\u00D7',
  '/': '\u00F7',
  '%': '\u0025',
}

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
  operation: '+' | '-' | '*' | '/' | '%'
  dispatch: Dispatch<ACTION_TYPE>
}) {
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

export function EvaluateButton({
  dispatch,
}: {
  dispatch: Dispatch<ACTION_TYPE>
}) {
  return (
    <button
      className='bg-primary hover:bg-primary/80 text-primary-foreground active:bg-primary/60 py-4 text-xl font-medium transition-colors duration-200'
      onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
    >
      =
    </button>
  )
}

export function DeleteButton({
  dispatch,
}: {
  dispatch: Dispatch<ACTION_TYPE>
}) {
  return (
    <button
      className='bg-accent text-accent-foreground flex items-center justify-center py-4 text-xl font-medium transition-colors duration-200 hover:brightness-85 active:brightness-75'
      onClick={() => dispatch({ type: ACTIONS.DELETE })}
    >
      <Delete className='h-6 w-6' />
    </button>
  )
}

// Clear Button
export function ClearButton({
  btype,
  dispatch,
}: {
  btype: 'clear' | 'all_clear'
  dispatch: Dispatch<ACTION_TYPE>
}) {
  const TEXT = {
    clear: 'C',
    all_clear: 'AC',
  }

  return (
    <button
      className='bg-muted py-4 text-sm font-medium tracking-wide uppercase transition-colors duration-200 hover:brightness-85 active:brightness-75'
      onClick={() => {
        if (btype === 'all_clear') dispatch({ type: ACTIONS.ALL_CLEAR })
        if (btype === 'clear') dispatch({ type: ACTIONS.CLEAR })
      }}
    >
      {TEXT[btype]}
    </button>
  )
}

// Memory Function Button
export function MemoryFunctionButton({
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

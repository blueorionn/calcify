'use client'
import { useReducer, useEffect } from 'react'
import { reducer, INITIAL_STATE, ACTIONS } from '@/core/arithmetic'
import {
  DigitButton,
  OperationButton,
  PeriodButton,
  EvaluateButton,
  ClearButton,
  MemoryFunctionButton,
  DeleteButton,
} from '@/components/calc/Button'

export default function ArithmeticCalculator() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key >= '0' && e.key <= '9') {
        dispatch({ type: ACTIONS.ADD_DIGIT, payload: e.key })
        return
      }

      switch (e.key) {
        case '.':
          dispatch({ type: ACTIONS.ADD_DIGIT, payload: '.' })
          break
        case '+':
        case '-':
        case '*':
        case '/':
        case '%':
          dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: e.key })
          break
        case 'Enter':
        case '=':
          e.preventDefault()
          dispatch({ type: ACTIONS.EVALUATE })
          break
        case 'Backspace':
          dispatch({ type: ACTIONS.DELETE })
          break
        case 'Escape':
        case 'Delete':
          dispatch({ type: ACTIONS.CLEAR })
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [dispatch])

  return (
    <>
      <div
        className='bg-card border-border grid w-full max-w-96 grid-flow-row border shadow-lg'
        style={{ aspectRatio: '9/14' }}
      >
        {/* LCD Display */}
        <div className='mb-4 w-full overflow-hidden'>
          <div className='p-4 text-right'>
            <div
              className='text-foreground my-0.5 text-xl font-light tracking-tight'
              aria-label='Previous Operand'
            >
              {state.previousOperand} {state.operation}
            </div>
            <div
              className='text-foreground hide-scrollbar my-0.5 overflow-x-scroll text-3xl font-light tracking-tight'
              aria-label='Current Operand'
            >
              {state.currentOperand}
            </div>
          </div>
        </div>

        <div className='grid grid-cols-4 gap-1'>
          {/* Memory Function Row */}
          <MemoryFunctionButton mtype='add' />
          <MemoryFunctionButton mtype='sub' />
          <MemoryFunctionButton mtype='recall' />
          <MemoryFunctionButton mtype='clear' />

          {/* Row 1: AC, C, %, ÷ */}
          <ClearButton btype='all_clear' dispatch={dispatch} />
          <ClearButton btype='clear' dispatch={dispatch} />
          <DeleteButton dispatch={dispatch} />
          <OperationButton operation='/' dispatch={dispatch} />

          {/* Row 2: 7, 8, 9, × */}
          <DigitButton digit={7} dispatch={dispatch} />
          <DigitButton digit={8} dispatch={dispatch} />
          <DigitButton digit={9} dispatch={dispatch} />
          <OperationButton operation='*' dispatch={dispatch} />

          {/* Row 3: 4, 5, 6, − */}
          <DigitButton digit={4} dispatch={dispatch} />
          <DigitButton digit={5} dispatch={dispatch} />
          <DigitButton digit={6} dispatch={dispatch} />
          <OperationButton operation='-' dispatch={dispatch} />

          {/* Row 4: 1, 2, 3, + */}
          <DigitButton digit={1} dispatch={dispatch} />
          <DigitButton digit={2} dispatch={dispatch} />
          <DigitButton digit={3} dispatch={dispatch} />
          <OperationButton operation='+' dispatch={dispatch} />

          {/* Row 5: 0, ., = */}
          <DigitButton digit={0} dispatch={dispatch} />
          <OperationButton operation='%' dispatch={dispatch} />
          <PeriodButton dispatch={dispatch} />
          <EvaluateButton dispatch={dispatch} />
        </div>
      </div>
    </>
  )
}

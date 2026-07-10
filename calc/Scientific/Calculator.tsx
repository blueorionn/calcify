'use client'
import { useReducer, useEffect } from 'react'
import { INITIAL_STATE, ACTIONS, reducer } from './scientific'
import {
  AngleButton,
  DigitButton,
  PeriodButton,
  OperationButton,
  TrigButton,
  ConstantButton,
  LogButton,
  FunctionButton,
  ParenthesesButton,
  ClearButton,
  EvaluateButton,
} from './components/Button'
import { HistoryIcon } from 'lucide-react'
import 'katex/dist/katex.min.css'

export default function ScientificCalculator() {
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
        className='bg-card border-border grid w-full max-w-lg grid-flow-row border shadow-lg'
        style={{ aspectRatio: '9/14' }}
      >
        {/* LCD Display */}
        <div className='mb-2 w-full overflow-hidden'>
          <div className='p-2.5 py-4'>
            <HistoryIcon size={24} className='ml-auto' />
          </div>
          <div className='p-4 py-2.5 text-right'>
            <div
              className='text-foreground py-1 text-xl font-light tracking-tight'
              aria-label='Previous Operand'
            >
              {state.previousOperand} {state.operation}
            </div>
            <div
              className='text-foreground hide-scrollbar overflow-x-scroll py-0.5 text-3xl font-light tracking-tight'
              aria-label='Current Operand'
            >
              {state.currentOperand}
            </div>
          </div>
        </div>

        <div className='grid grid-cols-6 gap-1'>
          <AngleButton active='deg' />
          <ParenthesesButton type='(' />
          <ParenthesesButton type=')' />
          <ClearButton type='AC' dispatch={dispatch} />
          <ClearButton type='DEL' dispatch={dispatch} />

          <ConstantButton constant='pi' fn='\pi' />
          <ConstantButton constant='e' />
          <TrigButton trig='sin' />
          <TrigButton trig='cos' />
          <TrigButton trig='tan' />
          <OperationButton operation='/' dispatch={dispatch} />

          <LogButton type='log' />
          <LogButton type='ln' />
          <DigitButton digit={7} dispatch={dispatch} />
          <DigitButton digit={8} dispatch={dispatch} />
          <DigitButton digit={9} dispatch={dispatch} />
          <OperationButton operation='*' dispatch={dispatch} />

          <FunctionButton func='e^x' fn='e^x' />
          <FunctionButton func='x^y' fn='x^y' />
          <DigitButton digit={4} dispatch={dispatch} />
          <DigitButton digit={5} dispatch={dispatch} />
          <DigitButton digit={6} dispatch={dispatch} />
          <OperationButton operation='-' dispatch={dispatch} />

          <FunctionButton func='x!' />
          <FunctionButton func='|x|' />
          <DigitButton digit={1} dispatch={dispatch} />
          <DigitButton digit={2} dispatch={dispatch} />
          <DigitButton digit={3} dispatch={dispatch} />
          <OperationButton operation='+' dispatch={dispatch} />

          <OperationButton operation='+-' dispatch={dispatch} />
          <OperationButton operation='%' dispatch={dispatch} />
          <PeriodButton dispatch={dispatch} />
          <DigitButton digit={0} dispatch={dispatch} />
          <EvaluateButton dispatch={dispatch} />
        </div>
      </div>
    </>
  )
}

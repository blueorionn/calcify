'use client'
import { useReducer, useEffect } from 'react'
import { INITIAL_STATE, ACTIONS, reducer } from './scientific'
import {
  AngleButton,
  DigitButton,
  PeriodButton,
  OperationButton,
  InverseButton,
  TrigButton,
  ConstantButton,
  LogButton,
  ExponentialButton,
  FunctionButton,
  ParenthesesButton,
  MemoryButton,
  ClearButton,
  EvaluateButton,
} from './components/Button'
import 'katex/dist/katex.min.css'
import { InlineMath } from 'react-katex'

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
          <div className='p-4 text-right'>
            <div
              className='text-foreground py-1 text-xl font-light tracking-tight'
              aria-label='Previous Operand'
            >
              {state.previousAnswer}
            </div>
            <div
              className='text-foreground hide-scrollbar overflow-x-scroll py-0.5 text-3xl font-light tracking-tight'
              aria-label='Current Operand'
            >
              {<InlineMath math={`\\mathtt${state.display}`} />}
            </div>
          </div>
        </div>

        <div className='grid grid-cols-6 gap-1'>
          <MemoryButton mtype='clear' dispatch={dispatch} />
          <MemoryButton mtype='recall' dispatch={dispatch} />
          <MemoryButton mtype='sub' dispatch={dispatch} />
          <MemoryButton mtype='add' dispatch={dispatch} />
          <ClearButton ctype='AC' dispatch={dispatch} />
          <ClearButton ctype='DEL' dispatch={dispatch} />

          <ConstantButton constant='pi' dispatch={dispatch} />
          <ConstantButton constant='e' dispatch={dispatch} />
          <ParenthesesButton type='(' />
          <ParenthesesButton type=')' />
          <AngleButton active={state.angle} dispatch={dispatch} />

          <InverseButton value={state.inverse} dispatch={dispatch} />
          <TrigButton inverse={state.inverse} trig='sin' dispatch={dispatch} />
          <TrigButton inverse={state.inverse} trig='cos' dispatch={dispatch} />
          <TrigButton inverse={state.inverse} trig='tan' dispatch={dispatch} />
          <OperationButton operation='%' dispatch={dispatch} />
          <OperationButton operation='/' dispatch={dispatch} />

          <LogButton inverse={state.inverse} ltype='log' dispatch={dispatch} />
          <LogButton inverse={state.inverse} ltype='ln' dispatch={dispatch} />
          <DigitButton digit={7} dispatch={dispatch} />
          <DigitButton digit={8} dispatch={dispatch} />
          <DigitButton digit={9} dispatch={dispatch} />
          <OperationButton operation='*' dispatch={dispatch} />

          <ExponentialButton
            inverse={state.inverse}
            etype={{
              name: 'square',
              normal: '\\mathsf{x^2}',
              inverse: '\\mathsf{\\sqrt{x}}',
            }}
            dispatch={dispatch}
          />
          <ExponentialButton
            inverse={state.inverse}
            etype={{
              name: 'cube',
              normal: '\\mathsf{x^3}',
              inverse: '\\mathsf{\\sqrt[3]{x}}',
            }}
            dispatch={dispatch}
          />
          <DigitButton digit={4} dispatch={dispatch} />
          <DigitButton digit={5} dispatch={dispatch} />
          <DigitButton digit={6} dispatch={dispatch} />
          <OperationButton operation='-' dispatch={dispatch} />

          <ExponentialButton
            inverse={state.inverse}
            etype={{
              name: 'XY',
              normal: '\\mathsf{x^{y}}',
              inverse: '\\mathsf{\\sqrt[y]{x}}',
            }}
            dispatch={dispatch}
          />
          <FunctionButton
            ftype={{ fname: 'fact', ffunc: '\\mathsf{x!}' }}
            dispatch={dispatch}
          />
          <DigitButton digit={1} dispatch={dispatch} />
          <DigitButton digit={2} dispatch={dispatch} />
          <DigitButton digit={3} dispatch={dispatch} />
          <OperationButton operation='+' dispatch={dispatch} />

          <FunctionButton
            ftype={{ fname: 'plusminus', ffunc: '\\mathsf{\\pm}' }}
            dispatch={dispatch}
          />
          <FunctionButton
            ftype={{ fname: 'absolute', ffunc: '\\mathsf{|x|}' }}
            dispatch={dispatch}
          />
          <PeriodButton dispatch={dispatch} />
          <DigitButton digit={0} dispatch={dispatch} />
          <EvaluateButton dispatch={dispatch} />
        </div>
      </div>
    </>
  )
}

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

export default function ScientificCalculator() {
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
              0
            </div>
            <div
              className='text-foreground hide-scrollbar overflow-x-scroll py-0.5 text-3xl font-light tracking-tight'
              aria-label='Current Operand'
            >
              0
            </div>
          </div>
        </div>

        <div className='grid grid-cols-6 gap-1'>
          <AngleButton active='deg' />
          <ParenthesesButton type='(' />
          <ParenthesesButton type=')' />
          <ClearButton type='AC' />
          <ClearButton type='DEL' />

          <ConstantButton constant='pi' />
          <ConstantButton constant='e' />
          <TrigButton trig='sin' />
          <TrigButton trig='cos' />
          <TrigButton trig='tan' />
          <OperationButton operation='/' />

          <LogButton type='log' />
          <LogButton type='ln' />
          <DigitButton digit={7} />
          <DigitButton digit={8} />
          <DigitButton digit={9} />
          <OperationButton operation='*' />

          <FunctionButton func='e^x' />
          <FunctionButton func='x^y' />
          <DigitButton digit={4} />
          <DigitButton digit={5} />
          <DigitButton digit={6} />
          <OperationButton operation='-' />

          <FunctionButton func='x!' />
          <FunctionButton func='|x|' />
          <DigitButton digit={1} />
          <DigitButton digit={2} />
          <DigitButton digit={3} />
          <OperationButton operation='+' />

          <OperationButton operation='+-' />
          <OperationButton operation='%' />
          <PeriodButton />
          <DigitButton digit={0} />
          <EvaluateButton />
        </div>
      </div>
    </>
  )
}

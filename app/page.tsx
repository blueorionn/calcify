import Header from '@/components/Header'
import {
  DigitButton,
  OperationButton,
  PeriodButton,
  EvaluateButton,
  ClearButton,
  MemoryFunctionButton,
} from '@/components/calc/Button'
import { Share_Tech_Mono } from 'next/font/google'

const shareTechMono = Share_Tech_Mono({
  weight: '400',
})

export default function Home() {
  return (
    <>
      <Header />
      <main className='bg-muted dark:bg-background h-full w-full pb-12'>
        <section
          className={`${shareTechMono.className} flex h-full w-full items-center justify-center p-4`}
        >
          <div
            className='bg-card border-border grid w-full max-w-96 grid-flow-row border shadow-lg'
            style={{ aspectRatio: '9/14' }}
          >
            {/* LCD Display */}
            <div className='mb-4'>
              <div className='p-4 text-right'>
                <div
                  className='text-foreground my-0.5 text-xl font-light tracking-tight'
                  aria-label='Previous Operand'
                >
                  0
                </div>
                <div
                  className='text-foreground my-0.5 text-3xl font-light tracking-tight'
                  aria-label='Current Operand'
                >
                  0
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
              <ClearButton btype='all_clear' />
              <ClearButton btype='clear' />
              <OperationButton operation='%' />
              <OperationButton operation='/' />

              {/* Row 2: 7, 8, 9, × */}
              <DigitButton digit={7} />
              <DigitButton digit={8} />
              <DigitButton digit={9} />
              <OperationButton operation='*' />

              {/* Row 3: 4, 5, 6, − */}
              <DigitButton digit={4} />
              <DigitButton digit={5} />
              <DigitButton digit={6} />
              <OperationButton operation='-' />

              {/* Row 4: 1, 2, 3, + */}
              <DigitButton digit={1} />
              <DigitButton digit={2} />
              <DigitButton digit={3} />
              <OperationButton operation='+' />

              {/* Row 5: 0, ., = */}
              <DigitButton digit={0} />
              <PeriodButton />
              <EvaluateButton />
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

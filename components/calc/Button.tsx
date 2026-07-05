const operatorDisplay: Record<string, string> = {
  '+': '+',
  '-': '\u2212',
  '*': '\u00D7',
  '/': '\u00F7',
  '%': '\u0025',
}

export function DigitButton({ digit }: { digit: number }) {
  return (
    <button className='bg-secondary text-foreground py-4 text-xl font-medium transition-colors duration-200 hover:brightness-85 active:brightness-75'>
      {digit}
    </button>
  )
}

export function PeriodButton() {
  return (
    <button className='bg-secondary text-foreground py-4 text-xl font-medium transition-colors duration-200 hover:brightness-85 active:brightness-75'>
      .
    </button>
  )
}

export function OperationButton({
  operation,
}: {
  operation: '+' | '-' | '*' | '/' | '%'
}) {
  return (
    <button className='bg-accent text-accent-foreground py-4 text-xl font-medium transition-colors duration-200 hover:brightness-85 active:brightness-75'>
      {operatorDisplay[operation]}
    </button>
  )
}

export function EvaluateButton() {
  return (
    <button className='bg-primary hover:bg-primary/80 text-primary-foreground active:bg-primary/60 col-span-2 py-4 text-xl font-medium transition-colors duration-200'>
      =
    </button>
  )
}

// Clear Button
export function ClearButton({ btype }: { btype: 'clear' | 'all_clear' }) {
  const TEXT = {
    clear: 'C',
    all_clear: 'AC',
  }

  return (
    <button className='bg-muted py-4 text-sm font-medium tracking-wide uppercase transition-colors duration-200 hover:brightness-85 active:brightness-75'>
      {TEXT[btype]}
    </button>
  )
}

// Memory Function Button
export function MemoryFunctionButton({
  mtype,
}: {
  mtype: 'add' | 'sub' | 'recall' | 'clear'
}) {
  const TEXT_DISPLAY = {
    add: 'M+',
    sub: 'M-',
    recall: 'MR',
    clear: 'MC',
  }
  return (
    <button className='bg-muted text-muted-foreground hover:bg-muted/80 py-2 text-sm font-medium transition-colors duration-200 active:brightness-75'>
      {TEXT_DISPLAY[mtype]}
    </button>
  )
}

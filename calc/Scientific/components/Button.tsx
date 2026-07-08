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
  operation: '+' | '-' | '*' | '/' | '%' | '+-'
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
    <button className='bg-accent text-accent-foreground py-4 text-xl font-medium transition-colors duration-200 hover:brightness-85 active:brightness-75'>
      {operatorDisplay[operation]}
    </button>
  )
}

export function ConstantButton({ constant }: { constant: 'pi' | 'e' }) {
  const constantDisplay: Record<string, string> = {
    pi: '\u03C0',
    e: 'e',
  }

  return (
    <button className='bg-accent text-accent-foreground py-4 text-xl font-medium transition-colors duration-200 hover:brightness-85 active:brightness-75'>
      {constantDisplay[constant]}
    </button>
  )
}

export function TrigButton({ trig }: { trig: 'sin' | 'cos' | 'tan' }) {
  return (
    <button className='bg-accent text-accent-foreground py-4 text-xl font-medium transition-colors duration-200 hover:brightness-85 active:brightness-75'>
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

export function FunctionButton({ func }: { func: string }) {
  return (
    <button className='bg-secondary text-foreground py-4 text-xl font-medium transition-colors duration-200 hover:brightness-85 active:brightness-75'>
      {func}
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

export function ClearButton({ type }: { type: 'AC' | 'DEL' }) {
  return (
    <button className='bg-secondary text-foreground py-4 text-xl font-medium transition-colors duration-200 hover:brightness-85 active:brightness-75'>
      {type}
    </button>
  )
}

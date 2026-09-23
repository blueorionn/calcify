'use client'
import { useCallback, useMemo, useState } from 'react'
import { ENERGY_UNIT_LIST, convertEnergy, formatEnergy } from './lib'
import type { EnergyUnit } from './lib'

const DEFAULT_FROM: EnergyUnit = 'kWh'
const DEFAULT_TO: EnergyUnit = 'J'

// Static list — safe to build once at module level.
const UNIT_OPTIONS = ENERGY_UNIT_LIST.map((unit) => (
  <option key={unit.symbol} value={unit.symbol}>
    {unit.name} ({unit.symbol})
  </option>
))

export default function EnergyConversion() {
  const [input, setInput] = useState('1')
  const [fromUnit, setFromUnit] = useState<EnergyUnit>(DEFAULT_FROM)
  const [toUnit, setToUnit] = useState<EnergyUnit>(DEFAULT_TO)

  // Live-derived result — conversion is pure and synchronous, so there is no
  // submit button, no debounce and no stored result state to go stale.
  const parsed = input.trim() === '' ? null : Number(input)

  const { result, inputError } = useMemo(() => {
    if (parsed === null) return { result: null, inputError: null }
    if (!Number.isFinite(parsed)) {
      return { result: null, inputError: 'Enter a valid number' }
    }
    try {
      return {
        result: convertEnergy(parsed, fromUnit, toUnit),
        inputError: null,
      }
    } catch (err) {
      return {
        result: null,
        inputError: err instanceof Error ? err.message : 'Conversion failed',
      }
    }
  }, [parsed, fromUnit, toUnit])

  const unitRate = useMemo(() => {
    try {
      return convertEnergy(1, fromUnit, toUnit)
    } catch {
      return null
    }
  }, [fromUnit, toUnit])

  const handleSwap = useCallback(() => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
  }, [fromUnit, toUnit])

  const handleReset = useCallback(() => {
    setInput('')
    setFromUnit(DEFAULT_FROM)
    setToUnit(DEFAULT_TO)
  }, [])

  const selectClasses =
    'border-border bg-secondary text-foreground focus:ring-accent/50 w-full rounded border px-4 py-3 font-medium transition-all focus:ring-2 focus:outline-none'

  return (
    <>
      <div className='bg-card border-border w-full max-w-md rounded border p-8 shadow-lg'>
        <div className='mb-6'>
          <label
            htmlFor='energy-from-value'
            className='text-foreground mb-3 block text-sm font-medium'
          >
            From
          </label>
          <div className='space-y-3'>
            <input
              id='energy-from-value'
              type='number'
              step='any'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='0'
              className='border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:ring-accent/50 w-full rounded border px-4 py-3 text-lg font-semibold transition-all focus:ring-2 focus:outline-none'
            />
            <select
              aria-label='From unit'
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value as EnergyUnit)}
              className={selectClasses}
            >
              {UNIT_OPTIONS}
            </select>
          </div>
        </div>

        <div className='mb-6 flex justify-center'>
          <button
            className='bg-accent hover:bg-accent/90 text-accent-foreground active:bg-accent/80 cursor-pointer rounded-full p-3 shadow-md transition-colors duration-200'
            title='Swap units'
            onClick={handleSwap}
          >
            <svg
              className='h-5 w-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4'
              />
            </svg>
          </button>
        </div>

        <div className='mb-8'>
          <label
            htmlFor='energy-to-result'
            className='text-foreground mb-3 block text-sm font-medium'
          >
            To
          </label>
          <div className='space-y-3'>
            <div
              id='energy-to-result'
              className='border-border bg-secondary text-foreground flex w-full items-center justify-between gap-4 rounded border px-4 py-3 text-lg font-bold'
            >
              {inputError ? (
                <span className='text-destructive text-sm font-medium'>
                  {inputError}
                </span>
              ) : result !== null ? (
                <span title={String(result)}>{formatEnergy(result)}</span>
              ) : (
                <span className='text-muted-foreground font-semibold'>—</span>
              )}
              <span className='text-muted-foreground shrink-0 text-sm font-medium'>
                {toUnit}
              </span>
            </div>
            <select
              aria-label='To unit'
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value as EnergyUnit)}
              className={selectClasses}
            >
              {UNIT_OPTIONS}
            </select>
          </div>
          {unitRate !== null && fromUnit !== toUnit && (
            <p className='text-muted-foreground mt-2 text-xs'>
              1 {fromUnit} = {formatEnergy(unitRate)} {toUnit}
            </p>
          )}
        </div>

        <button
          className='bg-primary hover:bg-primary/80 text-primary-foreground active:bg-primary/60 w-full cursor-pointer rounded py-4 text-xl font-medium transition-colors duration-200'
          onClick={handleReset}
        >
          Clear
        </button>
      </div>
      <p className='text-muted-foreground mt-6 text-center text-xs'>
        Conversion factors are exact definitions where noted
      </p>
    </>
  )
}

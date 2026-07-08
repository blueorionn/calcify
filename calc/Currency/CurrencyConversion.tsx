'use client'
import { useState, useEffect, useCallback } from 'react'
import {
  fetchCurrencies,
  fetchRate,
  currencyToFlag,
  currencyLabel,
} from '@/lib/flags'
import type { CurrencyEntry } from '@/lib/flags'
import { useDebounce } from '@/hooks/useDebounce'

export default function CurrencyConversion() {
  const [amount, setAmount] = useState('')
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('EUR')
  const [result, setResult] = useState<number | null>(null)
  const [rate, setRate] = useState<number | null>(null)
  const [rateDate, setRateDate] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currencies, setCurrencies] = useState<CurrencyEntry[]>([])
  const [currenciesLoading, setCurrenciesLoading] = useState(true)

  const debouncedAmount = useDebounce(amount, 500)

  // Fetch the currency list on mount
  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await fetchCurrencies()
        if (!cancelled) setCurrencies(data)
      } catch {
        if (!cancelled) setError('Failed to load currencies')
      } finally {
        if (!cancelled) setCurrenciesLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  // Fetch the exchange rate when inputs change
  useEffect(() => {
    const controller = new AbortController()

    async function loadRate() {
      if (!debouncedAmount || fromCurrency === toCurrency) {
        if (fromCurrency === toCurrency) {
          setRate(1)
          const parsed = parseFloat(debouncedAmount)
          setResult(isNaN(parsed) ? null : parsed)
        } else {
          setResult(null)
          setRate(null)
        }
        setRateDate(null)
        setIsLoading(false)
        setError(null)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const { rate: fetchedRate, date } = await fetchRate(
          fromCurrency,
          toCurrency
        )
        setRate(fetchedRate)
        setRateDate(date)

        const parsed = parseFloat(debouncedAmount)
        if (!isNaN(parsed)) setResult(parsed * fetchedRate)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch')
        setRate(null)
        setRateDate(null)
        setResult(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadRate()
  }, [debouncedAmount, fromCurrency, toCurrency])

  const handleSwap = useCallback(() => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    if (result !== null) {
      setAmount(result.toFixed(2))
      setResult(parseFloat(amount) || null)
    }
  }, [fromCurrency, toCurrency, amount, result])

  const handleReset = useCallback(() => {
    setAmount('')
    setResult(null)
    setRate(null)
    setRateDate(null)
    setError(null)
  }, [])

  const currencyOptions = currencies.map((c) => (
    <option key={c.iso_code} value={c.iso_code}>
      {currencyLabel(c)}
    </option>
  ))

  const fromFlag = currencyToFlag(fromCurrency)
  const toFlag = currencyToFlag(toCurrency)

  return (
    <>
      <div className='bg-card border-border w-full max-w-md rounded border p-8 shadow-lg'>
        <div className='mb-6'>
          <label className='text-foreground mb-3 block text-sm font-medium'>
            From
          </label>
          <div className='space-y-3'>
            <div className='relative'>
              {fromFlag && (
                <span className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-lg'>
                  {fromFlag}
                </span>
              )}
              <input
                type='number'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder='0.00'
                className={`border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:ring-accent/50 w-full rounded border py-3 text-lg font-semibold transition-all focus:ring-2 focus:outline-none ${fromFlag ? 'pr-4 pl-11' : 'px-4'}`}
              />
            </div>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              disabled={currenciesLoading}
              className='border-border bg-secondary text-foreground focus:ring-accent/50 w-full rounded border px-4 py-3 font-medium transition-all focus:ring-2 focus:outline-none'
            >
              {currenciesLoading ? (
                <option>Loading currencies…</option>
              ) : (
                currencyOptions
              )}
            </select>
          </div>
        </div>
        <div className='mb-6 flex justify-center'>
          <button
            className='bg-accent hover:bg-accent/90 text-accent-foreground active:bg-accent/80 rounded-full p-3 shadow-md transition-colors duration-200'
            title='Swap currencies'
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
          <label className='text-foreground mb-3 block text-sm font-medium'>
            To
          </label>
          <div className='space-y-3'>
            <div className='relative'>
              {toFlag && (
                <span className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-lg'>
                  {toFlag}
                </span>
              )}
              <div
                className={`border-border bg-secondary text-foreground flex w-full items-center rounded border py-3 text-lg font-semibold ${toFlag ? 'pr-4 pl-11' : 'px-4'}`}
              >
                {isLoading ? (
                  <span className='text-muted-foreground animate-pulse'>
                    Converting…
                  </span>
                ) : error ? (
                  <span className='text-destructive text-sm'>Error</span>
                ) : result !== null ? (
                  <span>
                    {result.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 4,
                    })}
                  </span>
                ) : (
                  <span className='text-muted-foreground'>0.00</span>
                )}
              </div>
            </div>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              disabled={currenciesLoading}
              className='border-border bg-secondary text-foreground focus:ring-accent/50 w-full rounded border px-4 py-3 font-medium transition-all focus:ring-2 focus:outline-none'
            >
              {currenciesLoading ? (
                <option>Loading currencies…</option>
              ) : (
                currencyOptions
              )}
            </select>
          </div>
          {rate !== null && amount && fromCurrency !== toCurrency && (
            <p className='text-muted-foreground mt-2 text-xs'>
              1 {fromCurrency} = {rate.toFixed(6)} {toCurrency}
              {rateDate && ` · ${rateDate}`}
            </p>
          )}
        </div>
        <button
          className='bg-primary hover:bg-primary/80 text-primary-foreground active:bg-primary/60 w-full rounded py-4 text-xl font-medium transition-colors duration-200'
          onClick={handleReset}
        >
          Clear
        </button>
      </div>
      <p className='text-muted-foreground mt-6 text-center text-xs'>
        Exchange rates are approximate and may vary
      </p>
    </>
  )
}

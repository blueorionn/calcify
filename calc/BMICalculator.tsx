'use client'

import { useState } from 'react'

type Unit = 'metric' | 'imperial'

function getCategory(bmi: number) {
  if (bmi < 18.5) return 'Underweight'
  if (bmi < 25) return 'Normal'
  if (bmi < 30) return 'Overweight'
  return 'Obese'
}

export default function BMICalculator() {
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [unit, setUnit] = useState<Unit>('metric')

  const calculateBMI = () => {
    const h = Number(height)
    const w = Number(weight)

    if (h <= 0 || w <= 0) return null

    const bmi = unit === 'metric' ? w / (h / 100) ** 2 : (703 * w) / h ** 2

    return {
      bmi: bmi.toFixed(2),
      category: getCategory(bmi),
    }
  }

  const result = calculateBMI()

  const reset = () => {
    setHeight('')
    setWeight('')
  }

  return (
    <div className='bg-card border-border w-full max-w-md rounded border p-8 shadow-lg'>
      <div className='mb-8 flex gap-4'>
        {(['metric', 'imperial'] as const).map((u) => (
          <button
            key={u}
            onClick={() => setUnit(u)}
            className={`flex-1 rounded py-3 font-medium transition-colors ${
              unit === u
                ? 'bg-background text-accent-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {u === 'metric' ? 'Metric (kg, cm)' : 'Imperial (lb, in)'}
          </button>
        ))}
      </div>

      <div className='mb-8 space-y-4'>
        <div>
          <label className='mb-2 block text-sm font-medium'>
            Height {unit === 'metric' ? '(cm)' : '(in)'}
          </label>
          <input
            type='number'
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className='border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:ring-accent/50 w-full rounded border px-4 py-3 transition-all focus:ring-2 focus:outline-none'
          />
        </div>

        <div>
          <label className='mb-2 block text-sm font-medium'>
            Weight {unit === 'metric' ? '(kg)' : '(lb)'}
          </label>
          <input
            type='number'
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className='border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:ring-accent/50 w-full rounded border px-4 py-3 transition-all focus:ring-2 focus:outline-none'
          />
        </div>
      </div>

      <div className='mb-8 rounded-xl border p-6'>
        <div className='text-center'>
          <p className='text-muted-foreground mb-2 text-sm'>Your BMI</p>

          <p className='text-5xl font-bold'>{result?.bmi ?? '0.00'}</p>

          <p className='text-lg font-semibold'>{result?.category ?? '-'}</p>
        </div>
      </div>

      <button className='bg-primary text-primary-foreground hover:bg-primary/80 w-full rounded py-3'>
        Calculate
      </button>

      <button
        onClick={reset}
        className='bg-muted hover:bg-muted/80 my-2 w-full rounded py-3'
      >
        Reset
      </button>
    </div>
  )
}

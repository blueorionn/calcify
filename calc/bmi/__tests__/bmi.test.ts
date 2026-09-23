import { describe, it, expect } from 'vitest'
import { calBMIFunc, getCategory } from '../bmi'

// BMI CALCULATOR TESTS
describe('calBMIFunc', () => {
  it('calculates BMI in metric (kg, cm)', () => {
    // 70 / (1.75)² = 22.86
    const result = calBMIFunc({ unit: 'metric', w: 70, h: 175 })
    expect(result).toBeCloseTo(22.86, 1)
  })

  it('calculates BMI in imperial (lb, in)', () => {
    // (703 × 154) / 69² = 22.74
    const result = calBMIFunc({ unit: 'imperial', w: 154, h: 69 })
    expect(result).toBeCloseTo(22.74, 1)
  })

  it('handles decimal inputs', () => {
    const result = calBMIFunc({ unit: 'metric', w: 68.5, h: 172.3 })
    expect(result).toBeCloseTo(23.08, 1)
  })
})

// GET CATEGORY TESTS
describe('getCategory', () => {
  it('returns Underweight for bmi below 18.5', () => {
    const result = getCategory(16)
    expect(result.indicator).toBe('Underweight')
    expect(result.color).toBe('text-blue-500')
  })

  it('returns Normal at exactly 18.5', () => {
    const result = getCategory(18.5)
    expect(result.indicator).toBe('Normal')
    expect(result.color).toBe('text-green-500')
  })

  it('returns Normal at boundary 24.99', () => {
    const result = getCategory(24.99)
    expect(result.indicator).toBe('Normal')
  })

  it('returns Overweight at exactly 25', () => {
    const result = getCategory(25)
    expect(result.indicator).toBe('Overweight')
    expect(result.color).toBe('text-yellow-500')
  })

  it('returns Obese at exactly 30', () => {
    const result = getCategory(30)
    expect(result.indicator).toBe('Obese')
    expect(result.color).toBe('text-red-500')
  })
})

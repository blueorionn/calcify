export const calBMIFunc = ({
  unit,
  w,
  h,
}: {
  unit: 'metric' | 'imperial'
  w: number
  h: number
}) => {
  return unit === 'metric' ? w / (h / 100) ** 2 : (703 * w) / h ** 2
}

export function getCategory(bmi: number) {
  if (bmi < 18.5) return { indicator: 'Underweight', color: 'text-blue-500' }
  if (bmi < 25) return { indicator: 'Normal', color: 'text-green-500' }
  if (bmi < 30) return { indicator: 'Overweight', color: 'text-yellow-500' }
  return { indicator: 'Obese', color: 'text-red-500' }
}

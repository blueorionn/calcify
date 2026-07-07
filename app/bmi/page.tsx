import Header from '@/components/Header'
import BMICalculator from '@/calc/BMICalculator'

export default function Page() {
  return (
    <>
      <Header />
      <main className='bg-muted dark:bg-background h-full w-full pb-12'>
        <section
          className={`flex h-full w-full flex-col items-center justify-center p-4`}
        >
          <BMICalculator />
        </section>
      </main>
    </>
  )
}

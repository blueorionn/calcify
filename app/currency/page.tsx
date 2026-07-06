import Header from '@/components/Header'
import CurrencyConversion from '@/calc/CurrencyConversion'

export default function Home() {
  return (
    <>
      <Header />
      <main className='bg-muted dark:bg-background h-full w-full pb-12'>
        <section
          className={`flex h-full w-full flex-col items-center justify-center p-4`}
        >
          <CurrencyConversion />
        </section>
      </main>
    </>
  )
}

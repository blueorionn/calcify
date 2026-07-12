import type { Metadata } from 'next'
import Header from '@/components/Header'
import CurrencyConversion from '@/calc/Currency/CurrencyConversion'

export const metadata: Metadata = {
  title: 'Currency Conversion | Calcify',
}

export default function Page() {
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
